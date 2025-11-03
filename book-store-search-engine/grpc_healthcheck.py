import grpc
from grpc_health.v1 import health_pb2, health_pb2_grpc
import os

def main():
    channel = grpc.insecure_channel("localhost:50051")
    stub = health_pb2_grpc.HealthStub(channel)
    try:
        response = stub.Check(health_pb2.HealthCheckRequest())
        if response.status == health_pb2.HealthCheckResponse.SERVING:
            print("SERVING")
            exit(0)
        print("NOT_SERVING")
    except Exception as e:
        print("ERROR:", e)

    exit(1)

if __name__ == "__main__":
    main()
