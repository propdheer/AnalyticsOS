# Dashboard MVP

## Purpose

The Dashboard MVP provides a visible interface for the AnalyticsOS backend.

It currently shows:

- API version and environment
- Project count
- Dataset count
- Business Rule count
- Prompt Template count
- Memory count
- Recent Projects
- Known Datasets
- Business Rules
- Professional Memories

## Run Backend

From the repository root:

```powershell
.\scripts\run-backend.ps1
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Run Frontend

Open a second PowerShell window from the repository root:

```powershell
.\scripts\run-frontend.ps1
```

Frontend URL:

```text
http://localhost:3000
```

## First-Time Frontend Setup

```powershell
.\scripts\install-frontend-deps.ps1
```

## API Dependency

The frontend expects the backend at:

```text
http://127.0.0.1:8000
```

This can be overridden later with:

```text
NEXT_PUBLIC_ANALYTICSOS_API_URL
```

## Acceptance Criteria

The Dashboard MVP is accepted when:

- Backend tests pass.
- Backend starts successfully.
- Frontend starts successfully.
- Dashboard loads at `http://localhost:3000`.
- Dashboard displays live data from the backend.
- API docs link opens FastAPI docs.
