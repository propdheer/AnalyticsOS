Set-Location $PSScriptRoot\..

Write-Host "AnalyticsOS Runtime Path Configuration" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose where this machine should store live AnalyticsOS data."
Write-Host ""
Write-Host "Recommended choices:"
Write-Host "  Office laptop   -> OneDrive path"
Write-Host "  Personal laptop -> LocalAppData path"
Write-Host ""

$defaultLocalRoot = Join-Path $env:LOCALAPPDATA "AnalyticsOS"
$defaultLocalData = Join-Path $defaultLocalRoot "data"
$defaultLocalKnowledge = Join-Path $defaultLocalRoot "knowledge"

$oneDriveRoot = if ($env:OneDrive) { Join-Path $env:OneDrive "AnalyticsOS-runtime" } else { "" }
$defaultOneDriveData = if ($oneDriveRoot) { Join-Path $oneDriveRoot "data" } else { "" }
$defaultOneDriveKnowledge = if ($oneDriveRoot) { Join-Path $oneDriveRoot "knowledge" } else { "" }

Write-Host "1. Local only: $defaultLocalRoot"
if ($oneDriveRoot) {
    Write-Host "2. OneDrive:   $oneDriveRoot"
}
Write-Host "3. Custom paths"
Write-Host ""

$choice = Read-Host "Select option 1, 2, or 3"

if ($choice -eq "1") {
    $dataDir = $defaultLocalData
    $knowledgeDir = $defaultLocalKnowledge
} elseif ($choice -eq "2" -and $oneDriveRoot) {
    $dataDir = $defaultOneDriveData
    $knowledgeDir = $defaultOneDriveKnowledge
} elseif ($choice -eq "3") {
    $dataDir = Read-Host "Enter full data directory path"
    $knowledgeDir = Read-Host "Enter full knowledge directory path"
} else {
    Write-Host "Invalid selection." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force $dataDir | Out-Null
New-Item -ItemType Directory -Force $knowledgeDir | Out-Null

$envPath = Join-Path $PWD ".env"

$existing = [ordered]@{}
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $existing[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$existing["ANALYTICSOS_DATA_DIR"] = $dataDir
$existing["ANALYTICSOS_KNOWLEDGE_DIR"] = $knowledgeDir

$lines = @()
foreach ($key in $existing.Keys) {
    $lines += "$key=$($existing[$key])"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($envPath, ($lines -join [Environment]::NewLine), $utf8NoBom)

Write-Host ""
Write-Host "Runtime paths saved to .env" -ForegroundColor Green
Write-Host "Data:      $dataDir"
Write-Host "Knowledge: $knowledgeDir"
Write-Host ""
Write-Host "Restart the backend for these changes to apply." -ForegroundColor Yellow
