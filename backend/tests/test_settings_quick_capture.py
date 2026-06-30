from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_settings_endpoint_loads() -> None:
    response = client.get("/api/v1/settings")
    assert response.status_code == 200
    assert response.json()["id"] == "default"


def test_quick_capture_memory() -> None:
    response = client.post(
        "/api/v1/quick-capture",
        json={
            "title": "Quick Capture Test",
            "content": "This is a test capture.",
            "capture_type": "memory",
            "tags": ["test"],
        },
    )
    assert response.status_code == 200
    assert response.json()["saved"] is True
