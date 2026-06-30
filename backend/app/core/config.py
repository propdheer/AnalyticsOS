from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    environment: str = "development"
    api_host: str = "127.0.0.1"
    api_port: int = 8000

    class Config:
        env_prefix = "ANALYTICSOS_"
        env_file = ".env"


settings = Settings()
