from pathlib import Path
import re

from app.core.config import settings
from app.domain.obsidian import ObsidianExportRequest, ObsidianExportResult


def _effective_vault_path() -> str:
    try:
        from app.services.app_settings_service import effective_obsidian_vault_path
        return effective_obsidian_vault_path()
    except Exception:
        return settings.obsidian_vault_path


def check_obsidian() -> tuple[bool, bool, str]:
    vault_path = _effective_vault_path()
    if not vault_path.strip():
        return False, False, "Set Obsidian vault path in Settings."
    path = Path(vault_path)
    return True, path.exists(), f"Vault path: {path}"


def export_to_obsidian(payload: ObsidianExportRequest) -> ObsidianExportResult:
    vault_path = _effective_vault_path()
    base_path = (
        Path(vault_path)
        if vault_path.strip()
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
            if vault_path.strip()
            else "No Obsidian vault configured; exported to local knowledge fallback."
        ),
    )


def _safe_segment(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9-_ ]+", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:100]
