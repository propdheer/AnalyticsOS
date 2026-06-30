from pydantic import BaseModel


class RuntimeCheck(BaseModel):
    name: str
    ok: bool
    details: str = ""


class RuntimeStatus(BaseModel):
    version: str
    project_root: str
    data_dir: str
    knowledge_dir: str
    venv: str
    checks: list[RuntimeCheck]
