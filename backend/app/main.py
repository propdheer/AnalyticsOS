from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(
    title="AnalyticsOS API",
    version="0.0.2-alpha",
    description="Backend API for AnalyticsOS.",
)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "AnalyticsOS API",
        "version": "0.0.2-alpha",
        "status": "running",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "healthy",
        "environment": settings.environment,
    }
