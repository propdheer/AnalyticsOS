from app.core.config import settings
from app.core.storage import JsonRepository
from app.domain.app_settings import AppSettings

repo = JsonRepository("app_settings.json", AppSettings)


def default_settings() -> AppSettings:
    return AppSettings(
        data_dir=settings.data_dir,
        knowledge_dir=settings.knowledge_dir,
        sync_dir=settings.sync_dir,
        ollama_base_url=settings.ollama_base_url,
        ollama_default_model=settings.ollama_default_model,
        anythingllm_base_url=settings.anythingllm_base_url,
        anythingllm_api_key=settings.anythingllm_api_key,
        anythingllm_workspace_slug=settings.anythingllm_workspace_slug,
        obsidian_vault_path=settings.obsidian_vault_path,
    )


def get_app_settings() -> AppSettings:
    saved = repo.get("default")
    if saved is not None:
        if not saved.data_dir:
            saved.data_dir = settings.data_dir
        if not saved.knowledge_dir:
            saved.knowledge_dir = settings.knowledge_dir
        return saved
    created = default_settings()
    return repo.upsert(created)


def update_app_settings(payload: AppSettings) -> AppSettings:
    payload.id = "default"
    return repo.upsert(payload)


def effective_data_dir() -> str:
    return get_app_settings().data_dir or settings.data_dir


def effective_knowledge_dir() -> str:
    return get_app_settings().knowledge_dir or settings.knowledge_dir


def effective_sync_dir() -> str:
    return get_app_settings().sync_dir or settings.sync_dir


def effective_ollama_base_url() -> str:
    return get_app_settings().ollama_base_url or settings.ollama_base_url


def effective_ollama_default_model() -> str:
    return get_app_settings().ollama_default_model or settings.ollama_default_model


def effective_anythingllm_base_url() -> str:
    return get_app_settings().anythingllm_base_url or settings.anythingllm_base_url


def effective_anythingllm_api_key() -> str:
    return get_app_settings().anythingllm_api_key or settings.anythingllm_api_key


def effective_anythingllm_workspace_slug() -> str:
    return get_app_settings().anythingllm_workspace_slug or settings.anythingllm_workspace_slug


def effective_obsidian_vault_path() -> str:
    return get_app_settings().obsidian_vault_path or settings.obsidian_vault_path
