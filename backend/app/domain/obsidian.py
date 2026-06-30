from pydantic import BaseModel


class ObsidianExportRequest(BaseModel):
    title: str
    content: str
    folder: str = "AnalyticsOS Outputs"


class ObsidianExportResult(BaseModel):
    exported: bool
    path: str
    message: str
