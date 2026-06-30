from pydantic import BaseModel


class AppConfig(BaseModel):
    app_name: str = "AnalyticsOS"
    tagline: str = "Build Once. Learn Forever."
    mode: str = "local-first"
    api_version: str
    environment: str
    enabled_features: list[str]
