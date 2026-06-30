from datetime import datetime, timezone
import re

from app.core.config import settings
from app.core.storage import JsonRepository
from app.domain.actions import (
    ActionRunRecord,
    ActionRunRequest,
    ActionRunResult,
    ActionTemplate,
    ExecutionMode,
    SaveActionOutputRequest,
)
from app.domain.knowledge_assets import KnowledgeAsset
from app.services.app_settings_service import effective_ollama_default_model
from app.services.dataset_service import get_dataset
from app.services.knowledge_service import create_asset
from app.services.ollama_service import generate_with_ollama
from app.services.project_service import get_project

repo = JsonRepository("action_templates.json", ActionTemplate)
run_repo = JsonRepository("action_runs.json", ActionRunRecord)


def seed_defaults() -> None:
    defaults = [
        ActionTemplate(
            id="create-use-case-ppt",
            name="Create Use Case PPT Brief",
            description="Create an executive-ready slide brief for an analytics use case.",
            category="presentation",
            output_type="slide_brief",
            prompt_template=(
                "Create a PowerPoint slide brief for this analytics use case.\n\n"
                "Audience: {{audience}}\n"
                "Tone: {{tone}}\n\n"
                "Context:\n{{context}}\n\n"
                "Additional Context:\n{{additional_context}}\n\n"
                "Output format:\n"
                "1. Slide title\n"
                "2. Key message\n"
                "3. Recommended visual\n"
                "4. Speaker notes\n"
                "Create 8 to 10 slides."
            ),
        ),
        ActionTemplate(
            id="generate-adoption-update",
            name="Generate Adoption Update",
            description="Create a crisp adoption/status update for a project or analytics program.",
            category="update",
            output_type="markdown",
            prompt_template=(
                "Create an adoption update for the following initiative.\n\n"
                "Audience: {{audience}}\n"
                "Tone: {{tone}}\n\n"
                "Context:\n{{context}}\n\n"
                "Additional Context:\n{{additional_context}}\n\n"
                "Include: progress, adoption indicators, blockers, decisions needed, and next actions."
            ),
        ),
        ActionTemplate(
            id="create-dashboard-requirement",
            name="Create Dashboard Requirement Document",
            description="Turn a use case into a clear Power BI dashboard requirement document.",
            category="documentation",
            output_type="markdown",
            prompt_template=(
                "Create a dashboard requirement document.\n\n"
                "Context:\n{{context}}\n\n"
                "Additional Context:\n{{additional_context}}\n\n"
                "Include: business objective, users, KPIs, filters, drilldowns, data sources, refresh frequency, security, and open questions."
            ),
        ),
        ActionTemplate(
            id="create-data-quality-checklist",
            name="Create Data Quality Checklist",
            description="Create a practical checklist to validate an analytics dataset.",
            category="governance",
            output_type="checklist",
            prompt_template=(
                "Create a data quality checklist for this dataset and use case.\n\n"
                "Context:\n{{context}}\n\n"
                "Additional Context:\n{{additional_context}}\n\n"
                "Group checks into completeness, accuracy, consistency, timeliness, duplicates, business rules, and sign-off."
            ),
        ),
        ActionTemplate(
            id="draft-stakeholder-email",
            name="Draft Stakeholder Email",
            description="Draft a concise stakeholder email for a project update or request.",
            category="communication",
            output_type="email",
            prompt_template=(
                "Draft a stakeholder email.\n\n"
                "Audience: {{audience}}\n"
                "Tone: {{tone}}\n\n"
                "Context:\n{{context}}\n\n"
                "Additional Context:\n{{additional_context}}\n\n"
                "Make it concise, clear, and action-oriented."
            ),
        ),
    ]

    for action in defaults:
        if not repo.get(action.id):
            repo.upsert(action)


def list_actions() -> list[ActionTemplate]:
    seed_defaults()
    return repo.list()


def get_action(action_id: str) -> ActionTemplate | None:
    seed_defaults()
    return repo.get(action_id)


def create_action(action: ActionTemplate) -> ActionTemplate:
    return repo.upsert(action)


def delete_action(action_id: str) -> bool:
    return repo.delete(action_id)


