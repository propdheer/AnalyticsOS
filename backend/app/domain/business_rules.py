from enum import StrEnum
from pydantic import BaseModel, Field


class BusinessRuleStatus(StrEnum):
    draft = "draft"
    active = "active"
    deprecated = "deprecated"


class BusinessRule(BaseModel):
    id: str = Field(..., description="Stable business rule identifier.")
    name: str
    definition: str
    domain: str = ""
    status: BusinessRuleStatus = BusinessRuleStatus.draft
    owner: str = ""
    source: str = ""
