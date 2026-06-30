from pydantic import BaseModel, Field


class RagQueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    workspace_slug: str = ""
    mode: str = "query"
    session_id: str = "analyticsos"


class RagQueryResult(BaseModel):
    question: str
    answer: str
    provider: str = "anythingllm"
    workspace_slug: str = ""
    citations: list[dict] = []
    raw: dict = {}


class SaveRagAnswerRequest(BaseModel):
    title: str
    question: str
    answer: str
    tags: list[str] = []
