from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_runtime_status_endpoint() -> None:
    response = client.get("/api/v1/runtime/status")
    assert response.status_code == 200
    payload = response.json()
    assert payload["version"] == "0.5.2-alpha"
    assert "project_root" in payload
    assert "data_dir" in payload
    assert "knowledge_dir" in payload
    assert isinstance(payload["checks"], list)
