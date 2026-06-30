from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_memory_crud() -> None:
    payload = {
        "id": "test-memory",
        "title": "Test memory",
        "content": "This is a test memory.",
        "memory_type": "context",
        "source": "pytest",
        "approved": True,
    }

    create_response = client.post("/api/v1/memories", json=payload)
    assert create_response.status_code == 200
    assert create_response.json()["id"] == "test-memory"

    get_response = client.get("/api/v1/memories/test-memory")
    assert get_response.status_code == 200
    assert get_response.json()["approved"] is True

    delete_response = client.delete("/api/v1/memories/test-memory")
    assert delete_response.status_code == 200
