import grpc
import argparse
from protos import retriever_pb2, retriever_pb2_grpc

def run(query, host, port, dense_top_k, sparse_top_k, top_k, top_n):
    # Connect to the server
    address = f'{host}:{port}'
    print(f"Connecting to {address}...")
    
    channel = grpc.insecure_channel(address)
    stub = retriever_pb2_grpc.HybridBookRetrieverStub(channel)

    # Create a request
    request = retriever_pb2.RetrieveRequest(
        query=query,
        dense_top_k=dense_top_k,
        sparse_top_k=sparse_top_k,
        top_k=top_k,
        top_n=top_n
    )

    print(f"\nRequest parameters:")
    print(f"  Query: {query}")
    print(f"  Dense Top-K: {dense_top_k}")
    print(f"  Sparse Top-K: {sparse_top_k}")
    print(f"  Top-K (after fusion): {top_k}")
    print(f"  Top-N (final results): {top_n}")
    print(f"\nSending request...")

    # Call the gRPC service
    try:
        response = stub.Retrieve(request)
        
        print(f"\n{'='*60}")
        print(f"Results: {len(response.book_ids)} books returned")
        print(f"{'='*60}\n")
        
        for i, (book_id, score) in enumerate(zip(response.book_ids, response.scores), 1):
            print(f"{i}. Book ID: {book_id}, Score: {score:.4f}")
            
    except grpc.RpcError as e:
        print(f"\nError: {e.code()}")
        print(f"Details: {e.details()}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Test gRPC Hybrid Book Retriever',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic query
  python grpc_test_client.py --query "Classic children's stories"
  
  # Custom parameters
  python grpc_test_client.py --query "Science fiction novels" --top-n 10
  
  # Different host/port
  python grpc_test_client.py --query "Mystery books" --host localhost --port 50051
  
  # Full customization
  python grpc_test_client.py \\
    --query "Fantasy adventure stories" \\
    --dense-top-k 300 \\
    --sparse-top-k 300 \\
    --top-k 150 \\
    --top-n 20
        """
    )
    
    parser.add_argument(
        '--query', '-q',
        type=str,
        default="Classic children's stories featuring Winnie-the-Pooh and friends",
        help='Search query (default: Winnie-the-Pooh query)'
    )
    
    parser.add_argument(
        '--host',
        type=str,
        default='localhost',
        help='gRPC server host (default: localhost)'
    )
    
    parser.add_argument(
        '--port', '-p',
        type=int,
        default=50051,
        help='gRPC server port (default: 50051)'
    )
    
    parser.add_argument(
        '--dense-top-k',
        type=int,
        default=200,
        help='Number of results from dense vector search (default: 200)'
    )
    
    parser.add_argument(
        '--sparse-top-k',
        type=int,
        default=200,
        help='Number of results from sparse vector search (default: 200)'
    )
    
    parser.add_argument(
        '--top-k',
        type=int,
        default=100,
        help='Number of results after reciprocal rank fusion (default: 100)'
    )
    
    parser.add_argument(
        '--top-n',
        type=int,
        default=5,
        help='Final number of results after reranking (default: 5)'
    )
    
    args = parser.parse_args()
    
    run(
        query=args.query,
        host=args.host,
        port=args.port,
        dense_top_k=args.dense_top_k,
        sparse_top_k=args.sparse_top_k,
        top_k=args.top_k,
        top_n=args.top_n
    )