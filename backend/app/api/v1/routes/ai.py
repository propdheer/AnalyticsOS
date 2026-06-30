from fastapi import APIRouter

from app.core.config import settings
from app.services.ollama_service import check_ollama, list_models

router = APIRouter()


@router.get("/status")
def get_ai_status() -> dict:
    available, details = check_ollama()
    return {
        "provider": "ollama",
        "base_url": settings.ollama_base_url,
        "default_model": settings.ollama_default_model,
        "available": available,
        "details": details,
    }


@router.get("/models")
def get_ai_models() -> dict:
    return {
        "models": list_models(),
        "default_model": settings.ollama_default_model,
    }
