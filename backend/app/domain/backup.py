from pydantic import BaseModel


class BackupPayload(BaseModel):
    version: str
    projects: list[dict] = []
    datasets: list[dict] = []
    business_rules: list[dict] = []
    prompt_templates: list[dict] = []
    memories: list[dict] = []
    knowledge_assets: list[dict] = []


class ImportResult(BaseModel):
    imported_projects: int = 0
    imported_datasets: int = 0
    imported_business_rules: int = 0
    imported_prompt_templates: int = 0
    imported_memories: int = 0
    imported_knowledge_assets: int = 0
