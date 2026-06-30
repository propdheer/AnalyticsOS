from app.core.storage import JsonRepository
from app.domain.datasets import Dataset

repo = JsonRepository("datasets.json", Dataset)


def seed_defaults() -> None:
    if not repo.get("sample-sales-primary"):
        repo.upsert(
            Dataset(
                id="sample-sales-primary",
                name="Sales Primary",
                description="Sample primary sales dataset placeholder.",
                dataset_type="table",
                source_system="Demo",
                owner="AnalyticsOS",
            )
        )


def list_datasets() -> list[Dataset]:
    seed_defaults()
    return repo.list()


def get_dataset(dataset_id: str) -> Dataset | None:
    seed_defaults()
    return repo.get(dataset_id)


def create_dataset(dataset: Dataset) -> Dataset:
    return repo.upsert(dataset)


def delete_dataset(dataset_id: str) -> bool:
    return repo.delete(dataset_id)
