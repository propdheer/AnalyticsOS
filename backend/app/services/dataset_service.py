from app.domain.datasets import Dataset

_datasets: dict[str, Dataset] = {
    "sample-sales-primary": Dataset(
        id="sample-sales-primary",
        name="Sales Primary",
        description="Sample primary sales dataset placeholder.",
        dataset_type="table",
        source_system="Demo",
        owner="AnalyticsOS",
    )
}


def list_datasets() -> list[Dataset]:
    return list(_datasets.values())


def create_dataset(dataset: Dataset) -> Dataset:
    _datasets[dataset.id] = dataset
    return dataset
