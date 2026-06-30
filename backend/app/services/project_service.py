from app.core.storage import JsonRepository
from app.domain.projects import Project

repo = JsonRepository("projects.json", Project)


def seed_defaults() -> None:
    if not repo.get("analyticsos"):
        repo.upsert(
            Project(
                id="analyticsos",
                name="AnalyticsOS",
                description="Local-first Professional Intelligence Platform.",
                status="active",
                function="Platform",
                owner="Dheer Lakhotia",
            )
        )


def list_projects() -> list[Project]:
    seed_defaults()
    return repo.list()


def get_project(project_id: str) -> Project | None:
    seed_defaults()
    return repo.get(project_id)


def create_project(project: Project) -> Project:
    return repo.upsert(project)


def delete_project(project_id: str) -> bool:
    return repo.delete(project_id)
