from fastapi import APIRouter

from app.domain.integrations import IntegrationStatusPayload
from app.services.integration_service import get_integration_status

router = APIRouter()


@router.get("/status")
def get_status() -> IntegrationStatusPayload:
    return get_integration_status()
