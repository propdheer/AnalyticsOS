# AnalyticsOS

**Build Once. Learn Forever.**

AnalyticsOS is a local-first Professional Intelligence Platform for knowledge workers, analysts, data scientists, consultants, and builders who want their professional knowledge to compound over time.

It is not a chatbot. It is an operating system for professional memory, project knowledge, analytical work, and AI-powered execution.

## Current Status

| Field | Value |
|---|---|
| Version | `v0.1.1-alpha` |
| Sprint | MVP Dashboard |
| Milestone | Visible Dashboard MVP |
| Status | In development |

## Current Capabilities

AnalyticsOS currently supports local API-based management of:

- Projects
- Datasets
- Business Rules
- Prompt Templates
- Memories

The Dashboard MVP displays this backend data in a visible Next.js interface.

## Development Quick Start

```powershell
cd "C:\Users\Dheer.Madhusudan\OneDrive - Sundrop Brands Limited\Desktop\AnalyticsOS"
.\.venv\Scripts\Activate.ps1
```

Run backend tests:

```powershell
.\scripts\test-backend.ps1
```

Run backend:

```powershell
.\scripts\run-backend.ps1
```

In a second PowerShell window, run frontend:

```powershell
.\scripts\run-frontend.ps1
```

Open:

```text
http://localhost:3000
```

## Backend Endpoints

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/health
http://127.0.0.1:8000/version
http://127.0.0.1:8000/api/v1/projects
http://127.0.0.1:8000/api/v1/datasets
http://127.0.0.1:8000/api/v1/business-rules
http://127.0.0.1:8000/api/v1/prompt-templates
http://127.0.0.1:8000/api/v1/memories
http://127.0.0.1:8000/docs
```

## Frontend

```text
http://localhost:3000
```

## Product Foundation

Core documents:

- `FOUNDING.md`
- `PRODUCT_SPECIFICATION.md`
- `ARCHITECTURE.md`
- `handbook/volume-1-product/`
- `handbook/volume-2-architecture/`

## License

This project currently uses the MIT License.
