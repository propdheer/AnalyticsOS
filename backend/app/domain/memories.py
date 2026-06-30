from enum import StrEnum
from pydantic import BaseModel, Field


class MemoryType(StrEnum):
    preference = "preference"
    decision = "decision"
    lesson = "lesson"
    context = "context"


class Memory(BaseModel):
    id: str = Field(..., description="Stable memory identifier.")
    title: str
    content: str
    memory_type: MemoryType = MemoryType.context
    source: str = ""
    approved: bool = False
