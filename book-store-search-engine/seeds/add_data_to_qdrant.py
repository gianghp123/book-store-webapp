import logging
import numpy as np
import pandas as pd
import json
import psycopg
from qdrant_client import QdrantClient, models
from constants.constants import BOOK_COLLECTION_NAME, SPARSE_FIELD, DENSE_FIELD
import dotenv
import os
import time

dotenv.load_dotenv()
QDRANT_URL = os.getenv('QDRANT_URL')

def add_data_to_qdrant():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
    logging.info("Starting Qdrant data upload script")

    client = QdrantClient(url=QDRANT_URL)

    # --- Create collection if it doesn't exist ---
    if client.collection_exists(BOOK_COLLECTION_NAME):
        count = client.count(collection_name=BOOK_COLLECTION_NAME)
        if count.count > 0:
            logging.info(f"Collection '{BOOK_COLLECTION_NAME}' already has {count.count} points. Skipping seeding.")
            return
        else:
            logging.info(f"Collection '{BOOK_COLLECTION_NAME}' exists but is empty. Deleting and recreating to ensure correct schema.")
            client.delete_collection(BOOK_COLLECTION_NAME)
    
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
    
    BATCH_SIZE = 1000 
    total_skipped = 0
    total_uploaded = 0

    for i in range(0, len(df_combined), BATCH_SIZE):
        batch_df = df_combined.iloc[i:i+BATCH_SIZE]
        batch_points = []
        batch_skipped = 0
        
        for idx, row in batch_df.iterrows():
            try:
                dense_vector = description_dense_embeddings[idx]
                description_sparse = description_sparse_embeddings[idx]
                
                # Validate dense vector
                if len(dense_vector) != 1024:
                    logging.warning(f"Skipping book_id {row['book_id']}: dense vector size is {len(dense_vector)}, expected 1024")
                    batch_skipped += 1
                    continue
                
                if np.isnan(dense_vector).any():
                    logging.warning(f"Skipping book_id {row['book_id']}: NaN values in dense vector")
                    batch_skipped += 1
                    continue
                
                # Validate sparse vector
                if len(description_sparse["indices"]) != len(description_sparse["values"]):
                    logging.warning(f"Skipping book_id {row['book_id']}: sparse vector length mismatch - indices: {len(description_sparse['indices'])}, values: {len(description_sparse['values'])}")
                    batch_skipped += 1
                    continue
                
                # Convert float64 to float32 to save memory
                dense_vector_list = dense_vector.astype(np.float32).tolist()
                
                point = models.PointStruct(
                    id=str(row["book_id"]),
                    vector={
                        DENSE_FIELD: dense_vector_list,
                        SPARSE_FIELD: models.SparseVector(
                            indices=description_sparse["indices"],
                            values=description_sparse["values"],
                        ),
                    },
                    payload={
                        "book_id": int(row["book_id"]),
                        "title": str(row["title"]),
                        "description_summary": str(row["description_summary"]),
                        "price": float(row["price"]) if pd.notna(row["price"]) else None,
                        "rating": float(row["rating"]) if pd.notna(row["rating"]) else None,
                        "rating_count": int(row["rating_count"]) if pd.notna(row["rating_count"]) else None,
                        "authors": row["authors"],
                        "categories": row["categories"],
                    },
                )
                batch_points.append(point)
            except Exception as e:
                logging.error(f"Error preparing point for book_id {row['book_id']}: {str(e)}")
                batch_skipped += 1
                continue
        
        if batch_points:
            batch_num = i//BATCH_SIZE + 1
            total_batches = (len(df_combined)-1)//BATCH_SIZE + 1
            logging.info(f"Uploading batch {batch_num}/{total_batches} with {len(batch_points)} points (skipped {batch_skipped} in this batch)")
            
            try:
                client.upload_points(
                    collection_name=BOOK_COLLECTION_NAME,
                    points=batch_points,
                    parallel=2,
                    max_retries=3,
                )
                total_uploaded += len(batch_points)
                logging.info(f"Batch {batch_num} uploaded successfully")
            except Exception as e:
                logging.error(f"Failed to upload batch {batch_num}: {str(e)}")
                # Continue with next batch instead of failing completely
        else:
            logging.warning(f"Batch {i//BATCH_SIZE + 1} has no valid points to upload")
        
        total_skipped += batch_skipped
        batch_points = []  # Clear memory

    logging.info(f"Upload process completed. Total uploaded: {total_uploaded}, Total skipped: {total_skipped}")
    
    time.sleep(2)
    total_count = client.count(collection_name=BOOK_COLLECTION_NAME)
    logging.info(f"Final count in collection: {total_count.count}")

if __name__ == "__main__":
    add_data_to_qdrant()