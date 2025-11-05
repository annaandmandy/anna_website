import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./data/chroma_db")
EMBED_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4o-mini"