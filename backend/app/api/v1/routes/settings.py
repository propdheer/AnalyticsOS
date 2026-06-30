from fastapi import APIRouter

from app.domain.app_settings import AppSettings, SettingsTestResult
from app.services.app_settings_service import get_app_settings, update_app_settings
from app.services.anythingllm_service import status as anythingllm_status
from app.services.ollama_service import check_ollama
from app.services.obsidian_service import check_obsidian

router = APIRouter()


@router.get("")
def get_settings() -> AppSettings:
    return get_app_settings()


@router.post("")
def post_settings(payload: AppSettings) -> AppSettings:
    return update_app_settings(payload)


@router.get("/test/ollama")
def test_ollama() -> SettingsTestResult:
    available, details = check_ollama()
    return SettingsTestResult(
        name="Ollama",
        configured=True,
        available=available,
        details=details,
    )


@router.get("/test/anythingllm")
def test_anythingllm() -> SettingsTestResult:
    result = anythingllm_status()
    return SettingsTestResult(
        name="AnythingLLM",
        configured=bool(result.get("configured")),
        available=bool(result.get("available")),
        details=str(result.get("details", "")),
    )


@router.get("/test/obsidian")
def test_obsidian() -> SettingsTestResult:
    configured, available, details = check_obsidian()
    return SettingsTestResult(
        name="Obsidian",
        configured=configured,
        available=available,
        details=details,
    )
