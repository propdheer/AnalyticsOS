from app.domain.backup import BackupPayload, ImportResult
from app.domain.business_rules import BusinessRule
from app.domain.datasets import Dataset
from app.domain.knowledge_assets import KnowledgeAsset
from app.domain.memories import Memory
from app.domain.projects import Project
from app.domain.prompt_templates import PromptTemplate
from app.services.business_rule_service import create_business_rule, list_business_rules
from app.services.dataset_service import create_dataset, list_datasets
from app.services.knowledge_service import create_asset, list_assets
from app.services.memory_service import create_memory, list_memories
from app.services.project_service import create_project, list_projects
from app.services.prompt_template_service import create_prompt_template, list_prompt_templates


def export_backup() -> BackupPayload:
    return BackupPayload(
        version="0.2.0-alpha",
        projects=[item.model_dump(mode="json") for item in list_projects()],
        datasets=[item.model_dump(mode="json") for item in list_datasets()],
        business_rules=[item.model_dump(mode="json") for item in list_business_rules()],
        prompt_templates=[item.model_dump(mode="json") for item in list_prompt_templates()],
        memories=[item.model_dump(mode="json") for item in list_memories()],
        knowledge_assets=[item.model_dump(mode="json") for item in list_assets()],
    )


def import_backup(payload: BackupPayload) -> ImportResult:
    result = ImportResult()

    for item in payload.projects:
        create_project(Project.model_validate(item))
        result.imported_projects += 1

    for item in payload.datasets:
        create_dataset(Dataset.model_validate(item))
        result.imported_datasets += 1

    for item in payload.business_rules:
        create_business_rule(BusinessRule.model_validate(item))
        result.imported_business_rules += 1

    for item in payload.prompt_templates:
        create_prompt_template(PromptTemplate.model_validate(item))
        result.imported_prompt_templates += 1

    for item in payload.memories:
        create_memory(Memory.model_validate(item))
        result.imported_memories += 1

    for item in payload.knowledge_assets:
        create_asset(KnowledgeAsset.model_validate(item))
        result.imported_knowledge_assets += 1

    return result
