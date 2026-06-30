# AnalyticsOS

**Build Once. Learn Forever.**

AnalyticsOS is a local-first Professional Intelligence Platform for professional memory, project knowledge, local search, RAG, and AI-assisted analytical workflows.

## Current Status

| Field | Value |
|---|---|
| Version | `v0.5.0-alpha` |
| Milestone | Durable Platform Foundation |
| Status | Hardening release |

## Runtime Path Choice

AnalyticsOS does **not** force one storage location.

Each machine can choose its own runtime location:

```text
Office laptop   -> OneDrive runtime folder
Personal laptop -> LocalAppData runtime folder
```

Configure this by running:

```powershell
.\scripts\configure-runtime-paths.ps1
```

This writes:

```text
ANALYTICSOS_DATA_DIR=...
ANALYTICSOS_KNOWLEDGE_DIR=...
```

to `.env`.

If no paths are configured, AnalyticsOS uses the earlier repo-relative defaults:

```text
../data
../knowledge
```

## Run Backend

```powershell
.\scripts\run-backend.ps1
```

## Run Frontend

```powershell
.\scripts\run-frontend.ps1
```

## One-Command Startup

```powershell
.\scripts\start-analyticsos.ps1
```

## Validate

```powershell
.\scripts\test-backend.ps1
```

With backend running:

```powershell
.\scripts\run-smoke-test.ps1
```
