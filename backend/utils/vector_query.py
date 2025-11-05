import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from config import OPENAI_API_KEY, VECTOR_DB_PATH, EMBED_MODEL

def query_events(user_query: str, top_k: int = 5):
    """Retrieve the most relevant events for a user query and summarize them."""

    # --- Load Chroma Vector DB ---
    embeddings = OpenAIEmbeddings(model=EMBED_MODEL, openai_api_key=OPENAI_API_KEY)
    db = Chroma(
        persist_directory=VECTOR_DB_PATH,
        embedding_function=embeddings,
    )

    # --- Retrieve most similar documents ---
    results = db.similarity_search(user_query, k=top_k)

    context = "\n\n".join([doc.page_content for doc in results])

    # --- Build the prompt for summarization ---
    prompt = ChatPromptTemplate.from_template("""
You are a helpful Boston event assistant.
Given the user's query and the retrieved event listings, recommend or summarize the most relevant ones.

User query: {query}

Event listings:
{context}

Provide a short, friendly summary (3–5 sentences) with key event names, locations, and times.
    """)

    chain = prompt | ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        openai_api_key=OPENAI_API_KEY
    )

    response = chain.invoke({"query": user_query, "context": context})
    return response.content


if __name__ == "__main__":
    test_query = "Find romantic evening events near Cambridge this weekend"
    print("🔍 Query:", test_query)
    print("🧠 Response:\n", query_events(test_query))
