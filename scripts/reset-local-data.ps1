\
Set-Location $PSScriptRoot\..

if (Test-Path ".\data") {
    Remove-Item ".\data" -Recurse -Force
}

New-Item -ItemType Directory -Force ".\data" | Out-Null

Write-Host "Local AnalyticsOS data reset." -ForegroundColor Green
