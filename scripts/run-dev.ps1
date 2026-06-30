Set-Location $PSScriptRoot\..

Write-Host "Open two PowerShell windows for local development:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Window 1 - Backend:" -ForegroundColor Green
Write-Host ".\scripts\run-backend.ps1"
Write-Host ""
Write-Host "Window 2 - Frontend:" -ForegroundColor Green
Write-Host ".\scripts\run-frontend.ps1"
Write-Host ""
Write-Host "Then open:" -ForegroundColor Cyan
Write-Host "http://localhost:3000"
