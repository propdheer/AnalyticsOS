from enum import StrEnum
from pydantic import BaseModel, Field


class ProjectStatus(StrEnum):
    active = "active"
    planned = "planned"
    paused = "paused"
    completed = "completed"


class Project(BaseModel):
    id: str = Field(..., description="Stable project identifier.")
    name: str
    description: str = ""
    status: ProjectStatus = ProjectStatus.active
    function: str = ""
    owner: str = ""
