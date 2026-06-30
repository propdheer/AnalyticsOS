Set-Location $PSScriptRoot\..\frontend

if (-not (Test-Path ".\node_modules")) {
    Write-Host "node_modules not found. Running npm install first..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting AnalyticsOS frontend..." -ForegroundColor Green
npm run dev
