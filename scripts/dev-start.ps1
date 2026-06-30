\
Write-Host "Starting AnalyticsOS development environment..." -ForegroundColor Green

Set-Location $PSScriptRoot\..

if (Test-Path ".\.venv\Scripts\Activate.ps1") {
    . .\.venv\Scripts\Activate.ps1
    Write-Host "Python virtual environment activated." -ForegroundColor Green
} else {
    Write-Host "Virtual environment not found. Run: python -m venv .venv" -ForegroundColor Yellow
}
