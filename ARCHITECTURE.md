# AnalyticsOS Architecture

## Document Metadata

| Field | Value |
|---|---|
| Document ID | ARCH-001 |
| Version | 0.0.7-alpha |
| Status | Draft |
| Last Updated | 2026-06-30 |

## Executive Summary

AnalyticsOS is designed as a modular, local-first platform with a dashboard-first user experience and an API-first backend.

The architecture is organized around five pillars:

1. Knowledge
2. Memory
3. Execution
4. Intelligence
5. Experience

## High-Level Architecture

```text
Experience Layer
  - Dashboard
  - Browser Extension
  - Documentation Website

API Layer
  - FastAPI Backend
  - REST APIs
  - Future plugin contracts

Domain Layer
  - Projects
  - Datasets
  - Business Rules
  - Decisions
  - Prompt Templates

Infrastructure Layer
  - PostgreSQL
  - Ollama
  - AnythingLLM
  - OpenMemory
  - Filesystem
```

## Core Dependency Rule

AnalyticsOS Core must never depend on specific plugins.

```text
Plugin -> Core Contracts
Core   -X-> Specific Plugin
```

This keeps the platform extensible.

## Initial Runtime Flow

```text
User opens dashboard
        |
        v
Dashboard calls AnalyticsOS API
        |
        v
API retrieves projects, datasets, memories, and capabilities
        |
        v
Response is shown in dashboard
```

## Local-First Architecture

AnalyticsOS is designed so that local mode remains excellent. Cloud services may be added later, but they must be optional.
