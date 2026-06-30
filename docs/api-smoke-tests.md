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
```

Expected behavior:

- `/health` returns healthy status.
- `/version` returns API version.
- Core API routes return JSON arrays.
- POST routes create or update records.
- DELETE routes remove records.

## Data Storage

During this MVP phase, records are stored locally as JSON files in:

```text
data/
```

This is intentionally simple. PostgreSQL will replace this persistence layer in a later release without changing the API contract.
