from fastapi import APIRouter, HTTPException

from app.domain.datasets import Dataset
from app.services.dataset_service import create_dataset, delete_dataset, get_dataset, list_datasets

router = APIRouter()


@router.get("")
def get_datasets() -> list[Dataset]:
    return list_datasets()


@router.get("/{dataset_id}")
def get_dataset_by_id(dataset_id: str) -> Dataset:
    dataset = get_dataset(dataset_id)
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.post("")
def post_dataset(dataset: Dataset) -> Dataset:
    return create_dataset(dataset)


@router.delete("/{dataset_id}")
def delete_dataset_by_id(dataset_id: str) -> dict[str, bool]:
    deleted = delete_dataset(dataset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"deleted": True}
