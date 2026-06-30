# Architecture Overview

## System Layers

```text
Experience Layer
    Dashboard, browser extension, documentation

API Layer
    FastAPI backend

Capability Layer
    Knowledge, memory, automation, search

Infrastructure Layer
    PostgreSQL, Ollama, AnythingLLM, OpenMemory
```

## Dependency Rule

AnalyticsOS Core must not depend on plugins.

Plugins depend on core contracts. Core remains generic.
