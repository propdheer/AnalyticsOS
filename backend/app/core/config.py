from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    environment: str = "development"
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    data_dir: str = "../data"
    knowledge_dir: str = "../knowledge"
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_default_model: str = "llama3.1"
    obsidian_vault_path: str = ""
    anythingllm_base_url: str = ""
    anythingllm_api_key: str = ""
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    model_config = SettingsConfigDict(env_prefix="ANALYTICSOS_", env_file=".env", extra="ignore")

settings = Settings()
