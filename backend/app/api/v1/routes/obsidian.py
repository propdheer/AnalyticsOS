from fastapi import APIRouter

from app.domain.obsidian import ObsidianExportRequest, ObsidianExportResult
from app.services.obsidian_service import export_to_obsidian

router = APIRouter()


@router.post("/export")
def post_export(payload: ObsidianExportRequest) -> ObsidianExportResult:
    return export_to_obsidian(payload)
