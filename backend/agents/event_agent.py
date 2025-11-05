from agents.reasoning_agent import ReasoningAgent
from agents.retriever_agent import RetrieverAgent

class EventAgent:
    """
    The EventAgent combines retrieval (vector DB search)
    and reasoning (natural language generation) to produce
    rich answers about Boston events.
    """

    def __init__(self):
        self.retriever = RetrieverAgent()
        self.reasoner = ReasoningAgent()

    def handle(self, user_query: str) -> str:
        """Retrieve context and generate a final answer."""
        # Step 1: Retrieve relevant event information
        context = self.retriever.fetch_relevant_events(user_query)

        # Step 2: Reason and produce a natural response
        final_answer = self.reasoner.answer(user_query, context)

        return final_answer
    
if __name__ == "__main__":
    agent = EventAgent()
    question = "Find some event this week"
    print("🎯 Query:", question)
    print("💬 Response:\n", agent.handle(question))
