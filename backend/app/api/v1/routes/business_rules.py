from fastapi import APIRouter, HTTPException

from app.domain.business_rules import BusinessRule
from app.services.business_rule_service import (
    create_business_rule,
    delete_business_rule,
    get_business_rule,
    list_business_rules,
)

router = APIRouter()


@router.get("")
def get_business_rules() -> list[BusinessRule]:
    return list_business_rules()


@router.get("/{rule_id}")
def get_business_rule_by_id(rule_id: str) -> BusinessRule:
    rule = get_business_rule(rule_id)
    if rule is None:
        raise HTTPException(status_code=404, detail="Business rule not found")
    return rule


@router.post("")
def post_business_rule(rule: BusinessRule) -> BusinessRule:
    return create_business_rule(rule)


@router.delete("/{rule_id}")
def delete_business_rule_by_id(rule_id: str) -> dict[str, bool]:
    deleted = delete_business_rule(rule_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Business rule not found")
    return {"deleted": True}
