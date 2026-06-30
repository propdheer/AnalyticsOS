# API Smoke Tests

After starting the backend:

```powershell
.\scripts\run-backend.ps1
```

Open:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/version
http://127.0.0.1:8000/api/v1/app/config
http://127.0.0.1:8000/api/v1/projects
http://127.0.0.1:8000/api/v1/datasets
http://127.0.0.1:8000/api/v1/business-rules
http://127.0.0.1:8000/api/v1/prompt-templates
http://127.0.0.1:8000/api/v1/memories
http://127.0.0.1:8000/api/v1/knowledge-assets
http://127.0.0.1:8000/api/v1/actions
http://127.0.0.1:8000/api/v1/ai/status
http://127.0.0.1:8000/api/v1/integrations/status
http://127.0.0.1:8000/api/v1/search?q=AnalyticsOS
http://127.0.0.1:8000/api/v1/backup/export
http://127.0.0.1:8000/docs
```
