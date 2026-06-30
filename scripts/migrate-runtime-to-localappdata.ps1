Set-Location $PSScriptRoot\..

$localRoot = Join-Path $env:LOCALAPPDATA "AnalyticsOS"
$localData = Join-Path $localRoot "data"
$localKnowledge = Join-Path $localRoot "knowledge"

Write-Host "This helper migrates repo data to LocalAppData." -ForegroundColor Cyan
Write-Host "Use this on a personal laptop if you want local-only runtime data."
Write-Host "For office laptop OneDrive runtime, use:"
Write-Host "  .\scripts\configure-runtime-paths.ps1"
Write-Host ""

.\scripts\migrate-runtime-data.ps1 -TargetDataDir $localData -TargetKnowledgeDir $localKnowledge
