from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["environment"] == "development"


def test_version_endpoint() -> None:
    response = client.get("/version")
    assert response.status_code == 200
    payload = response.json()
    assert payload["name"] == "AnalyticsOS"
    assert payload["api_version"] == "0.0.7-alpha"
