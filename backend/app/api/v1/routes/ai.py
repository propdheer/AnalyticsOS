from fastapi import APIRouter

from app.services.app_settings_service import effective_ollama_base_url, effective_ollama_default_model
from app.services.ollama_service import check_ollama, list_models

router = APIRouter()


@router.get("/status")
def get_ai_status() -> dict:
    available, details = check_ollama()
    return {
        "provider": "ollama",
        "base_url": effective_ollama_base_url(),
        "default_model": effective_ollama_default_model(),
        "available": available,
        "details": details,
    }


@router.get("/models")
def get_ai_models() -> dict:
    return {
        "models": list_models(),
        "default_model": effective_ollama_default_model(),
    }
