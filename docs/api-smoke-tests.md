# API Smoke Tests

After starting the backend:

```powershell
.\scripts\run-backend.ps1
```

Open these URLs:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/version
http://127.0.0.1:8000/api/v1/projects
http://127.0.0.1:8000/api/v1/datasets
http://127.0.0.1:8000/api/v1/business-rules
http://127.0.0.1:8000/api/v1/prompt-templates
http://127.0.0.1:8000/api/v1/memories
http://127.0.0.1:8000/docs
```

Expected behavior:

- `/health` returns healthy status.
- `/version` returns API version.
- Core API routes return JSON arrays.
- API docs are visible through Swagger UI.
- POST routes create or update records.
- DELETE routes remove records.

## Dashboard Smoke Test

Start the frontend:

```powershell
.\scripts\run-frontend.ps1
```

Open:

```text
http://localhost:3000
```
