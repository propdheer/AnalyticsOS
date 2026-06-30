from __future__ import annotations

from pathlib import Path

from app.core.config import settings
from app.core.storage import JsonRepository
from app.domain.knowledge_assets import KnowledgeAsset, KnowledgeSearchResult

repo = JsonRepository("knowledge_assets.json", KnowledgeAsset)
SUPPORTED_EXTENSIONS = {".md", ".txt"}


def seed_defaults() -> None:
    knowledge_dir = Path(settings.knowledge_dir)
    knowledge_dir.mkdir(parents=True, exist_ok=True)
    sample = knowledge_dir / "welcome.md"
    if not sample.exists():
        sample.write_text(
            "# Welcome to AnalyticsOS\n\nThis folder is for local knowledge notes and markdown assets.\n",
            encoding="utf-8",
        )


def list_assets() -> list[KnowledgeAsset]:
    seed_defaults()
    existing = {asset.path for asset in repo.list()}

    for path in Path(settings.knowledge_dir).rglob("*"):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            rel_path = path.as_posix()
            if rel_path not in existing:
                repo.upsert(
                    KnowledgeAsset(
                        id=path.stem.lower().replace(" ", "-"),
                        title=path.stem.replace("-", " ").replace("_", " ").title(),
                        path=rel_path,
                        asset_type=path.suffix.lower().lstrip("."),
                        summary="Auto-discovered local knowledge asset.",
                        tags=["auto-discovered"],
                    )
                )

    return repo.list()


def get_asset(asset_id: str) -> KnowledgeAsset | None:
    list_assets()
    return repo.get(asset_id)


def create_asset(asset: KnowledgeAsset) -> KnowledgeAsset:
    return repo.upsert(asset)


def delete_asset(asset_id: str) -> bool:
    return repo.delete(asset_id)


def search_assets(query: str) -> list[KnowledgeSearchResult]:
    assets = list_assets()
    normalized = query.strip().lower()
    if not normalized:
        return []

    results: list[KnowledgeSearchResult] = []

    for asset in assets:
        path = Path(asset.path)
        text = ""
        if path.exists() and path.is_file():
            text = path.read_text(encoding="utf-8", errors="ignore")

        haystack = " ".join([asset.id, asset.title, asset.summary, " ".join(asset.tags), asset.path, text]).lower()
        score = haystack.count(normalized)
        if score > 0:
            results.append(
                KnowledgeSearchResult(
                    id=asset.id,
                    title=asset.title,
                    path=asset.path,
                    snippet=_snippet(text or asset.summary, normalized),
                    score=score,
                )
            )

    return sorted(results, key=lambda item: item.score, reverse=True)


def _snippet(text: str, query: str) -> str:
    lowered = text.lower()
    index = lowered.find(query)
    if index == -1:
        return text[:220]
    return text[max(0, index - 80): min(len(text), index + 160)].strip()
