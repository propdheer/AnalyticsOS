from pydantic import BaseModel


class IntegrationStatus(BaseModel):
    name: str
    configured: bool
    available: bool
    details: str = ""


class IntegrationStatusPayload(BaseModel):
    ollama: IntegrationStatus
    obsidian: IntegrationStatus
    anythingllm: IntegrationStatus
