import grpc
from concurrent import futures
import logging
import os
from grpc_health.v1 import health, health_pb2, health_pb2_grpc
from redis import Redis
from qdrant_client import QdrantClient
from protos.retriever_server import HybridBookRetrieverServicer
from protos.retriever_pb2_grpc import add_HybridBookRetrieverServicer_to_server
from retriever.hybrid_retriever import HybridRetriever
from query_processor.book_filter_extractor import BookFilterExtractor
import logging



def serve():
    qdrant_client = QdrantClient(url=os.getenv("QDRANT_URL"))
    redis_client = Redis(
        host=os.getenv("REDIS_HOST"),
        port=int(os.getenv("REDIS_PORT")),
        decode_responses=True,
    )

    query_processor = BookFilterExtractor()
    retriever = HybridRetriever(qdrant_client, redis_client, query_processor)

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    health_servicer = health.HealthServicer()
    health_pb2_grpc.add_HealthServicer_to_server(health_servicer, server)
    health_servicer.set("", health_pb2.HealthCheckResponse.SERVING)

    add_HybridBookRetrieverServicer_to_server(
        HybridBookRetrieverServicer(retriever), server
    )

    server.add_insecure_port("[::]:50051")
    server.start()

    print("Server started on port 50051")

    try:
        server.wait_for_termination()
    finally:
        redis_client.flushall()
        redis_client.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    serve()
