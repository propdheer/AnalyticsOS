from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_dataset_crud() -> None:
    dataset_payload = {
        "id": "material-master",
        "name": "Material Master",
        "description": "Master data for materials and SKUs.",
        "dataset_type": "table",
        "source_system": "Demo",
        "owner": "AnalyticsOS",
    }

    create_response = client.post("/api/v1/datasets", json=dataset_payload)
    assert create_response.status_code == 200
    assert create_response.json()["id"] == "material-master"

    get_response = client.get("/api/v1/datasets/material-master")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Material Master"

    list_response = client.get("/api/v1/datasets")
    assert list_response.status_code == 200
    assert isinstance(list_response.json(), list)

    delete_response = client.delete("/api/v1/datasets/material-master")
    assert delete_response.status_code == 200
    assert delete_response.json()["deleted"] is True
