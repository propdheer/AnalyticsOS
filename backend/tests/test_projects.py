from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_projects() -> None:
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert payload[0]["id"] == "analyticsos"


def test_create_project() -> None:
    response = client.post(
        "/api/v1/projects",
        json={
            "id": "rm-pm-variance",
            "name": "RM PM Variance",
            "description": "Raw material and packing material variance analysis.",
            "status": "active",
            "function": "Finance",
            "owner": "Dheer Lakhotia",
        },
    )
    assert response.status_code == 200
    assert response.json()["id"] == "rm-pm-variance"
