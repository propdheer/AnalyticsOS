from fastapi import APIRouter, HTTPException

from app.domain.prompt_templates import PromptTemplate
from app.services.prompt_template_service import (
    create_prompt_template,
    delete_prompt_template,
    get_prompt_template,
    list_prompt_templates,
)

router = APIRouter()


@router.get("")
def get_prompt_templates() -> list[PromptTemplate]:
    return list_prompt_templates()


@router.get("/{template_id}")
def get_prompt_template_by_id(template_id: str) -> PromptTemplate:
    template = get_prompt_template(template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Prompt template not found")
    return template


@router.post("")
def post_prompt_template(template: PromptTemplate) -> PromptTemplate:
    return create_prompt_template(template)


@router.delete("/{template_id}")
def delete_prompt_template_by_id(template_id: str) -> dict[str, bool]:
    deleted = delete_prompt_template(template_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Prompt template not found")
    return {"deleted": True}
