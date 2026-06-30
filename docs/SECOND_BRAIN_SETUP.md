# AnalyticsOS Second Brain Setup

AnalyticsOS now runs from:

```text
Desktop/Second Brain/AnalyticsOS
```

The runtime folders are:

```text
Desktop/Second Brain/Data
Desktop/Second Brain/Knowledge
```

## Daily Start

```powershell
cd "C:\Users\Dheer.Madhusudan\OneDrive - Sundrop Brands Limited\Desktop\Second Brain\AnalyticsOS"
.\.venv\Scripts\Activate.ps1
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\verify-second-brain.ps1
.\scripts\start-analyticsos.ps1
```

## Validation

```powershell
.\scripts\test-v052.ps1
```

## Runtime Endpoint

```text
http://127.0.0.1:8000/api/v1/runtime/status
```
