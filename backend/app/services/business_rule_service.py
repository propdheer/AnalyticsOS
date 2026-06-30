from app.core.storage import JsonRepository
from app.domain.business_rules import BusinessRule

repo = JsonRepository("business_rules.json", BusinessRule)


def seed_defaults() -> None:
    if not repo.get("active-distributor"):
        repo.upsert(
            BusinessRule(
                id="active-distributor",
                name="Active Distributor",
                definition="A distributor is considered active if billed within the last 60 days.",
                domain="Sales",
                status="draft",
                owner="AnalyticsOS",
                source="Seed data",
            )
        )


def list_business_rules() -> list[BusinessRule]:
    seed_defaults()
    return repo.list()


def get_business_rule(rule_id: str) -> BusinessRule | None:
    seed_defaults()
    return repo.get(rule_id)


def create_business_rule(rule: BusinessRule) -> BusinessRule:
    return repo.upsert(rule)


def delete_business_rule(rule_id: str) -> bool:
    return repo.delete(rule_id)
