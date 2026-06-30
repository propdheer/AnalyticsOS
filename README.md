# AnalyticsOS

**Build Once. Learn Forever.**

AnalyticsOS is a local-first Professional Intelligence Platform for professional memory, project knowledge, local search, and AI-assisted analytical workflows.

## Current Status

| Field | Value |
|---|---|
| Version | `v0.2.0-alpha` |
| Milestone | First Usable Local Product |
| Status | MVP closure candidate |

## Current Capabilities

AnalyticsOS currently supports:

- Dashboard-based object management
- Projects
- Datasets
- Business Rules
- Prompt Templates
- Memories
- Knowledge Assets
- Local markdown/text knowledge discovery
- Global search
- Backup export/import

## Run Backend

```powershell
.\scripts\run-backend.ps1
```

## Run Frontend

```powershell
.\scripts\run-frontend.ps1
```

Open:

```text
http://localhost:3000
```

## Validate MVP

```powershell
.\scripts\test-backend.ps1
```

With backend running:

```powershell
.\scripts\run-smoke-test.ps1
```

See:

```text
docs/mvp-closure-checklist.md
```
