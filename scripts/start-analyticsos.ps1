Set-Location $PSScriptRoot\..

Write-Host "Starting AnalyticsOS..." -ForegroundColor Cyan

if (!(Test-Path ".\.env")) {
    Write-Host ".env not found. Runtime paths will use backend defaults." -ForegroundColor Yellow
    Write-Host "To choose local or OneDrive runtime paths, run:" -ForegroundColor Yellow
    Write-Host "  .\scripts\configure-runtime-paths.ps1" -ForegroundColor Yellow
}

if (Test-Path ".\.venv\Scripts\Activate.ps1") {
    . .\.venv\Scripts\Activate.ps1
} else {
    Write-Host "Python virtual environment not found. Create it before using this script." -ForegroundColor Yellow
}

Write-Host "Opening backend and frontend in separate PowerShell windows..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PWD'; .\.venv\Scripts\Activate.ps1; .\scripts\run-backend.ps1"
Start-Sleep -Seconds 4
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$PWD'; .\scripts\run-frontend.ps1"
Start-Sleep -Seconds 3

Start-Process "http://localhost:3000"
Write-Host "AnalyticsOS startup launched." -ForegroundColor Green
