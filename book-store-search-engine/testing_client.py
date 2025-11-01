import grpc
from protos import retriever_pb2, retriever_pb2_grpc

def run():
    # Connect to the server (adjust host:port if needed)
    channel = grpc.insecure_channel('localhost:50051')
    stub = retriever_pb2_grpc.HybridBookRetrieverStub(channel)

    # Create a request
    request = retriever_pb2.RetrieveRequest(
        query="Classic children's stories featuring Winnie-the-Pooh and friends",
        dense_top_k=200,
        sparse_top_k=200,
        top_k=100,
        top_n=5
    )

    # Call the gRPC service
    response = stub.Retrieve(request)

    print("Books returned:", response.book_ids)
    print("Scores:", response.scores)

if __name__ == "__main__":
    run()
