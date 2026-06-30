# ADR-003: Plugin-first Architecture

## Status

Accepted

## Context

AnalyticsOS needs to support capabilities such as SQL, Excel, Power BI, presentations, browser capture, and AI tool export.

## Decision

Capabilities will be added as plugins wherever practical.

## Consequences

- Core remains smaller and more stable.
- New functionality can be added without rewriting the platform.
