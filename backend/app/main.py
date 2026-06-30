from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import settings

APP_VERSION = "0.1.0-alpha"

app = FastAPI(
    title="AnalyticsOS API",
    version=APP_VERSION,
    description="Backend API for AnalyticsOS.",
)

app.include_router(api_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "AnalyticsOS API",
        "version": APP_VERSION,
        "status": "running",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "healthy",
        "environment": settings.environment,
    }


@app.get("/version")
def version() -> dict[str, str]:
    return {
        "name": "AnalyticsOS",
        "api_version": APP_VERSION,
        "environment": settings.environment,
    }
