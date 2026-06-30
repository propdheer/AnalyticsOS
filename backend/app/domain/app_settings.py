from pydantic import BaseModel, Field


class AppSettings(BaseModel):
    id: str = "default"

    data_dir: str = Field(default="", description="Live AnalyticsOS data directory.")
    knowledge_dir: str = Field(default="", description="Live AnalyticsOS knowledge directory.")
    sync_dir: str = Field(default="", description="Optional snapshot sync directory.")

    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_default_model: str = "llama3.1"

    anythingllm_base_url: str = ""
    anythingllm_api_key: str = ""
    anythingllm_workspace_slug: str = ""

    obsidian_vault_path: str = ""


class SettingsTestResult(BaseModel):
    name: str
    configured: bool
    available: bool
    details: str = ""
