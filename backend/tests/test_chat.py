from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_chat_requires_message() -> None:
    response = client.post("/api/v1/chat", json={"message": ""})
    assert response.status_code in (422, 503)


def test_context_alias_preview() -> None:
    response = client.post(
        "/api/v1/actions/preview",
        json={
            "action_id": "generate-adoption-update",
            "execution_mode": "prompt_only",
            "additional_context": "Check context alias.",
        },
    )
    assert response.status_code == 200
    assert "{{Context}}" not in response.json()["output"]
    assert "{{context}}" not in response.json()["output"]
