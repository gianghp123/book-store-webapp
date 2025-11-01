import os
from typing import List, Dict, Any
import requests
from fastembed import SparseTextEmbedding, SparseEmbedding
from sentence_transformers import CrossEncoder
from qdrant_client import QdrantClient, models
from query_processor.book_filter_extractor import BookFilterExtractor
import dotenv
import logging
from redis import Redis
import json
import numpy as np
from langsmith import traceable
from constants.constants import (
    DENSE_FIELD,
    SPARSE_FIELD,
)

dotenv.load_dotenv()

class HybridRetriever:
    """Hybrid retriever for book search."""
    def __init__(
        self,
        qdrant_client: QdrantClient,
        redis_client: Redis,
        query_processor: BookFilterExtractor, 
        collection_name: str = "book_collection",
        dense_model: str = "jina-embeddings-v3",
        sparse_model: str = "prithivida/Splade_PP_en_v1",
        reranker_model: str = "jinaai/jina-reranker-v2-base-multilingual",
        task: str = "text-matching",
    ):
        """Initialize the hybrid retriever with dense, sparse, and reranker models.
        
        Args:
            qdrant_client (QdrantClient): The Qdrant client to use.
            collection_name (str, optional): The name of the collection to use. Defaults to "book_collection".
            dense_model (str, optional): The name of the dense model to use. Defaults to "jina-embeddings-v3" (Jina AI API).
            sparse_model (str, optional): The name of the sparse model to use. Defaults to "prithivida/Splade_PP_en_v1" (FastEmbed).
            reranker_model (str, optional): The name of the reranker model to use. Defaults to "jinaai/jina-reranker-v2-base-multilingual" (SentenceTransformers).
            task (str, optional): The task to use for the retriever. Defaults to "text-matching".

        Note: JINAI_API_KEY is required to use the Jina AI API.
        """
        if not qdrant_client.collection_exists(collection_name):
            qdrant_client.create_collection(collection_name)
        self.client = qdrant_client
        self.redis_client = redis_client
        self.collection_name = collection_name
        self.query_processor = query_processor
        self.api_url = "https://api.jina.ai/v1/embeddings"
        self.api_key = os.getenv("JINAI_API_KEY")
        self.model_name = dense_model
        self.task = task

        self.sparse_model = SparseTextEmbedding(model_name=sparse_model)

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        self.reranker = CrossEncoder(
            reranker_model,
            automodel_args={"torch_dtype": "auto"},
            trust_remote_code=True,
        )
    
    def _convert_numpy_types(self, obj):
        """Convert numpy types to native Python types for JSON serialization."""
        if isinstance(obj, (np.number, np.ndarray)):
            return obj.item() if hasattr(obj, 'item') else obj.tolist()
        elif isinstance(obj, dict):
            return {key: self._convert_numpy_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_numpy_types(item) for item in obj]
        elif isinstance(obj, tuple):
            return tuple(self._convert_numpy_types(item) for item in obj)
        else:
            return obj

    def embed_sparse(self, text: str) -> Dict[str, List[float]]:
        result: List[SparseEmbedding] = list(self.sparse_model.embed(text))
        return {"values": result[0].values, "indices": result[0].indices}

    def embed_dense(self, text: str) -> List[float]:
        data = {"model": self.model_name, "task": self.task, "input": [text]}
        r = requests.post(self.api_url, headers=self.headers, json=data, timeout=180)
        r.raise_for_status()
        return r.json()["data"][0]["embedding"]

    def embed_hybrid(self, text: str) -> Dict[str, Any]:
        dense = self.embed_dense(text)
        sparse = self.embed_sparse(text)
        return {"dense": dense, "sparse": sparse}

    def _format_book(self, payload: dict) -> str:
        title = payload.get("title", "")
        desc = payload.get("description_summary", "")
        cats = payload.get("categories", [])
        return f"Title: {title}. Description: {desc}. Categories: {', '.join(cats)}"
    
    def _build_filter(
        self,
        **kwargs
    )-> models.Filter | None:
        """
        Builds a Qdrant filter based on provided parameters.
        
        Args:
            title (str): Filter by book title (partial match)
            description_summary (str): Filter by description summary (partial match)
            price_min (float): Minimum price
            price_max (float): Maximum price
            rating_min (float): Minimum rating
            rating_max (float): Maximum rating
            rating_count_min (int): Minimum number of ratings
            rating_count_max (int): Maximum number of ratings
            authors (str or list): Author(s) to filter by (full-text match)
            categories (str or list): Category/categories to filter by (exact match)
        
        Returns:
            models.Filter: Qdrant filter structure or None if no filters are applied
        """
        title = kwargs.get('title')
        description_summary = kwargs.get('description_summary')
        price_min = kwargs.get('price_min')
        price_max = kwargs.get('price_max')
        rating_min = kwargs.get('rating_min')
        rating_max = kwargs.get('rating_max')
        rating_count_min = kwargs.get('rating_count_min')
        rating_count_max = kwargs.get('rating_count_max')
        authors = kwargs.get('authors')
        categories = kwargs.get('categories')
        
        must_conditions = []
        
        # Text-based filters for title and description_summary (using MatchText for partial matching)
        if title:
            must_conditions.append(
                models.FieldCondition(
                    key="title",
                    match=models.MatchText(text=title)
                )
            )
        
        if description_summary:
            must_conditions.append(
                models.FieldCondition(
                    key="description_summary",
                    match=models.MatchText(text=description_summary)
                )
            )
        
        # Range filters for numeric fields
        if price_min is not None or price_max is not None:
            range_filter = {}
            if price_min is not None:
                range_filter["gte"] = price_min
            if price_max is not None:
                range_filter["lte"] = price_max
            must_conditions.append(
                models.FieldCondition(
                    key="price",
                    range=models.Range(**range_filter)
                )
            )
        
        if rating_min is not None or rating_max is not None:
            range_filter = {}
            if rating_min is not None:
                range_filter["gte"] = rating_min
            if rating_max is not None:
                range_filter["lte"] = rating_max
            must_conditions.append(
                models.FieldCondition(
                    key="rating",
                    range=models.Range(**range_filter)
                )
            )
        
        if rating_count_min is not None or rating_count_max is not None:
            range_filter = {}
            if rating_count_min is not None:
                range_filter["gte"] = rating_count_min
            if rating_count_max is not None:
                range_filter["lte"] = rating_count_max
            must_conditions.append(
                models.FieldCondition(
                    key="rating_count",
                    range=models.Range(**range_filter)
                )
            )

        if authors:
            if isinstance(authors, str):
                authors = [authors]
            for author in authors:
                must_conditions.append(
                    models.FieldCondition(
                        key="authors",
                        match=models.MatchText(text=author)
                    )
                )

        if categories:
            if isinstance(categories, str):
                categories = [categories]
            must_conditions.append(
                models.FieldCondition(
                    key="categories",
                    match=models.MatchAny(any=categories)
                )
            )
        
        if must_conditions:
            return models.Filter(must=must_conditions)
        return None

    @traceable(run_type="retriever")
    def retrieve(
        self,
        query: str,
        dense_field: str = DENSE_FIELD,
        sparse_field: str = SPARSE_FIELD,
        dense_top_k: int = 100,
        sparse_top_k: int = 100,
        top_k: int = 50,
        **filters
    ):
        """Perform hybrid retrieval with Reciprocal Rank Fusion."""
        query_emb = self.embed_hybrid(query)


        retrieved_points = self.client.query_points(
            collection_name=self.collection_name,
            prefetch=[
                models.Prefetch(
                    query=models.SparseVector(
                        indices=query_emb["sparse"]["indices"],
                        values=query_emb["sparse"]["values"],
                    ),
                    using=sparse_field,
                    limit=sparse_top_k,
                ),
                models.Prefetch(
                    query=query_emb["dense"],
                    using=dense_field,
                    limit=dense_top_k,
                ),
            ],
            query=models.FusionQuery(fusion=models.Fusion.RRF),
            limit=top_k,
            query_filter=self._build_filter(**filters),
        )

        return {"retrieved_points": retrieved_points.points, "used_filter": filters}

    @traceable(run_type="chain", metadata={"reranker": "jinai-reranker-v2-base-multilingual"})
    def rerank(self, query: str, retrieved_points, top_k: int = 10) -> List[Dict[str, Any]]:
        """Rerank retrieved documents using CrossEncoder."""
        docs = [self._format_book(p.payload) for p in retrieved_points]
        ranked = self.reranker.rank(query=query, documents=docs, return_documents=True, top_k=top_k)
        return [{"book_id": retrieved_points[r['corpus_id']].id, 'score': r['score'], 'text': r['text']} for r in ranked]

    def search(self, query: str, top_n: int = 10, **kwargs) -> List[Dict[str, Any]]:
        """Complete pipeline: hybrid retrieval + reranking with no filter and query rewritting"""
        retrieved = self.retrieve(query, **kwargs)
        reranked = self.rerank(query, retrieved['retrieved_points'], top_k=top_n)
        return {"results": reranked, "used_query": query, "used_filter": retrieved['used_filter']}

    def search_with_filter(self, query: str, top_n: int = 10, **kwargs) -> List[Dict[str, Any]]:
        """Complete pipeline: hybrid retrieval + reranking with filter and query rewriting."""
        logging.info('Start search with filter.')

        # Cache for final search results
        cache_key = f"{query}_{top_n}_{json.dumps(kwargs, sort_keys=True)}"
        cached_result = self.redis_client.get(cache_key)
        if cached_result:
            logging.info('Cache hit (search result).')
            cached_data = json.loads(cached_result)
            return self._convert_numpy_types(cached_data)

        # --- Cache for structured query ---
        structured_cache_key = f"structured_query::{query}"
        structured_cached = self.redis_client.get(structured_cache_key)

        if structured_cached:
            logging.info('Cache hit (structured query).')
            structured_query = json.loads(structured_cached)
        else:
            logging.info('Cache miss (structured query).')
            structured_query = self.query_processor.extract(query)
            self.redis_client.setex(structured_cache_key, 60 * 60, json.dumps(structured_query))

        # Merge filters into kwargs
        kwargs.update(structured_query)

        # Perform retrieval and reranking
        result = self.search(structured_query.get("rewrite_query", query), top_n=top_n, **kwargs)
        result = self._convert_numpy_types(result)

        # Cache final search results
        self.redis_client.setex(cache_key, 60 * 60, json.dumps(result))

        logging.info('End search with filter.')
        return result





        
