from pathlib import Path
import re

from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.domain.knowledge_assets import KnowledgeAsset
from app.domain.rag import RagQueryRequest, RagQueryResult, SaveRagAnswerRequest
from app.services.anythingllm_service import query_workspace, status
from app.services.knowledge_service import create_asset

router = APIRouter()


@router.get("/status")
def get_rag_status() -> dict:
    return status()


@router.post("/query")
def post_rag_query(payload: RagQueryRequest) -> RagQueryResult:
    try:
        return query_workspace(payload)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/save-answer")
def post_save_rag_answer(payload: SaveRagAnswerRequest) -> KnowledgeAsset:
    title = payload.title.strip() or "AnythingLLM Answer"
    slug = _slugify(title)
    target = Path(settings.knowledge_dir) / "rag-answers" / f"{slug}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        f"# {title}\n\n"
        f"## Question\n\n{payload.question}\n\n"
        f"## Answer\n\n{payload.answer}\n",
        encoding="utf-8",
    )

    asset = KnowledgeAsset(
        id=slug,
        title=title,
        path=target.as_posix(),
        asset_type="markdown",
        summary="Saved AnythingLLM answer.",
        tags=payload.tags or ["rag-answer", "anythingllm"],
    )
    return create_asset(asset)


def _slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9-_ ]+", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:120] or "anythingllm-answer"
