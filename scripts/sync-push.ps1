Set-Location $PSScriptRoot\..

$syncRoot = if ($env:ANALYTICSOS_SYNC_DIR) {
    $env:ANALYTICSOS_SYNC_DIR
} elseif ($env:OneDrive) {
    Join-Path $env:OneDrive "AnalyticsOS-sync"
} else {
    Join-Path $PWD "backups"
}

New-Item -ItemType Directory -Force $syncRoot | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outFile = Join-Path $syncRoot "analyticsos-snapshot-$stamp.json"

Write-Host "Exporting AnalyticsOS snapshot to $outFile" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/backup/export" -Method Get | ConvertTo-Json -Depth 50 | Set-Content $outFile

Write-Host "Snapshot exported." -ForegroundColor Green
