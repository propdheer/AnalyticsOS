Set-Location $PSScriptRoot\..

$syncRoot = if ($env:ANALYTICSOS_SYNC_DIR) {
    $env:ANALYTICSOS_SYNC_DIR
} elseif ($env:OneDrive) {
    Join-Path $env:OneDrive "AnalyticsOS-sync"
} else {
    Join-Path $PWD "backups"
}

if (!(Test-Path $syncRoot)) {
    Write-Host "Sync folder does not exist: $syncRoot" -ForegroundColor Yellow
    exit 0
}

$latest = Get-ChildItem $syncRoot -Filter "analyticsos-snapshot-*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (!$latest) {
    Write-Host "No snapshot found in $syncRoot" -ForegroundColor Yellow
    exit 0
}

Write-Host "About to import latest snapshot:" -ForegroundColor Cyan
Write-Host $latest.FullName
Write-Host ""
Write-Host "This imports through the AnalyticsOS backup API into whichever runtime path this machine is configured to use." -ForegroundColor Yellow
$answer = Read-Host "Type YES to import"

if ($answer -ne "YES") {
    Write-Host "Import cancelled." -ForegroundColor Yellow
    exit 0
}

$body = Get-Content $latest.FullName -Raw
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/backup/import" -Method Post -ContentType "application/json" -Body $body | Out-Null
Write-Host "Snapshot imported." -ForegroundColor Green
