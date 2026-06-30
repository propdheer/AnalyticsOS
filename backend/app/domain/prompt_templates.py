from enum import StrEnum
from pydantic import BaseModel, Field


class PromptTemplateType(StrEnum):
    analysis = "analysis"
    documentation = "documentation"
    slide_brief = "slide_brief"
    code = "code"
    general = "general"


class PromptTemplate(BaseModel):
    id: str = Field(..., description="Stable prompt template identifier.")
    name: str
    description: str = ""
    template_type: PromptTemplateType = PromptTemplateType.general
    template: str
    target_tool: str = ""
