from fastapi import APIRouter, HTTPException

from app.domain.projects import Project
from app.services.project_service import create_project, delete_project, get_project, list_projects

router = APIRouter()


@router.get("")
def get_projects() -> list[Project]:
    return list_projects()


@router.get("/{project_id}")
def get_project_by_id(project_id: str) -> Project:
    project = get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("")
def post_project(project: Project) -> Project:
    return create_project(project)


@router.delete("/{project_id}")
def delete_project_by_id(project_id: str) -> dict[str, bool]:
    deleted = delete_project(project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}
