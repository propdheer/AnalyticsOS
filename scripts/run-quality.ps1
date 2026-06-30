\
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".\.venv\Scripts\Activate.ps1")) {
    Write-Host "Virtual environment not found. Run: python -m venv .venv" -ForegroundColor Red
    exit 1
}

. .\.venv\Scripts\Activate.ps1

Write-Host "Running Ruff..." -ForegroundColor Green
ruff check backend tests

Write-Host "Running backend tests..." -ForegroundColor Green
pytest backend\tests
