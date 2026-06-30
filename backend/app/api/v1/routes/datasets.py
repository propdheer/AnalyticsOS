from fastapi import APIRouter

from app.domain.datasets import Dataset
from app.services.dataset_service import create_dataset, list_datasets

router = APIRouter()


@router.get("")
def get_datasets() -> list[Dataset]:
    return list_datasets()


@router.post("")
def post_dataset(dataset: Dataset) -> Dataset:
    return create_dataset(dataset)
