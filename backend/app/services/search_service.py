from pydantic import BaseModel

from app.services.business_rule_service import list_business_rules
from app.services.dataset_service import list_datasets
from app.services.knowledge_service import search_assets
from app.services.memory_service import list_memories
from app.services.project_service import list_projects
from app.services.prompt_template_service import list_prompt_templates


class GlobalSearchResult(BaseModel):
    source: str
    id: str
    title: str
    snippet: str
    score: int


def global_search(query: str) -> list[GlobalSearchResult]:
    normalized = query.strip().lower()
    if not normalized:
        return []

    results: list[GlobalSearchResult] = []

    def add(source: str, item_id: str, title: str, text: str) -> None:
        haystack = f"{item_id} {title} {text}".lower()
        score = haystack.count(normalized)
        if score > 0:
            results.append(GlobalSearchResult(source=source, id=item_id, title=title, snippet=text[:260], score=score))

    for project in list_projects():
        add("projects", project.id, project.name, project.description)
    for dataset in list_datasets():
        add("datasets", dataset.id, dataset.name, f"{dataset.description} {dataset.source_system}")
    for rule in list_business_rules():
        add("business-rules", rule.id, rule.name, rule.definition)
    for template in list_prompt_templates():
        add("prompt-templates", template.id, template.name, f"{template.description} {template.template}")
    for memory in list_memories():
        add("memories", memory.id, memory.title, memory.content)
    for asset in search_assets(query):
        results.append(GlobalSearchResult(source="knowledge-assets", id=asset.id, title=asset.title, snippet=asset.snippet, score=asset.score))

    return sorted(results, key=lambda result: result.score, reverse=True)
