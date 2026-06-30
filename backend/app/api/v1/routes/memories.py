from fastapi import APIRouter, HTTPException

from app.domain.memories import Memory
from app.services.memory_service import create_memory, delete_memory, get_memory, list_memories

router = APIRouter()


@router.get("")
def get_memories() -> list[Memory]:
    return list_memories()


@router.get("/{memory_id}")
def get_memory_by_id(memory_id: str) -> Memory:
    memory = get_memory(memory_id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory


@router.post("")
def post_memory(memory: Memory) -> Memory:
    return create_memory(memory)


@router.delete("/{memory_id}")
def delete_memory_by_id(memory_id: str) -> dict[str, bool]:
    deleted = delete_memory(memory_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"deleted": True}
