from pathlib import Path
import re

from app.core.config import settings
from app.domain.obsidian import ObsidianExportRequest, ObsidianExportResult


def export_to_obsidian(payload: ObsidianExportRequest) -> ObsidianExportResult:
    base_path = (
        Path(settings.obsidian_vault_path)
        if settings.obsidian_vault_path.strip()
        else Path(settings.knowledge_dir) / "obsidian-export"
    )

    folder = _safe_segment(payload.folder)
    title = _safe_segment(payload.title) or "analyticsos-output"

    target_dir = base_path / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    target_path = target_dir / f"{title}.md"
    target_path.write_text(payload.content, encoding="utf-8")

    return ObsidianExportResult(
        exported=True,
        path=target_path.as_posix(),
        message=(
            "Exported to configured Obsidian vault."
            if settings.obsidian_vault_path.strip()
            else "No Obsidian vault configured; exported to local knowledge fallback."
        ),
    )


def _safe_segment(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9-_ ]+", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:100]
