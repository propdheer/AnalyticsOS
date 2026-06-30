from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_datasets() -> None:
    response = client.get("/api/v1/datasets")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    assert payload[0]["id"] == "sample-sales-primary"


def test_create_dataset() -> None:
    response = client.post(
        "/api/v1/datasets",
        json={
            "id": "material-master",
            "name": "Material Master",
            "description": "Master data for materials and SKUs.",
            "dataset_type": "table",
            "source_system": "Demo",
            "owner": "AnalyticsOS",
        },
    )
    assert response.status_code == 200
    assert response.json()["id"] == "material-master"
