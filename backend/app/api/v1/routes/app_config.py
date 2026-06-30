from fastapi import APIRouter

from app.core.config import settings
from app.domain.app_config import AppConfig

router = APIRouter()


@router.get("/config")
def get_app_config() -> AppConfig:
    return AppConfig(
        api_version="0.4.1-alpha",
        environment=settings.environment,
        enabled_features=[
            "simple-command-center",
            "guided-next-steps",
            "projects",
            "datasets",
            "business-rules",
            "prompt-templates",
            "memories",
            "knowledge-assets",
            "global-search",
            "backup-export",
            "backup-import",
            "action-registry",
            "action-run-history",
            "save-action-output",
            "action-builder",
            "ollama",
            "obsidian-export",
            "anythingllm-status",
            "anythingllm-query",
            "save-rag-answer",
        ],
    )
