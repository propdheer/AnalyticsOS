from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_cors_preflight_for_frontend() -> None:
    response = client.options(
        "/api/v1/projects",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
