import datetime
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from config import LLM_MODEL, OPENAI_API_KEY\

prompt_template = ChatPromptTemplate.from_template("""
You are the **Boston Weekend Mood Agent**, a LOCAL EXPERT who has lived in Boston for 10+ years.

Today is **{current_time}**.

Answer strictly using the event data provided below.
If you see any events that have already happened or are from a past year, ignore them.
Do not mention any event dated before {current_time}.
If you need to add local flavor, you may mention nearby neighborhoods or accessibility tips,
but you MUST base all main recommendations on the retrieved event listings.
Do not invent events that are not in the context.

===
EVENT CONTEXT (retrieved from database):
{context}
===

USER QUESTION:
{query}

Respond in a friendly, concise tone (3–6 sentences) listing specific event names, locations, and times.
If no relevant events are found, politely say so and suggest the user try another query.
""")

class ReasoningAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model = LLM_MODEL, openai_api_key=OPENAI_API_KEY)

    def answer(self, query, context):
        current_time = datetime.datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")
        prompt = prompt_template.format(context=context, query=query, current_time=current_time)
        return self.llm.invoke(prompt).content