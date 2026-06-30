from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_prompt_template_crud() -> None:
    payload = {
        "id": "exec-summary",
        "name": "Executive Summary",
        "description": "Summarize project status for leadership.",
        "template_type": "documentation",
        "template": "Create an executive summary from this context: {{context}}",
        "target_tool": "Claude",
    }

    create_response = client.post("/api/v1/prompt-templates", json=payload)
    assert create_response.status_code == 200
    assert create_response.json()["id"] == "exec-summary"

    get_response = client.get("/api/v1/prompt-templates/exec-summary")
    assert get_response.status_code == 200
    assert get_response.json()["target_tool"] == "Claude"

    delete_response = client.delete("/api/v1/prompt-templates/exec-summary")
    assert delete_response.status_code == 200
