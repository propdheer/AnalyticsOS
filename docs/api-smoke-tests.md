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
```

Expected behavior:

- `/health` returns healthy status.
- `/version` returns API version.
- `/api/v1/projects` returns sample project records.
- `/api/v1/datasets` returns sample dataset records.
