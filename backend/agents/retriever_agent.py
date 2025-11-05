# backend/agents/retriever_agent.py
from utils.vector_query import query_events

class RetrieverAgent:
    """Agent that retrieves and formats event information using the vector DB."""

    def __init__(self):
        pass  # add config or history later if needed

    def fetch_relevant_events(self, user_query: str) -> str:
        """Wrap the utility function to add agent-like interface."""
        try:
            context = query_events(user_query)
            return context
        except Exception as e:
            return f"⚠️ Unable to retrieve events: {str(e)}"
