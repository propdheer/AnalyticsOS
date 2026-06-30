# AnalyticsOS

**Build Once. Learn Forever.**

AnalyticsOS is a local-first Professional Intelligence Platform for knowledge workers, analysts, data scientists, consultants, and builders who want their professional knowledge to compound over time.

It is not a chatbot. It is an operating system for professional memory, project knowledge, analytical work, and AI-powered execution.

## Current Status

| Field | Value |
|---|---|
| Version | `v0.0.3-alpha` |
| Sprint | Sprint 0 |
| Milestone | Repository Foundation Patch |
| Status | In development |

## Development Quick Start

```powershell
cd "C:\Users\Dheer.Madhusudan\OneDrive - Sundrop Brands Limited\Desktop\AnalyticsOS"
.\.venv\Scripts\Activate.ps1
python --version
```

Install dependencies:

```powershell
.\scripts\install-python-deps.ps1
```

Run backend:

```powershell
.\scripts\run-backend.ps1
```

Run tests:

```powershell
.\scripts\test-backend.ps1
```

## Backend Endpoints

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/health
http://127.0.0.1:8000/version
```

## Repository Layout

```text
backend/             FastAPI backend
frontend/            Next.js dashboard
plugins/             Optional capability plugins
browser-extension/   Future browser capture layer
database/            Database migrations and schemas
docker/              Docker support files
handbook/            Engineering handbook
docs/                Documentation website source
adr/                 Architecture decision records
rfc/                 Request for comments documents
templates/           Reusable documentation templates
scripts/             Developer automation scripts
```

## License

This project currently uses the MIT License.
