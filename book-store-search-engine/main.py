import grpc
from concurrent import futures
from protos.retriever_server import HybridBookRetrieverServicer
from protos.retriever_pb2_grpc import add_HybridBookRetrieverServicer_to_server
import logging
from retriever.hybrid_retriever import HybridRetriever
from query_processor.book_filter_extractor import BookFilterExtractor
from redis import Redis
from qdrant_client import QdrantClient
import os
def serve():
    qdrant_client = QdrantClient(url=os.getenv("QDRANT_URL"))
    redis_client = Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), decode_responses=True)
    query_processor = BookFilterExtractor()
    retriever = HybridRetriever(qdrant_client, redis_client, query_processor)
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_HybridBookRetrieverServicer_to_server(HybridBookRetrieverServicer(retriever), server)
    server.add_insecure_port(f"[::]:{os.getenv('GRPC_PORT', 50051)}")
    server.start()
    print(f"Server started on port {os.getenv('GRPC_PORT', 50051)}")
    server.wait_for_termination()
    redis_client.flushall()
    redis_client.close()
    

if __name__ == "__main__":
    logging.basicConfig()
    serve()