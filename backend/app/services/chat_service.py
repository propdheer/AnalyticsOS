from app.domain.chat import ChatRequest, ChatResponse
from app.services.app_settings_service import effective_ollama_default_model
from app.services.ollama_service import generate_with_ollama


def chat_with_ollama(payload: ChatRequest) -> ChatResponse:
    model = payload.model or effective_ollama_default_model()
    context_items = _collect_context(payload)
    prompt = _build_prompt(payload, context_items)
    answer = generate_with_ollama(prompt, model)

    return ChatResponse(
        answer=answer,
        model=model,
        used_knowledge=bool(context_items),
        context_items=context_items,
        prompt=prompt,
    )


def _collect_context(payload: ChatRequest) -> list[dict]:
    if not payload.use_knowledge:
        return []

    items: list[dict] = []

    try:
        from app.services.search_service import search_everything
        results = search_everything(payload.message)
        for result in results[: payload.max_context_items]:
            if hasattr(result, "model_dump"):
                data = result.model_dump()
            elif isinstance(result, dict):
                data = result
            else:
                data = {
                    "source": getattr(result, "source", "unknown"),
                    "title": getattr(result, "title", ""),
                    "snippet": getattr(result, "snippet", ""),
                }
            items.append(data)
    except Exception:
        items = []

    return items


def _build_prompt(payload: ChatRequest, context_items: list[dict]) -> str:
    history_text = ""
    if payload.history:
        history_lines = []
        for message in payload.history[-6:]:
            history_lines.append(f"{message.role.upper()}: {message.content}")
        history_text = "\n".join(history_lines)

    context_text = "No AnalyticsOS context was included."
    if context_items:
        rendered = []
        for idx, item in enumerate(context_items, start=1):
            title = item.get("title", "")
            source = item.get("source", "")
            snippet = item.get("snippet", "") or item.get("summary", "") or item.get("description", "")
            rendered.append(f"[{idx}] Source: {source}\nTitle: {title}\nContext: {snippet}")
        context_text = "\n\n".join(rendered)

    return f"""You are AnalyticsOS, a local-first professional intelligence assistant.

Your job:
- Help the user think, write, plan, analyze, and execute professional work.
- Use the AnalyticsOS knowledge context when useful.
- Be clear, concise, practical, and action-oriented.
- If context is insufficient, say what is missing and give the best next step.
- When creating outputs, make them ready to reuse in a business setting.

AnalyticsOS context:
{context_text}

Recent conversation:
{history_text if history_text else "No prior chat history."}

User request:
{payload.message}

Answer:
"""
