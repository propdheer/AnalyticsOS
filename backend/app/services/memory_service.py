from app.core.storage import JsonRepository
from app.domain.memories import Memory

repo = JsonRepository("memories.json", Memory)


def seed_defaults() -> None:
    if not repo.get("local-first-principle"):
        repo.upsert(
            Memory(
                id="local-first-principle",
                title="Local-first principle",
                content="AnalyticsOS should preserve a strong local-first operating mode.",
                memory_type="decision",
                source="Founding principle",
                approved=True,
            )
        )


def list_memories() -> list[Memory]:
    seed_defaults()
    return repo.list()


def get_memory(memory_id: str) -> Memory | None:
    seed_defaults()
    return repo.get(memory_id)


def create_memory(memory: Memory) -> Memory:
    return repo.upsert(memory)


def delete_memory(memory_id: str) -> bool:
    return repo.delete(memory_id)
