from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="user or assistant")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    model: str = ""
    use_knowledge: bool = True
    use_actions: bool = True
    use_projects: bool = True
    max_context_items: int = 8
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    answer: str
    model: str
    used_knowledge: bool = False
    context_items: list[dict] = []
    prompt: str = ""
