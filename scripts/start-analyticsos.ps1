Set-Location $PSScriptRoot\..

Write-Host "Starting AnalyticsOS..." -ForegroundColor Cyan

$repoPath = (Get-Location).Path
$activatePath = Join-Path $repoPath ".venv\Scripts\Activate.ps1"

if (!(Test-Path $activatePath)) {
    Write-Host "Python virtual environment not found at:" -ForegroundColor Red
    Write-Host $activatePath -ForegroundColor Yellow
    exit 1
}

if (!(Test-Path ".\.env")) {
    Write-Host ".env not found. Runtime paths will use backend defaults." -ForegroundColor Yellow
}

Write-Host "Project root: $repoPath" -ForegroundColor Cyan

$backendCommand = @"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass;
Set-Location -LiteralPath '$repoPath';
. '$activatePath';
Write-Host 'Backend project root: $repoPath' -ForegroundColor Cyan;
Write-Host 'Backend venv:' `$env:VIRTUAL_ENV -ForegroundColor Green;
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
"@

$frontendCommand = @"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass;
Set-Location -LiteralPath '$repoPath';
. '$activatePath';
Write-Host 'Frontend project root: $repoPath' -ForegroundColor Cyan;
Write-Host 'Frontend launched with venv active:' `$env:VIRTUAL_ENV -ForegroundColor Green;
Set-Location -LiteralPath '$repoPath\frontend';
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand
Start-Sleep -Seconds 3

Start-Process "http://localhost:3000"
Write-Host "AnalyticsOS startup launched." -ForegroundColor Green
