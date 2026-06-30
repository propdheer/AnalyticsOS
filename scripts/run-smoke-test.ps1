Set-Location $PSScriptRoot\..

Write-Host "Testing backend endpoints..." -ForegroundColor Cyan

$endpoints = @(
    "http://127.0.0.1:8000/health",
    "http://127.0.0.1:8000/version",
    "http://127.0.0.1:8000/api/v1/app/config",
    "http://127.0.0.1:8000/api/v1/projects",
    "http://127.0.0.1:8000/api/v1/datasets",
    "http://127.0.0.1:8000/api/v1/business-rules",
    "http://127.0.0.1:8000/api/v1/prompt-templates",
    "http://127.0.0.1:8000/api/v1/memories",
    "http://127.0.0.1:8000/api/v1/knowledge-assets",
    "http://127.0.0.1:8000/api/v1/actions",
    "http://127.0.0.1:8000/api/v1/actions/runs",
    "http://127.0.0.1:8000/api/v1/ai/status",
    "http://127.0.0.1:8000/api/v1/ai/models",
    "http://127.0.0.1:8000/api/v1/integrations/status",
    "http://127.0.0.1:8000/api/v1/rag/status",
    "http://127.0.0.1:8000/api/v1/search?q=AnalyticsOS",
    "http://127.0.0.1:8000/api/v1/backup/export"
)

foreach ($endpoint in $endpoints) {
    try {
        Invoke-RestMethod -Uri $endpoint -Method Get | Out-Null
        Write-Host "OK  $endpoint" -ForegroundColor Green
    } catch {
        Write-Host "FAIL $endpoint" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Smoke test passed." -ForegroundColor Green
