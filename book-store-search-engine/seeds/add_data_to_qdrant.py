import logging
import numpy as np
import pandas as pd
import json
import psycopg
from qdrant_client import QdrantClient, models
from constants.constants import BOOK_COLLECTION_NAME, SPARSE_FIELD, DENSE_FIELD
import dotenv
import os

dotenv.load_dotenv()
QDRANT_URL = os.getenv('QDRANT_URL')

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
    logging.info("Starting Qdrant data upload script")

    client = QdrantClient(url=QDRANT_URL)

    # --- Create collection if it doesn't exist ---
    if not client.collection_exists(BOOK_COLLECTION_NAME):
        logging.info(f"Creating collection '{BOOK_COLLECTION_NAME}'")
        client.create_collection(
            collection_name=BOOK_COLLECTION_NAME,
            vectors_config={
                DENSE_FIELD: models.VectorParams(
                    size=1024,
                    distance=models.Distance.COSINE,
                    datatype=models.Datatype.FLOAT16
                ),
            },
            sparse_vectors_config={
                SPARSE_FIELD: models.SparseVectorParams(),
            },
        )
    else:
        logging.info(f"Collection '{BOOK_COLLECTION_NAME}' already exists")

    # --- Database connection ---
    logging.info("Connecting to PostgreSQL database")
    conn = psycopg.connect(
        dbname=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_HOST'),
        port=os.getenv('POSTGRES_PORT')
    )

    # --- SQL queries ---
    query_books = """
        SELECT 
            b.id AS book_id,
            p.title,
            p.description_summary,
            p.price,
            p.rating,
            p.rating_count
        FROM books b
        JOIN products p ON b.product_id = p.id
        WHERE p.description_summary IS NOT NULL 
        AND LENGTH(p.description_summary) > 10
        ORDER BY b.id;
    """

    query_authors = """
        SELECT 
            a.id AS author_id,
            a.name AS author_name,
            b.id AS book_id
        FROM books b
        JOIN book_authors ba ON ba.book_id = b.id
        JOIN authors a ON a.id = ba.author_id
        JOIN products p ON b.product_id = p.id
        WHERE p.description_summary IS NOT NULL 
        AND LENGTH(p.description_summary) > 10
        ORDER BY b.id, a.name;
    """

    query_categories = """
        SELECT 
            c.id AS category_id,
            c.name AS category_name,
            b.id AS book_id
        FROM books b
        JOIN book_categories bc ON bc.book_id = b.id
        JOIN categories c ON c.id = bc.category_id
        JOIN products p ON b.product_id = p.id
        WHERE p.description_summary IS NOT NULL 
        AND LENGTH(p.description_summary) > 10
        ORDER BY b.id, c.name; 
    """

    logging.info("Executing queries")
    with conn.cursor() as cur:
        cur.execute(query_books)
        book_results = cur.fetchall()
        logging.info(f"Fetched {len(book_results)} books")

        cur.execute(query_authors)
        author_results = cur.fetchall()
        logging.info(f"Fetched {len(author_results)} author entries")

        cur.execute(query_categories)
        category_results = cur.fetchall()
        logging.info(f"Fetched {len(category_results)} category entries")

    conn.close()
    logging.info("Database connection closed")

    # --- Convert to DataFrames ---
    df_books = pd.DataFrame(book_results, columns=["book_id", "title", "description_summary", "price", "rating", "rating_count"])
    df_authors = pd.DataFrame(author_results, columns=["author_id", "author_name", "book_id"])
    df_categories = pd.DataFrame(category_results, columns=["category_id", "category_name", "book_id"])

    # --- Group authors and categories by book ---
    df_authors_grouped = df_authors.groupby("book_id")["author_name"].apply(lambda x: sorted(set(x))).reset_index()
    df_categories_grouped = df_categories.groupby("book_id")["category_name"].apply(lambda x: sorted(set(x))).reset_index()

    # --- Merge all into one DataFrame ---
    df_combined = df_books.merge(df_authors_grouped, on="book_id", how="left").merge(df_categories_grouped, on="book_id", how="left")
    df_combined["author_name"] = df_combined["author_name"].apply(lambda x: x if isinstance(x, list) else [])
    df_combined["category_name"] = df_combined["category_name"].apply(lambda x: x if isinstance(x, list) else [])
    df_combined.rename(columns={"author_name": "authors", "category_name": "categories"}, inplace=True)

    # --- Load embeddings ---
    logging.info("Loading dense and sparse embeddings")
    description_dense_embeddings = np.load("seeds/title_des_cat_dense_embeddings.npy")
    with open("seeds/description_embeddings.json", "r") as f:
        description_sparse_embeddings = json.load(f)

    # --- Validate lengths ---
    n_books = len(df_combined)
    if len(description_dense_embeddings) != n_books or len(description_sparse_embeddings) != n_books:
        logging.error("Length mismatch detected!")
        logging.error(f"Number of books: {n_books}, Dense embeddings: {len(description_dense_embeddings)}, Sparse embeddings: {len(description_sparse_embeddings)}")
        return

    logging.info("Lengths validated. Preparing points for upload")

    points = []
    skipped_points = 0
    for idx, row in df_combined.iterrows():
        dense_vector = description_dense_embeddings[idx]
        description_sparse = description_sparse_embeddings[idx]

        point = models.PointStruct(
            id=str(row["book_id"]),
            vector={
                DENSE_FIELD: dense_vector.tolist(),
                SPARSE_FIELD: models.SparseVector(
                    indices=description_sparse["indices"],
                    values=description_sparse["values"],
                ),
            },
            payload={
                "book_id": row["book_id"],
                "title": row["title"],
                "description_summary": row["description_summary"],
                "price": row["price"],
                "rating": row["rating"],
                "rating_count": row["rating_count"],
                "authors": row["authors"],
                "categories": row["categories"],
            },
        )
        points.append(point)

    logging.info(f"Prepared {len(points)} points, skipped {skipped_points} due to errors")

    # --- Create payload index ---
    client.create_payload_index(
        collection_name=BOOK_COLLECTION_NAME,
        field_name="authors",
        field_schema=models.TextIndexParams(
            type="text",
            tokenizer=models.TokenizerType.WORD,
            lowercase=True,
            phrase_matching=True,
        ),
    )

    logging.info("Uploading points to Qdrant")
    client.upload_points(
        collection_name=BOOK_COLLECTION_NAME,
        points=points,
        parallel=2,
        max_retries=3,
    )

    total_count = client.count(collection_name=BOOK_COLLECTION_NAME)
    logging.info(f"Upload complete. Total points in collection: {total_count}")

if __name__ == "__main__":
    main()
