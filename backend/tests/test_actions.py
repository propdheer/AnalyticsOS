from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_actions_list_contains_seed_actions() -> None:
    response = client.get("/api/v1/actions")
    assert response.status_code == 200
    assert any(item["id"] == "create-use-case-ppt" for item in response.json())

def test_action_run_prompt_only_and_history() -> None:
    response = client.post("/api/v1/actions/run", json={"action_id": "generate-adoption-update", "execution_mode": "prompt_only", "project_id": "analyticsos", "additional_context": "Focus on MVP adoption.", "audience": "Leadership", "tone": "clear and concise"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["used_ai"] is False
    assert "MVP adoption" in payload["output"]
    history = client.get("/api/v1/actions/runs")
    assert history.status_code == 200
    assert any(item["id"] == payload["id"] for item in history.json())

def test_save_action_output_as_knowledge() -> None:
    run_response = client.post("/api/v1/actions/run", json={"action_id": "draft-stakeholder-email", "execution_mode": "prompt_only", "additional_context": "Ask stakeholders for feedback."})
    run_id = run_response.json()["id"]
    save_response = client.post("/api/v1/actions/runs/save-as-knowledge", json={"run_id": run_id, "title": "Stakeholder Email Test Output", "tags": ["test", "action-output"]})
    assert save_response.status_code == 200
    assert save_response.json()["title"] == "Stakeholder Email Test Output"
