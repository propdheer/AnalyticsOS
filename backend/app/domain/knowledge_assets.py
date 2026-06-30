from pydantic import BaseModel, Field


class KnowledgeAsset(BaseModel):
    id: str = Field(..., description="Stable asset identifier.")
    title: str
    path: str
    asset_type: str = "markdown"
    summary: str = ""
    tags: list[str] = []


class KnowledgeSearchResult(BaseModel):
    id: str
    title: str
    path: str
    snippet: str
    score: int
