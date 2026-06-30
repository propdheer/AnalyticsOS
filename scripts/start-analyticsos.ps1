Set-Location $PSScriptRoot\..

Write-Host "Starting AnalyticsOS..." -ForegroundColor Cyan

$repoPath = (Get-Location).Path
$activatePath = Join-Path $repoPath ".venv\Scripts\Activate.ps1"

if (!(Test-Path $activatePath)) {
    Write-Host "Python virtual environment not found at:" -ForegroundColor Red
    Write-Host $activatePath -ForegroundColor Yellow
    Write-Host "Create the venv before using this script." -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path ".\.env")) {
    Write-Host ".env not found. Runtime paths will use backend defaults." -ForegroundColor Yellow
    Write-Host "To choose local or OneDrive runtime paths, run:" -ForegroundColor Yellow
    Write-Host "  .\scripts\configure-runtime-paths.ps1" -ForegroundColor Yellow
}

$backendCommand = @"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass;
Set-Location -LiteralPath '$repoPath';
. '$activatePath';
Write-Host 'Backend venv:' `$env:VIRTUAL_ENV -ForegroundColor Green;
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
"@

$frontendCommand = @"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass;
Set-Location -LiteralPath '$repoPath';
. '$activatePath';
Write-Host 'Frontend launched with venv active:' `$env:VIRTUAL_ENV -ForegroundColor Green;
Set-Location -LiteralPath '$repoPath\frontend';
npm run dev
"@

Write-Host "Opening backend and frontend in separate PowerShell windows..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand
Start-Sleep -Seconds 3

Start-Process "http://localhost:3000"
Write-Host "AnalyticsOS startup launched." -ForegroundColor Green
