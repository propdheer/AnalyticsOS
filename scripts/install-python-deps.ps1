Set-Location $PSScriptRoot\..

if (-not (Test-Path ".\.venv\Scripts\Activate.ps1")) {
    Write-Host "Virtual environment not found. Creating .venv..." -ForegroundColor Yellow
    python -m venv .venv
}

. .\.venv\Scripts\Activate.ps1

python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements\base.txt
python -m pip install -r requirements\test.txt
python -m pip install -r requirements\dev.txt

Write-Host "Python dependencies installed." -ForegroundColor Green
