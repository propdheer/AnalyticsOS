# AnalyticsOS

**Build Once. Learn Forever.**

AnalyticsOS is a local-first Professional Intelligence Platform for knowledge workers, analysts, data scientists, consultants, and builders who want their professional knowledge to compound over time.

It is not a chatbot. It is an operating system for professional memory, project knowledge, analytical work, and AI-powered execution.

## Current Status

| Field | Value |
|---|---|
| Version | `v0.0.2-alpha` |
| Sprint | Sprint 0 |
| Milestone | Repository Foundation |
| Status | In development |

## Core Philosophy

AnalyticsOS is built on four non-negotiable principles:

1. **Local-first** — professional knowledge should remain under user control.
2. **Knowledge compounds** — the platform becomes more valuable the longer it is used.
3. **Human-in-the-loop** — AI suggests, humans decide.
4. **Plugin-first** — every capability should be modular and replaceable.

## Initial Architecture

```text
AnalyticsOS Dashboard
        |
        v
AnalyticsOS API
        |
        +-- Knowledge Engine
        +-- Memory Engine
        +-- Search Engine
        +-- Automation Engine
        |
        v
Local Infrastructure
        |
        +-- Ollama
        +-- PostgreSQL
        +-- AnythingLLM
        +-- OpenMemory
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

## Development Quick Start

```powershell
cd "C:\Users\Dheer.Madhusudan\OneDrive - Sundrop Brands Limited\Desktop\AnalyticsOS"
.\.venv\Scripts\Activate.ps1
python --version
```

## Backend Health Check

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/health
```

## Documentation

The handbook begins in:

```text
handbook/
```

The documentation website scaffold is configured through:

```text
mkdocs.yml
```

## License

This project currently uses the MIT License.
