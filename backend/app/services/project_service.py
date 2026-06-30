from app.domain.projects import Project

_projects: dict[str, Project] = {
    "analyticsos": Project(
        id="analyticsos",
        name="AnalyticsOS",
        description="Local-first Professional Intelligence Platform.",
        status="active",
        function="Platform",
        owner="Dheer Lakhotia",
    )
}


def list_projects() -> list[Project]:
    return list(_projects.values())


def create_project(project: Project) -> Project:
    _projects[project.id] = project
    return project
