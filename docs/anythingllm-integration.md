# AnythingLLM Integration

AnalyticsOS `v0.4.0-alpha` adds an AnythingLLM query layer.

## Configuration

Add these values to `.env`:

```text
ANALYTICSOS_ANYTHINGLLM_BASE_URL=http://127.0.0.1:3001
ANALYTICSOS_ANYTHINGLLM_API_KEY=your_api_key_here
ANALYTICSOS_ANYTHINGLLM_WORKSPACE_SLUG=your_workspace_slug
```

## Endpoints

```text
GET  /api/v1/rag/status
POST /api/v1/rag/query
POST /api/v1/rag/save-answer
```

## UI

Use the tab:

```text
Ask Knowledge Base
```

## Notes

AnythingLLM exposes a Developer API from the app's Developer/API area. AnalyticsOS uses the workspace chat endpoint pattern:

```text
/api/v1/workspace/{workspace_slug}/chat
```

The UI supports both `query` and `chat` mode.
