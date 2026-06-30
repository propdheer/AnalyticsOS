from app.core.storage import JsonRepository
from app.domain.prompt_templates import PromptTemplate

repo = JsonRepository("prompt_templates.json", PromptTemplate)


def seed_defaults() -> None:
    if not repo.get("notebooklm-slide-brief"):
        repo.upsert(
            PromptTemplate(
                id="notebooklm-slide-brief",
                name="NotebookLM Slide Brief",
                description="Create a concise slide-generation brief from project context.",
                template_type="slide_brief",
                template="Convert the following project context into clear, concise, executive-ready slides: {{context}}",
                target_tool="NotebookLM",
            )
        )


def list_prompt_templates() -> list[PromptTemplate]:
    seed_defaults()
    return repo.list()


def get_prompt_template(template_id: str) -> PromptTemplate | None:
    seed_defaults()
    return repo.get(template_id)


def create_prompt_template(template: PromptTemplate) -> PromptTemplate:
    return repo.upsert(template)


def delete_prompt_template(template_id: str) -> bool:
    return repo.delete(template_id)
