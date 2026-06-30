# Action Builder

AnalyticsOS `v0.4.0-alpha` adds a UI to create custom actions.

## Supported Variables

Use these in prompt templates:

```text
{{audience}}
{{tone}}
{{project_context}}
{{dataset_context}}
{{additional_context}}
```

## Example Action

```text
ID: monthly-adoption-update
Name: Monthly Adoption Update
Category: update
Output Type: markdown
Prompt Template:
Create a monthly adoption update for this analytics initiative.

Audience: {{audience}}
Tone: {{tone}}

Project:
{{project_context}}

Additional context:
{{additional_context}}

Include adoption, blockers, decisions needed, and next steps.
```

After saving, go to the Actions tab and refresh the page.
