from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    api_host: str = "127.0.0.1"
    api_port: int = 8000

    # Runtime paths are configurable per machine.
    #
    # Office laptop example:
    #   ANALYTICSOS_DATA_DIR=C:\Users\...\OneDrive - ...\AnalyticsOS-runtime\data
    #   ANALYTICSOS_KNOWLEDGE_DIR=C:\Users\...\OneDrive - ...\AnalyticsOS-runtime\knowledge
    #
    # Personal laptop example:
    #   ANALYTICSOS_DATA_DIR=%LOCALAPPDATA%\AnalyticsOS\data
    #   ANALYTICSOS_KNOWLEDGE_DIR=%LOCALAPPDATA%\AnalyticsOS\knowledge
    #
    # Defaults remain repo-relative for continuity with earlier versions.
    data_dir: str = "../data"
    knowledge_dir: str = "../knowledge"
    sync_dir: str = ""

    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_default_model: str = "llama3.1"

    obsidian_vault_path: str = ""

    anythingllm_base_url: str = ""
    anythingllm_api_key: str = ""
    anythingllm_workspace_slug: str = ""

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_prefix="ANALYTICSOS_",
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
Path(settings.data_dir).mkdir(parents=True, exist_ok=True)
Path(settings.knowledge_dir).mkdir(parents=True, exist_ok=True)
