from enum import StrEnum
from pydantic import BaseModel, Field


class DatasetType(StrEnum):
    table = "table"
    file = "file"
    dashboard = "dashboard"
    notebook = "notebook"
    unknown = "unknown"


class Dataset(BaseModel):
    id: str = Field(..., description="Stable dataset identifier.")
    name: str
    description: str = ""
    dataset_type: DatasetType = DatasetType.unknown
    source_system: str = ""
    owner: str = ""
