# API Principles

## API-First

AnalyticsOS should expose stable APIs before building complex UI behavior.

## Consistent Response Shapes

Responses should be predictable and easy to consume from the dashboard.

## Versioned APIs

Initial endpoints live under:

```text
/api/v1
```

## Local Development

All local endpoints should work without external cloud credentials.

## Initial Endpoints

```text
GET /health
GET /version
GET /api/v1/projects
POST /api/v1/projects
GET /api/v1/datasets
POST /api/v1/datasets
```
