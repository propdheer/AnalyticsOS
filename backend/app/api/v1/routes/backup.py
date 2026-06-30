from fastapi import APIRouter

from app.domain.backup import BackupPayload, ImportResult
from app.services.backup_service import export_backup, import_backup

router = APIRouter()


@router.get("/export")
def get_backup() -> BackupPayload:
    return export_backup()


@router.post("/import")
def post_backup(payload: BackupPayload) -> ImportResult:
    return import_backup(payload)
