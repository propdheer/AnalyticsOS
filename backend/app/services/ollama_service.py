from __future__ import annotations

import json
import urllib.error
import urllib.request

from app.services.app_settings_service import effective_ollama_base_url, effective_ollama_default_model


def check_ollama() -> tuple[bool, str]:
    base_url = effective_ollama_base_url()
    try:
        with urllib.request.urlopen(f"{base_url}/api/tags", timeout=2) as response:
            if response.status == 200:
                return True, "Ollama is reachable."
            return False, f"Ollama returned status {response.status}."
    except Exception as exc:
        return False, f"Ollama is not reachable: {exc}"


def list_models() -> list[str]:
    base_url = effective_ollama_base_url()
    try:
        with urllib.request.urlopen(f"{base_url}/api/tags", timeout=3) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return [model.get("name", "") for model in payload.get("models", []) if model.get("name")]
    except Exception:
        return []


def generate_with_ollama(prompt: str, model: str | None = None) -> str:
    selected_model = model or effective_ollama_default_model()
    base_url = effective_ollama_base_url()
    body = json.dumps(
        {
            "model": selected_model,
            "prompt": prompt,
            "stream": False,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{base_url}/api/generate",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return payload.get("response", "")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Ollama generation failed: {exc.code} {detail}") from exc
    except Exception as exc:
        raise RuntimeError(f"Ollama generation failed: {exc}") from exc
