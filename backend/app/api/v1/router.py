from fastapi import APIRouter

from app.api.v1.routes import (
    actions,
    ai,
    app_config,
    backup,
    business_rules,
    datasets,
    integrations,
    knowledge_assets,
    memories,
    obsidian,
    projects,
    prompt_templates,
    search,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(app_config.router, prefix="/app", tags=["app"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
api_router.include_router(business_rules.router, prefix="/business-rules", tags=["business-rules"])
api_router.include_router(prompt_templates.router, prefix="/prompt-templates", tags=["prompt-templates"])
api_router.include_router(memories.router, prefix="/memories", tags=["memories"])
api_router.include_router(knowledge_assets.router, prefix="/knowledge-assets", tags=["knowledge-assets"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(backup.router, prefix="/backup", tags=["backup"])
api_router.include_router(actions.router, prefix="/actions", tags=["actions"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(obsidian.router, prefix="/obsidian", tags=["obsidian"])
