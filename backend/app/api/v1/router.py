from fastapi import APIRouter

from app.api.v1.routes import datasets, projects

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
