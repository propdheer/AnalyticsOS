from datetime import datetime, timezone
from enum import StrEnum

from pydantic import BaseModel, Field


class ActionCategory(StrEnum):
    presentation = "presentation"
    update = "update"
    documentation = "documentation"
    analysis = "analysis"
    communication = "communication"
    governance = "governance"


class ActionOutputType(StrEnum):
    markdown = "markdown"
    email = "email"
    slide_brief = "slide_brief"
    checklist = "checklist"
    analysis_plan = "analysis_plan"


class ExecutionMode(StrEnum):
    prompt_only = "prompt_only"
    ollama = "ollama"


class ActionTemplate(BaseModel):
    id: str = Field(..., min_length=1, max_length=120, description="Stable action template identifier.")
    name: str = Field(..., min_length=1, max_length=160)
    description: str = ""
    category: ActionCategory = ActionCategory.documentation
    output_type: ActionOutputType = ActionOutputType.markdown
    prompt_template: str = Field(..., min_length=1)
    default_model: str = ""


class ActionRunRequest(BaseModel):
    action_id: str = Field(..., min_length=1)
    execution_mode: ExecutionMode = ExecutionMode.prompt_only
    model: str = ""
    project_id: str = ""
    dataset_id: str = ""
    additional_context: str = ""
    audience: str = "Leadership"
    tone: str = "Clear, concise, executive-ready"


class ActionRunResult(BaseModel):
    action_id: str
    action_name: str
    execution_mode: ExecutionMode
    model: str = ""
    rendered_prompt: str
    output: str
    used_ai: bool = False


class ActionRunRecord(BaseModel):
    id: str
    action_id: str
    action_name: str
    execution_mode: ExecutionMode
    model: str = ""
    project_id: str = ""
    dataset_id: str = ""
    audience: str = ""
    tone: str = ""
    rendered_prompt: str
    output: str
    used_ai: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SaveActionOutputRequest(BaseModel):
    run_id: str = Field(..., min_length=1)
    title: str = ""
    tags: list[str] = []
