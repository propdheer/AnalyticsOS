from datetime import datetime, timezone
from pathlib import Path
import re

from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.domain.knowledge_assets import KnowledgeAsset
from app.domain.memories import Memory
from app.domain.quick_capture import QuickCaptureRequest, QuickCaptureResult
from app.services.knowledge_service import create_asset
from app.services.memory_service import create_memory

router = APIRouter()


@router.post("")
def post_quick_capture(payload: QuickCaptureRequest) -> QuickCaptureResult:
    slug = _slugify(payload.title)

    if payload.capture_type == "knowledge":
        target = Path(settings.knowledge_dir) / "quick-capture" / f"{slug}.md"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(
            f"# {payload.title}\n\n"
            f"Captured at: `{datetime.now(timezone.utc).isoformat()}`\n\n"
            f"{payload.content}\n",
            encoding="utf-8",
        )

        asset = KnowledgeAsset(
            id=slug,
            title=payload.title,
            path=target.as_posix(),
            asset_type="markdown",
            summary=payload.content[:240],
            tags=payload.tags or ["quick-capture"],
        )
        saved = create_asset(asset)

        return QuickCaptureResult(
            saved=True,
            target_type="knowledge",
            id=saved.id,
            message="Saved as Knowledge Asset.",
        )

    if payload.capture_type == "memory":
        memory = Memory(
            id=slug,
            title=payload.title,
            content=payload.content,
            memory_type="context",
            source="quick-capture",
            approved=True,
        )
        saved = create_memory(memory)

        return QuickCaptureResult(
            saved=True,
            target_type="memory",
            id=saved.id,
            message="Saved as Memory.",
        )

    raise HTTPException(status_code=400, detail="capture_type must be memory or knowledge")


def _slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9-_ ]+", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:120] or "quick-capture"
