# AnalyticsOS

**Build Once. Learn Forever.**

## Current Status

| Field | Value |
|---|---|
| Version | `v0.5.1-alpha` |
| Milestone | Final Recovery Build — UI Rework and Ollama Chat |
| Status | Recovery-tested patch folder |

## v0.5.1 Highlights

- Chat with Ollama is the default landing page.
- Chat can include AnalyticsOS knowledge context.
- Sidebar is simpler, narrower, and grouped.
- Sidebar groups can expand/collapse.
- Every page shows a unique page ID.
- Object creation pages include generated IDs.
- UI capitalization is normalized.
- Action templates support `{{context}}`, `{{Context}}`, and `{{additional_context}}`.

## Run

```powershell
.\scripts\test-backend.ps1
.\scripts\start-analyticsos.ps1
```
