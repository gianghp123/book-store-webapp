# Book Store Search Engine

A Hybrid search engine for book stores, powered by Qdrant for vector search and PostgreSQL for traditional search.

![System Flow](assets/flow.png)


## Prerequisites

- Docker and Docker Compose
- Python 3.8+
- Git (for cloning the repository)

## Setup Instructions

1. **Download and Extract Docker Setup**
   - Download the Docker setup file from [Google Drive](https://drive.google.com/file/d/1BdYf1uXqPV4GGS0INhTsNZIxXUeeUZLu/view?usp=sharing)
   - Extract the downloaded zip file

2. **Start Docker Containers**
   ```bash
   cd /path/to/extracted/folder
   docker-compose up -d
   ```
   This will start the following services:
   - PostgreSQL database
   - Qdrant vector database

3. **Environment Setup**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file and set the required environment variables:
     ```
     JINAI_API_KEY=your_jina_api_key
     CEREBRAS_API_KEY=your_cerebras_api_key
     QDRANT_URL=your_qdrant_url
     GRPC_PORT=50051
     ```

4. **Install Python Dependencies**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the gRPC Server**
   ```bash
   python main.py
   ```
   The server will start on the port specified in your `.env` file (default: 50051).

## Environment Variables

- `JINAI_API_KEY`: Your Jina AI API key
- `CEREBRAS_API_KEY`: Your Cerebras API key
- `QDRANT_URL`: URL of your Qdrant instance (default: `http://localhost:6333`)
- `GRPC_PORT`: Port for the gRPC server (default: `50051`)

## Project Structure

- `main.py`: Entry point for the gRPC server
- `query_processor/`: Contains query processing logic
- `retriever/`: Implements retrieval mechanisms
- `requirements.txt`: Python dependencies

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
