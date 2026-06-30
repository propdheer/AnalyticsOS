from fastapi import APIRouter

from app.core.config import settings
from app.domain.app_config import AppConfig

router = APIRouter()


@router.get("/config")
def get_app_config() -> AppConfig:
    return AppConfig(
        api_version="0.5.2-alpha",
        environment=settings.environment,
        enabled_features=[
            "second-brain-runtime-check",
            "runtime-status-endpoint",
            "fixed-tsconfig",
            "ollama-chat",
            "knowledge-aware-chat",
            "collapsible-sidebar",
            "page-ids",
            "generated-form-ids",
            "title-case-ui",
            "template-context-aliases",
            "runtime-path-choice",
            "settings-screen",
            "integration-health-widget",
            "command-palette",
            "quick-capture",
            "action-builder-live-preview",
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
            "anythingllm-query",
            "save-rag-answer",
        ],
    )
