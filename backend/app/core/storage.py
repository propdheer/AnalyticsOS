from __future__ import annotations

import json
from pathlib import Path
from typing import Generic, TypeVar

from pydantic import BaseModel

from app.core.config import settings

ModelT = TypeVar("ModelT", bound=BaseModel)


class JsonRepository(Generic[ModelT]):
    def __init__(self, filename: str, model: type[ModelT]) -> None:
        self.model = model
        self.path = Path(settings.data_dir) / filename
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def list(self) -> list[ModelT]:
        return [self.model.model_validate(item) for item in self._read_raw()]

    def get(self, item_id: str) -> ModelT | None:
        for item in self.list():
            if getattr(item, "id") == item_id:
                return item
        return None

    def upsert(self, item: ModelT) -> ModelT:
        items = self.list()
        updated = False
        for index, existing in enumerate(items):
            if getattr(existing, "id") == getattr(item, "id"):
                items[index] = item
                updated = True
                break

        if not updated:
            items.append(item)

        self._write(items)
        return item

    def delete(self, item_id: str) -> bool:
        items = self.list()
        remaining = [item for item in items if getattr(item, "id") != item_id]
        if len(remaining) == len(items):
            return False

        self._write(remaining)
        return True

    def _read_raw(self) -> list[dict]:
        if not self.path.exists():
            return []

        content = self.path.read_text(encoding="utf-8").strip()
        if not content:
            return []

        payload = json.loads(content)
        if not isinstance(payload, list):
            raise ValueError(f"Expected list payload in {self.path}")
        return payload

    def _write(self, items: list[ModelT]) -> None:
        payload = [item.model_dump(mode="json") for item in items]
        self.path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
