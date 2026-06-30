Set-Location $PSScriptRoot\..

$backupDir = ".\backups"
New-Item -ItemType Directory -Force $backupDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outFile = "$backupDir\analyticsos-backup-$stamp.json"

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/backup/export" -Method Get | ConvertTo-Json -Depth 20 | Set-Content $outFile

Write-Host "Backup exported to $outFile" -ForegroundColor Green
