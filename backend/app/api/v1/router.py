from fastapi import APIRouter

from app.api.v1.routes import business_rules, datasets, memories, projects, prompt_templates

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
api_router.include_router(business_rules.router, prefix="/business-rules", tags=["business-rules"])
api_router.include_router(prompt_templates.router, prefix="/prompt-templates", tags=["prompt-templates"])
api_router.include_router(memories.router, prefix="/memories", tags=["memories"])
