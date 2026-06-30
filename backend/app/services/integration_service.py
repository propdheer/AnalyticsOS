from pathlib import Path

from app.core.config import settings
from app.domain.integrations import IntegrationStatus, IntegrationStatusPayload
from app.services.anythingllm_service import status as anythingllm_status
from app.services.ollama_service import check_ollama


def get_integration_status() -> IntegrationStatusPayload:
    ollama_available, ollama_details = check_ollama()

    obsidian_configured = bool(settings.obsidian_vault_path.strip())
    obsidian_available = (
        Path(settings.obsidian_vault_path).exists()
        if obsidian_configured
        else False
    )

    anything = anythingllm_status()

    return IntegrationStatusPayload(
        ollama=IntegrationStatus(
            name="Ollama",
            configured=True,
            available=ollama_available,
            details=ollama_details,
        ),
        obsidian=IntegrationStatus(
            name="Obsidian",
            configured=obsidian_configured,
            available=obsidian_available,
            details=(
                f"Vault path: {settings.obsidian_vault_path}"
                if obsidian_configured
                else "Set ANALYTICSOS_OBSIDIAN_VAULT_PATH to enable Obsidian export."
            ),
        ),
        anythingllm=IntegrationStatus(
            name="AnythingLLM",
            configured=bool(anything.get("configured")),
            available=bool(anything.get("available")),
            details=str(anything.get("details", "")),
        ),
    )
