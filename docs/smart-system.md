# Smart System

AnalyticsOS `v0.3.2-alpha` adds action run history and the ability to save generated outputs as Knowledge Assets.

## Current Loop

1. Add project or dataset context.
2. Run a predefined action.
3. Generate a prompt or Ollama output.
4. Save the run to history.
5. Save the output as a Knowledge Asset.
6. Search it later.

## Action History

Action runs are stored locally in:

```text
data/action_runs.json
```

## Save as Knowledge

Saved action outputs are written as Markdown under:

```text
knowledge/action-outputs/
```
