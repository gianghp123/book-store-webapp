from typing import Optional, List, Dict, Any
from langsmith import traceable
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
import os
import getpass
import dotenv
import logging

dotenv.load_dotenv()

class BookFilter(BaseModel):
    """Structured filter for book search with rewritten query for retrieval."""
    rewrite_query: Optional[str] = Field(None, description="Rewritten query including categories and themes for semantic retrieval")
    price_min: Optional[float] = Field(None, description="Minimum price, currency is Dollar")
    price_max: Optional[float] = Field(None, description="Maximum price, currency is Dollar")
    rating_min: Optional[float] = Field(None, description="Minimum rating (e.g. 4.0)")
    rating_max: Optional[float] = Field(None, description="Maximum rating (e.g. 5.0)")
    rating_count_min: Optional[int] = Field(None, description="Minimum number of ratings")
    rating_count_max: Optional[int] = Field(None, description="Maximum number of ratings")
    authors: Optional[List[str]] = Field(None, description="List of authors mentioned in the query")

class BookFilterExtractor:
    """Class for transforming user natural language queries into structured BookFilter objects."""

    BASE_PROMPT = """You are an expert in natural language query interpretation and rewriting for a book database.
  Your goal is to transform a user's book search query into a structured JSON object that matches the BookFilter schema below.
  Focus on *semantic understanding* — not keyword matching.  
  Fill only the fields that are clearly implied by the user query; leave others as null.

  When generating the `rewrite_query`:
  - Rewrite the user’s query into a clear, natural sentence that reflects its full meaning.
  - Add a line at the end describing **inferred genres or themes** in this format:
      Categories: <comma-separated list of inferred genres or themes>
  - Do **not** include an "Authors:" line — author names go only in the `authors` field.

  Use the following schema for your JSON:
  - rewrite_query: rewritten, semantically rich version of the query (including inferred categories)
  - price_min / price_max: numeric filters if price is mentioned
  - rating_min / rating_max: if quality or rating is implied
  - rating_count_min / rating_count_max: if popularity is mentioned
  - authors: list of author names mentioned

  Be concise, specific, and consistent.

  ---

  Example:
  Query: "a book talk about a boy in magical school wrote by j.k rowling which price is less than 10.5 dollars"

  Expected output:
  {
    "rewrite_query": "Fantasy novel about a young boy attending a magical school, written by J.K. Rowling. Categories: Fantasy, Magic, Young Adult.",
    "price_min": null,
    "price_max": 10.5,
    "rating_min": null,
    "rating_max": null,
    "rating_count_min": null,
    "rating_count_max": null,
    "authors": ["J.K. Rowling"]
  }

  Now, given a new user query, return your output as a valid JSON object following the BookFilter schema.
    """

    def __init__(self, model_name: str = "qwen-3-235b-a22b-instruct-2507", temperature: float = 0):
        """Initialize the extractor with a specific LLM.
        
        Args:
            model_name (str, optional): The name of the LLM model to use. Cerebras supported models only. Defaults to "gpt-oss-120b".
            temperature (float, optional): The temperature to use for the LLM. Defaults to 0.
        
        Note: CEREBRAS_API_KEY is required to use the Cerebras API.
        """
        # Ask for API keys if not already set
        if not os.environ.get("LANGSMITH_API_KEY"):
            os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
        if not os.environ.get("CEREBRAS_API_KEY"):
            os.environ["CEREBRAS_API_KEY"] = getpass.getpass("Enter your Cerebras API key: ")

        self.llm = ChatOpenAI(
            model=model_name,
            api_key=os.environ["CEREBRAS_API_KEY"],
            base_url="https://api.cerebras.ai/v1",
            temperature=temperature,
        )

    @traceable(run_type='parser', metadata={"model": "qwen-3-235b-a22b-instruct-2507"})
    def extract(self, query: str) -> Dict[str, Any]:
        """Convert a natural query into a structured BookFilter dictionary."""
        logging.info(f"Start extract query: {query}")
        messages = [
            SystemMessage(content=self.BASE_PROMPT),
            HumanMessage(content=f"Query: {query}")
        ]

        structured_llm = self.llm.with_structured_output(BookFilter)
        result = structured_llm.invoke(messages)

        # Return only non-null fields
        return {k: v for k, v in result.model_dump().items() if v is not None}