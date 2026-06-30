# System Context

AnalyticsOS sits between a professional user and the tools/files they use every day.

## External Systems

Initial external systems include:

- Local filesystem
- Ollama
- PostgreSQL
- AnythingLLM
- OpenMemory
- Browser-based AI tools
- Power BI files
- Excel files
- SQL scripts

## User Boundary

AnalyticsOS should not silently learn sensitive knowledge. Important memory writes should be human-reviewed.

## Platform Boundary

AnalyticsOS Core owns:

- Domain models
- API contracts
- Plugin contracts
- Dashboard experience

External tools provide capabilities but should remain replaceable.
