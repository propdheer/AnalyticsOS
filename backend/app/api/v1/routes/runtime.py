from fastapi import APIRouter

from app.domain.runtime_status import RuntimeStatus
from app.services.runtime_status_service import get_runtime_status

router = APIRouter()


@router.get("/status")
def runtime_status() -> RuntimeStatus:
    return get_runtime_status()
