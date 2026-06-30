from pathlib import Path
import os
import sys

from app.domain.runtime_status import RuntimeCheck, RuntimeStatus
from app.services.app_settings_service import effective_data_dir, effective_knowledge_dir


def get_runtime_status(version: str = "0.5.2-alpha") -> RuntimeStatus:
    project_root = Path(__file__).resolve().parents[3]
    data_dir = Path(effective_data_dir())
    knowledge_dir = Path(effective_knowledge_dir())
    venv = os.environ.get("VIRTUAL_ENV", "")

    checks = [
        RuntimeCheck(
            name="Project root",
            ok=(project_root / "backend").exists() and (project_root / "frontend").exists(),
            details=str(project_root),
        ),
        RuntimeCheck(
            name="Python virtual environment",
            ok=bool(venv) and Path(venv).exists(),
            details=venv or "No active virtual environment detected.",
        ),
        RuntimeCheck(
            name="Python executable",
            ok=Path(sys.executable).exists(),
            details=sys.executable,
        ),
        RuntimeCheck(
            name="Data directory",
            ok=data_dir.exists(),
            details=str(data_dir),
        ),
        RuntimeCheck(
            name="Knowledge directory",
            ok=knowledge_dir.exists(),
            details=str(knowledge_dir),
        ),
        RuntimeCheck(
            name="Environment file",
            ok=(project_root / ".env").exists(),
            details=str(project_root / ".env"),
        ),
    ]

    return RuntimeStatus(
        version=version,
        project_root=str(project_root),
        data_dir=str(data_dir),
        knowledge_dir=str(knowledge_dir),
        venv=venv,
        checks=checks,
    )
