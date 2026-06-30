param(
    [string]$TargetDataDir = "",
    [string]$TargetKnowledgeDir = ""
)

Set-Location $PSScriptRoot\..

if (!$TargetDataDir -or !$TargetKnowledgeDir) {
    Write-Host "No target paths provided." -ForegroundColor Yellow
    Write-Host "Run .\scripts\configure-runtime-paths.ps1 first, or call this script with:"
    Write-Host '.\scripts\migrate-runtime-data.ps1 -TargetDataDir "C:\Path\data" -TargetKnowledgeDir "C:\Path\knowledge"'
    exit 0
}

New-Item -ItemType Directory -Force $TargetDataDir | Out-Null
New-Item -ItemType Directory -Force $TargetKnowledgeDir | Out-Null

if (Test-Path ".\data") {
    Copy-Item ".\data\*" $TargetDataDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Copied repo data/ to $TargetDataDir" -ForegroundColor Green
}

if (Test-Path ".\knowledge") {
    Copy-Item ".\knowledge\*" $TargetKnowledgeDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Copied repo knowledge/ to $TargetKnowledgeDir" -ForegroundColor Green
}

Write-Host "Runtime data migration complete." -ForegroundColor Cyan
