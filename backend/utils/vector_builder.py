import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import json
from utils.s3_loader import load_latest_events
from config import OPENAI_API_KEY, VECTOR_DB_PATH, EMBED_MODEL

def build_vector_db():
    """Fetch all event data from S3 and store in Chroma vector DB."""
    events = load_latest_events()
    docs = []

    for e in events:
        # Safely extract fields
        title = e.get("name", "")
        date = e.get("date", "")
        time = e.get("time", "")
        location = e.get("location", "")
        address = e.get("address", "")
        category = e.get("category", "")
        subcat = e.get("subcategory", "")
        price = e.get("price", "")
        desc = e.get("description", "")
        source = e.get("source", "")
        link = e.get("link", "")
        tod = e.get("time_of_day", "")
        score = e.get("quality_score", "")

        # Build one clean text block for embedding
        content = f"""
        [EVENT]
        Name: {title}
        Date: {date} {time}
        Location: {location}
        Address: {address}
        Category: {category} / {subcat}
        Price: {price}
        Time of day: {tod}
        Description: {desc}
        Source: {source}
        Quality score: {score}
        Link: {link}
        """

        docs.append(
            Document(
                page_content=content.strip(),
                metadata={
                    "name": title,
                    "date": date,
                    "location": location,
                    "category": category,
                    "source": source,
                },
            )
        )

    print(f"Preparing {len(docs)} event docs for embedding...")

    embeddings = OpenAIEmbeddings(model=EMBED_MODEL, openai_api_key=OPENAI_API_KEY)
    db = Chroma.from_documents(docs, embedding = embeddings, persist_directory=VECTOR_DB_PATH)

    print(f"Vector DB updated successfully at {VECTOR_DB_PATH} with {len(docs)} events.")

if __name__ == "__main__":
    build_vector_db()


