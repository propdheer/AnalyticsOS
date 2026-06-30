# ADR-004: API-first Backend

## Status

Accepted

## Context

AnalyticsOS will eventually support a dashboard, browser extension, plugins, automation tools, and possibly other clients.

## Decision

AnalyticsOS will expose functionality through a FastAPI backend before tightly coupling behavior to any single interface.

## Consequences

- Dashboard development becomes simpler.
- Plugins can integrate through stable contracts.
- Testing becomes easier.
- API versioning must be maintained.
