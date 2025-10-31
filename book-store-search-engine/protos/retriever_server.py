from protos.retriever_pb2_grpc import HybridBookRetrieverServicer as BaseServicer
from protos.retriever_pb2 import RetrieveRequest, RetrieveResponse
import logging
from qdrant_client import QdrantClient
import os
from retriever.hybrid_retriever import HybridRetriever
from query_processor.book_filter_extractor import BookFilterExtractor
from redis import Redis

logging.basicConfig(level=logging.INFO)

class HybridBookRetrieverServicer(BaseServicer):
    def __init__(self, model: HybridRetriever):
        self.model = model

    
    def Retrieve(self, request: RetrieveRequest, context):
        logging.info(request)

    
        query = request.query
        if not query:
            logging.info('End retrieve')
            return RetrieveResponse(book_ids=[], scores=[])
        logging.info('Extract query')
        # Build kwargs dynamically
        kwargs = {}
        if request.dense_top_k != 0:
            kwargs['dense_top_k'] = request.dense_top_k
        if request.sparse_top_k != 0:
            kwargs['sparse_top_k'] = request.sparse_top_k
        if request.top_k != 0:
            kwargs['top_k'] = request.top_k
        if request.top_n != 0:
            kwargs['top_n'] = request.top_n
        logging.info('Start retrieve')
        # Call your hybrid retriever
        results = self.model.search_with_filter(
            query=query,
            **kwargs
        )

        book_ids = [r['book_id'] for r in results['results']]
        scores = [r.get('score', 0.0) for r in results['results']]

        logging.info('End retrieve')
        return RetrieveResponse(book_ids=book_ids, scores=scores)
