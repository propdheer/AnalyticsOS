from fastapi import APIRouter, HTTPException

from app.domain.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_with_ollama

router = APIRouter()


@router.post("")
def post_chat(payload: ChatRequest) -> ChatResponse:
    try:
        return chat_with_ollama(payload)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
