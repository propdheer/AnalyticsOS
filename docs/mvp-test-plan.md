# MVP Test Plan

## Objective

Validate that AnalyticsOS has a working local backend foundation with persistent core objects.

## Test Areas

### 1. Health and Version

- `/health`
- `/version`

### 2. Core Object APIs

- Projects
- Datasets
- Business Rules
- Prompt Templates
- Memories

### 3. Persistence

Create a record, restart the backend, and verify the record still exists.

### 4. Reset

Run:

```powershell
.\scripts\reset-local-data.ps1
```

Then restart the backend and verify seed records are recreated.

## Acceptance Criteria

The MVP backend foundation is accepted when:

- All tests pass.
- Health endpoint works.
- Version endpoint shows `0.1.0-alpha`.
- All core object list endpoints work.
- At least one POST and GET flow is manually verified.
- Data persists in local JSON files.
