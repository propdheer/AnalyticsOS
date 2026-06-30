from pydantic import BaseModel, Field


class QuickCaptureRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=160)
    content: str = Field(..., min_length=1)
    capture_type: str = "memory"
    tags: list[str] = []


class QuickCaptureResult(BaseModel):
    saved: bool
    target_type: str
    id: str
    message: str
