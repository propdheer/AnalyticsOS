from __future__ import annotations

import json
import urllib.error
import urllib.request

from app.core.config import settings
from app.domain.rag import RagQueryRequest, RagQueryResult


def is_configured() -> bool:
    return bool(settings.anythingllm_base_url.strip() and settings.anythingllm_api_key.strip())


def status() -> dict:
    if not settings.anythingllm_base_url.strip():
        return {
            "configured": False,
            "available": False,
            "details": "Set ANALYTICSOS_ANYTHINGLLM_BASE_URL to enable AnythingLLM.",
        }

    if not settings.anythingllm_api_key.strip():
        return {
            "configured": False,
            "available": False,
            "details": "Set ANALYTICSOS_ANYTHINGLLM_API_KEY to enable AnythingLLM API calls.",
        }

    try:
        request = urllib.request.Request(
            f"{settings.anythingllm_base_url.rstrip('/')}/api/v1/auth",
            headers={"Authorization": f"Bearer {settings.anythingllm_api_key}"},
            method="GET",
        )
        with urllib.request.urlopen(request, timeout=3) as response:
            return {
                "configured": True,
                "available": response.status < 400,
                "details": f"AnythingLLM responded with status {response.status}.",
            }
    except Exception as exc:
        return {
            "configured": True,
            "available": False,
            "details": f"AnythingLLM is configured but not reachable: {exc}",
        }


def query_workspace(payload: RagQueryRequest) -> RagQueryResult:
    if not is_configured():
        raise RuntimeError("AnythingLLM is not configured. Add base URL, API key, and workspace slug in .env.")

    workspace_slug = payload.workspace_slug or settings.anythingllm_workspace_slug
    if not workspace_slug:
        raise RuntimeError("AnythingLLM workspace slug is required.")

    url = f"{settings.anythingllm_base_url.rstrip('/')}/api/v1/workspace/{workspace_slug}/chat"
    body = json.dumps(
        {
            "message": payload.question,
            "mode": payload.mode,
            "sessionId": payload.session_id,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {settings.anythingllm_api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"AnythingLLM query failed: {exc.code} {detail}") from exc
    except Exception as exc:
        raise RuntimeError(f"AnythingLLM query failed: {exc}") from exc

    answer = (
        raw.get("textResponse")
        or raw.get("response")
        or raw.get("answer")
        or raw.get("message")
        or json.dumps(raw, indent=2)
    )

    citations = raw.get("sources") or raw.get("citations") or []

    return RagQueryResult(
        question=payload.question,
        answer=answer,
        workspace_slug=workspace_slug,
        citations=citations if isinstance(citations, list) else [],
        raw=raw if isinstance(raw, dict) else {},
    )
