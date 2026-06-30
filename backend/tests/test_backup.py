from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_backup_export() -> None:
    response = client.get("/api/v1/backup/export")
    assert response.status_code == 200
    payload = response.json()
    assert payload["version"] == "0.2.0-alpha"
    assert "projects" in payload
    assert "memories" in payload


def test_backup_import() -> None:
    payload = {
        "version": "0.2.0-alpha",
        "projects": [
            {
                "id": "backup-test-project",
                "name": "Backup Test Project",
                "description": "Created through backup import test.",
                "status": "active",
                "function": "Testing",
                "owner": "AnalyticsOS",
            }
        ],
        "datasets": [],
        "business_rules": [],
        "prompt_templates": [],
        "memories": [],
        "knowledge_assets": [],
    }
    response = client.post("/api/v1/backup/import", json=payload)
    assert response.status_code == 200
    assert response.json()["imported_projects"] == 1
    client.delete("/api/v1/projects/backup-test-project")
