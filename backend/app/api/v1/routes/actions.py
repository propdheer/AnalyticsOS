from fastapi import APIRouter, HTTPException

from app.domain.actions import (
    ActionRunRecord,
    ActionRunRequest,
    ActionRunResult,
    ActionTemplate,
    SaveActionOutputRequest,
)
from app.domain.knowledge_assets import KnowledgeAsset
from app.services.action_service import (
    create_action,
    delete_action,
    delete_action_run,
    get_action,
    get_action_run,
    list_action_runs,
    list_actions,
    preview_action,
    run_action,
    save_action_output_as_knowledge,
)

router = APIRouter()


@router.get("")
def get_actions() -> list[ActionTemplate]:
    return list_actions()


@router.get("/runs")
def get_action_runs() -> list[ActionRunRecord]:
    return list_action_runs()


@router.get("/runs/{run_id}")
def get_action_run_by_id(run_id: str) -> ActionRunRecord:
    run = get_action_run(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Action run not found")
    return run


@router.delete("/runs/{run_id}")
def delete_action_run_by_id(run_id: str) -> dict[str, bool]:
    deleted = delete_action_run(run_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Action run not found")
    return {"deleted": True}


@router.post("/runs/save-as-knowledge")
def post_save_action_output_as_knowledge(payload: SaveActionOutputRequest) -> KnowledgeAsset:
    try:
        return save_action_output_as_knowledge(payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/preview")
def post_preview_action(request: ActionRunRequest) -> ActionRunResult:
    try:
        return preview_action(request)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/{action_id}")
def get_action_by_id(action_id: str) -> ActionTemplate:
    action = get_action(action_id)
    if action is None:
        raise HTTPException(status_code=404, detail="Action not found")
    return action


@router.post("")
def post_action(action: ActionTemplate) -> ActionTemplate:
    return create_action(action)


@router.delete("/{action_id}")
def delete_action_by_id(action_id: str) -> dict[str, bool]:
    deleted = delete_action(action_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Action not found")
    return {"deleted": True}


@router.post("/run")
def post_run_action(request: ActionRunRequest) -> ActionRunRecord:
    try:
        return run_action(request)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
