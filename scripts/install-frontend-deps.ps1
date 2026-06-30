Set-Location $PSScriptRoot\..\frontend

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm was not found. Install Node.js before running this script." -ForegroundColor Red
    exit 1
}

npm install

Write-Host "Frontend dependencies installed." -ForegroundColor Green
