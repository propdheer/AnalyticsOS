from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_business_rule_crud() -> None:
    payload = {
        "id": "primary-sales-rule",
        "name": "Primary Sales",
        "definition": "Primary sales refers to billing from company to distributor.",
        "domain": "Sales",
        "status": "active",
        "owner": "AnalyticsOS",
        "source": "Test",
    }

    create_response = client.post("/api/v1/business-rules", json=payload)
    assert create_response.status_code == 200
    assert create_response.json()["id"] == "primary-sales-rule"

    get_response = client.get("/api/v1/business-rules/primary-sales-rule")
    assert get_response.status_code == 200
    assert get_response.json()["domain"] == "Sales"

    delete_response = client.delete("/api/v1/business-rules/primary-sales-rule")
    assert delete_response.status_code == 200
