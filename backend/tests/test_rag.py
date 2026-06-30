from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_rag_status_endpoint() -> None:
    response = client.get("/api/v1/rag/status")
    assert response.status_code == 200
    payload = response.json()
    assert "configured" in payload
    assert "available" in payload


def test_save_rag_answer_as_knowledge() -> None:
    response = client.post(
        "/api/v1/rag/save-answer",
        json={
            "title": "RAG Test Answer",
            "question": "What is AnalyticsOS?",
            "answer": "AnalyticsOS is a local-first professional intelligence platform.",
            "tags": ["test", "rag-answer"],
        },
    )
    assert response.status_code == 200
    assert response.json()["title"] == "RAG Test Answer"
