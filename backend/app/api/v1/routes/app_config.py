from fastapi import APIRouter

from app.core.config import settings
from app.domain.app_config import AppConfig

router = APIRouter()


@router.get("/config")
def get_app_config() -> AppConfig:
    return AppConfig(
        api_version="0.2.0-alpha",
        environment=settings.environment,
        enabled_features=[
            "projects",
            "datasets",
            "business-rules",
            "prompt-templates",
            "memories",
            "knowledge-assets",
            "global-search",
            "backup-export",
            "backup-import",
        ],
    )
