from fastapi import APIRouter

from app.domain.projects import Project
from app.services.project_service import create_project, list_projects

router = APIRouter()


@router.get("")
def get_projects() -> list[Project]:
    return list_projects()


@router.post("")
def post_project(project: Project) -> Project:
    return create_project(project)
