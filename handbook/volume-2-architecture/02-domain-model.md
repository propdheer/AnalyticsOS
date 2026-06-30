# Domain Model

AnalyticsOS starts with a small set of canonical objects.

## Core Objects

### Project

A structured representation of a professional initiative.

### Dataset

A structured representation of a dataset, table, file, or source system artifact.

### Business Rule

A reusable business definition or interpretation.

### Decision

A record of an important project or architecture decision.

### Prompt Template

A reusable instruction pattern for AI tools.

### Knowledge Asset

A file or artifact that contains useful professional knowledge.

## Relationship Examples

```text
Project uses Dataset
Dataset has Business Rule
Project has Decision
Prompt Template supports Project
Knowledge Asset describes Dataset
```

The system starts with Projects and Datasets in API form. Other objects will be added in later releases.
