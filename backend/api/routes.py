from fastapi import APIRouter
from pydantic import BaseModel
from agents.retriever_agent import RetrieverAgent
from agents.reasoning_agent import ReasoningAgent

router = APIRouter()
retriever = RetrieverAgent()
reasoner = ReasoningAgent()

class QueryRequest(BaseModel):
    query:str

@router.post("/chat")
async def chat_endpoint(request: QueryRequest):
    query = request.query
    retrieved = retriever.search(query)
    context = "\n".join(retrieved)
    response = reasoner.answer(query, context)
    return {"reply": response}

@router.post("/rebuild")
async def rebuild_vector_db(background_tasks: BackgroundTasks):
    background_tasks.add_task()