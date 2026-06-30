# MVP Closure Checklist

## Goal

Declare AnalyticsOS `v0.2.0-alpha` as the first usable local product.

## Required Checks

### Backend

```powershell
.\scripts\test-backend.ps1
```

Expected: all tests pass.

### API Smoke Test

Start backend, then run:

```powershell
.\scripts\run-smoke-test.ps1
```

### Frontend

Start backend:

```powershell
.\scripts\run-backend.ps1
```

Start frontend in another window:

```powershell
.\scripts\run-frontend.ps1
```

Open:

```text
http://localhost:3000
```

### Manual Product Test

1. Create a project.
2. Create a dataset.
3. Create a business rule.
4. Create a memory.
5. Search for one of those objects.
6. Export a backup from the Backup tab.
7. Refresh the page and confirm data persists.

## Acceptance

The MVP is accepted when all checks above pass.
