from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_knowledge_assets_list_and_search() -> None:
    list_response = client.get("/api/v1/knowledge-assets")
    assert list_response.status_code == 200
    assert isinstance(list_response.json(), list)

    search_response = client.get("/api/v1/knowledge-assets/search?q=AnalyticsOS")
    assert search_response.status_code == 200
    assert isinstance(search_response.json(), list)


def test_global_search() -> None:
    response = client.get("/api/v1/search?q=AnalyticsOS")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
