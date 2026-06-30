Set-Location $PSScriptRoot\..

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Write-Host "Running v0.5.2 validation..." -ForegroundColor Cyan

.\scripts\verify-second-brain.ps1

Write-Host ""
Write-Host "Running backend tests..." -ForegroundColor Cyan
.\scripts\test-backend.ps1
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Running frontend typecheck..." -ForegroundColor Cyan
Push-Location frontend
npm run typecheck
$frontendExit = $LASTEXITCODE
Pop-Location

if ($frontendExit -ne 0) {
    exit $frontendExit
}

Write-Host ""
Write-Host "v0.5.2 validation passed." -ForegroundColor Green
