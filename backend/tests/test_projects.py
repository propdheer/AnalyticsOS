from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_project_crud() -> None:
    project_payload = {
        "id": "rm-pm-variance",
        "name": "RM PM Variance",
        "description": "Raw material and packing material variance analysis.",
        "status": "active",
        "function": "Finance",
        "owner": "Dheer Lakhotia",
    }

    create_response = client.post("/api/v1/projects", json=project_payload)
    assert create_response.status_code == 200
    assert create_response.json()["id"] == "rm-pm-variance"

    get_response = client.get("/api/v1/projects/rm-pm-variance")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "RM PM Variance"

    list_response = client.get("/api/v1/projects")
    assert list_response.status_code == 200
    assert isinstance(list_response.json(), list)

    delete_response = client.delete("/api/v1/projects/rm-pm-variance")
    assert delete_response.status_code == 200
    assert delete_response.json()["deleted"] is True
