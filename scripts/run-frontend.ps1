Set-Location $PSScriptRoot\..\frontend

if (-not (Test-Path ".\node_modules")) {
    Write-Host "node_modules not found. Running npm install first..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path ".\.env.local")) {
    if (Test-Path ".\.env.local.example") {
        Copy-Item ".\.env.local.example" ".\.env.local"
        Write-Host "Created frontend .env.local from example." -ForegroundColor Green
    }
}

Write-Host "Starting AnalyticsOS frontend..." -ForegroundColor Green
npm run dev
