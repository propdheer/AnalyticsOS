from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    data_dir: str = "../data"
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
