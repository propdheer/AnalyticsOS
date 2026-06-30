from app.domain.integrations import IntegrationStatus, IntegrationStatusPayload
from app.services.anythingllm_service import status as anythingllm_status
from app.services.obsidian_service import check_obsidian
from app.services.ollama_service import check_ollama


def get_integration_status() -> IntegrationStatusPayload:
    ollama_available, ollama_details = check_ollama()
    obsidian_configured, obsidian_available, obsidian_details = check_obsidian()
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
            details=obsidian_details,
        ),
        anythingllm=IntegrationStatus(
            name="AnythingLLM",
            configured=bool(anything.get("configured")),
            available=bool(anything.get("available")),
            details=str(anything.get("details", "")),
        ),
    )
