from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_app_config() -> None:
    response = client.get("/api/v1/app/config")
    assert response.status_code == 200
    payload = response.json()
    assert payload["app_name"] == "AnalyticsOS"
    assert "global-search" in payload["enabled_features"]
