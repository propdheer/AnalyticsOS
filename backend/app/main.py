from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings

APP_VERSION = "0.5.1-alpha"

app = FastAPI(
    title="AnalyticsOS API",
    version=APP_VERSION,
    description="Backend API for AnalyticsOS.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    first_error = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(part) for part in first_error.get("loc", []))
    return JSONResponse(
        status_code=422,
        content={
            "detail": first_error.get("msg", "Validation failed."),
            "field": field,
            "code": "VALIDATION_ERROR",
        },
    )


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
