Set-Location $PSScriptRoot\..

Write-Host "AnalyticsOS Second Brain verification" -ForegroundColor Cyan
Write-Host "Repo: $(Get-Location)" -ForegroundColor Cyan

$expectedRoot = Join-Path ([Environment]::GetFolderPath("Desktop")) "Second Brain\AnalyticsOS"
$currentRoot = (Get-Location).Path

if ($currentRoot -ne $expectedRoot) {
    Write-Host "WARNING: You are not in the expected Second Brain AnalyticsOS folder." -ForegroundColor Yellow
    Write-Host "Current:  $currentRoot"
    Write-Host "Expected: $expectedRoot"
} else {
    Write-Host "OK Project root is the Second Brain AnalyticsOS folder." -ForegroundColor Green
}

$checks = @(
    @{ Name = "Virtual environment"; Path = ".\.venv\Scripts\Activate.ps1" },
    @{ Name = "Environment file"; Path = ".\.env" },
    @{ Name = "Backend folder"; Path = ".\backend" },
    @{ Name = "Frontend folder"; Path = ".\frontend" },
    @{ Name = "Data folder"; Path = "..\Data" },
    @{ Name = "Knowledge folder"; Path = "..\Knowledge" }
)

foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "OK $($check.Name): $($check.Path)" -ForegroundColor Green
    } else {
        Write-Host "MISSING $($check.Name): $($check.Path)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Git top-level:" -ForegroundColor Cyan
git rev-parse --show-toplevel

Write-Host ""
Write-Host "Git remote:" -ForegroundColor Cyan
git remote -v

Write-Host ""
Write-Host "Runtime paths from .env:" -ForegroundColor Cyan
if (Test-Path ".\.env") {
    Get-Content ".\.env" | Where-Object { $_ -match "ANALYTICSOS_(DATA_DIR|KNOWLEDGE_DIR|OLLAMA|ANYTHINGLLM|OBSIDIAN)" }
}
