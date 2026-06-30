Set-Location $PSScriptRoot\..

if (-not (Test-Path ".\.venv\Scripts\Activate.ps1")) {
    Write-Host "Virtual environment not found. Run: python -m venv .venv" -ForegroundColor Red
    exit 1
}

. .\.venv\Scripts\Activate.ps1

Write-Host "Starting AnalyticsOS backend..." -ForegroundColor Green
Set-Location backend
python -m uvicorn app.main:app --reload