def list_action_runs() -> list[ActionRunRecord]:
    return sorted(run_repo.list(), key=lambda item: item.created_at, reverse=True)


def get_action_run(run_id: str) -> ActionRunRecord | None:
    return run_repo.get(run_id)


def delete_action_run(run_id: str) -> bool:
    return run_repo.delete(run_id)


def preview_action(request: ActionRunRequest) -> ActionRunResult:
    action = get_action(request.action_id)
    if action is None:
        raise ValueError("Action template not found")

    prompt = render_prompt(action, request)
    selected_model = request.model or action.default_model or effective_ollama_default_model()

    if request.execution_mode == ExecutionMode.ollama:
        output = generate_with_ollama(prompt, selected_model)
        used_ai = True
    else:
        output = prompt
        used_ai = False

    return ActionRunResult(
        action_id=action.id,
        action_name=action.name,
        execution_mode=request.execution_mode,
        model=selected_model,
        rendered_prompt=prompt,
        output=output,
        used_ai=used_ai,
    )


def run_action(request: ActionRunRequest) -> ActionRunRecord:
    result = preview_action(request)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    run_id = f"{result.action_id}-{timestamp}"

    record = ActionRunRecord(
        id=run_id,
        action_id=result.action_id,
        action_name=result.action_name,
        execution_mode=result.execution_mode,
        model=result.model,
        project_id=request.project_id,
        dataset_id=request.dataset_id,
        audience=request.audience,
        tone=request.tone,
        rendered_prompt=result.rendered_prompt,
        output=result.output,
        used_ai=result.used_ai,
    )
    return run_repo.upsert(record)


def save_action_output_as_knowledge(payload: SaveActionOutputRequest) -> KnowledgeAsset:
    run = get_action_run(payload.run_id)
    if run is None:
        raise ValueError("Action run not found")

    title = payload.title.strip() or run.action_name
    slug = _slugify(f"{title}-{run.id}")
    from pathlib import Path
    target = Path(settings.knowledge_dir) / "action-outputs" / f"{slug}.md"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        f"# {title}\n\n"
        f"Generated by AnalyticsOS action: `{run.action_name}`\n\n"
        f"Execution mode: `{run.execution_mode}`\n\n"
        f"Model: `{run.model}`\n\n"
        f"Created at: `{run.created_at}`\n\n"
        f"---\n\n"
        f"{run.output}\n",
        encoding="utf-8",
    )

    asset = KnowledgeAsset(
        id=slug,
        title=title,
        path=target.as_posix(),
        asset_type="markdown",
        summary=f"Saved output from action run {run.id}.",
        tags=payload.tags or ["action-output", run.action_id],
    )
    return create_asset(asset)


def render_prompt(action: ActionTemplate, request: ActionRunRequest) -> str:
    project_context = "No project selected."
    dataset_context = "No dataset selected."

    if request.project_id:
        project = get_project(request.project_id)
        if project is not None:
            project_context = (
                f"Project: {project.name}\n"
                f"ID: {project.id}\n"
                f"Status: {project.status}\n"
                f"Function: {project.function}\n"
                f"Owner: {project.owner}\n"
                f"Description: {project.description}"
            )

    if request.dataset_id:
        dataset = get_dataset(request.dataset_id)
        if dataset is not None:
            dataset_context = (
                f"Dataset: {dataset.name}\n"
                f"ID: {dataset.id}\n"
                f"Type: {dataset.dataset_type}\n"
                f"Source: {dataset.source_system}\n"
                f"Owner: {dataset.owner}\n"
                f"Description: {dataset.description}"
            )

    combined_context = f"{project_context}\n\n{dataset_context}"

    prompt = action.prompt_template
    replacements = {
        "{{audience}}": request.audience,
        "{{tone}}": request.tone,
        "{{project_context}}": project_context,
        "{{dataset_context}}": dataset_context,
        "{{additional_context}}": request.additional_context,
        "{{context}}": combined_context,
        "{{Context}}": combined_context,
        "{{CONTEXT}}": combined_context,
    }

    for token, value in replacements.items():
        prompt = prompt.replace(token, value)

    return prompt


def _slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9-_ ]+", "", value)
    value = re.sub(r"\s+", "-", value)
    return value[:120]
