import logging
from fastembed import SparseTextEmbedding
from sentence_transformers import CrossEncoder

logging.basicConfig(level=logging.INFO)

def download_models():
    """Download all models to cache them in the Docker image."""
    
    logging.info("Downloading FastEmbed sparse model...")
    sparse_model = SparseTextEmbedding(model_name="prithivida/Splade_PP_en_v1")
    logging.info("✓ FastEmbed sparse model downloaded")
    
    logging.info("Downloading CrossEncoder reranker model...")
    reranker = CrossEncoder(
        "cross-encoder/ms-marco-MiniLM-L6-v2",
        trust_remote_code=True,
    )
    logging.info("✓ CrossEncoder reranker model downloaded")
    
    logging.info("All models downloaded successfully!")

if __name__ == "__main__":
    download_models()