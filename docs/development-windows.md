# Windows Development Setup

## Daily Startup

Open PowerShell and run:

```powershell
cd "C:\Users\Dheer.Madhusudan\OneDrive - Sundrop Brands Limited\Desktop\AnalyticsOS"
.\.venv\Scripts\Activate.ps1
code .
```

## Install Python Dependencies

```powershell
.\scripts\install-python-deps.ps1
```

## Run Backend

```powershell
.\scripts\run-backend.ps1
```

Health check:

```text
http://127.0.0.1:8000/health
```

Version check:

```text
http://127.0.0.1:8000/version
```

## Run Backend Tests

```powershell
.\scripts\test-backend.ps1
```

## Notes

- The `.venv` folder is local and must never be committed.
- Install dependencies only while the virtual environment is active.
- Use scripts wherever possible to keep setup reproducible.
