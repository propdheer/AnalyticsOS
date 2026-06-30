"use client";

import { useState } from "react";
import { createAction } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function ActionBuilderPanel() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const id = String(form.get("id") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    const promptTemplate = String(form.get("prompt_template") ?? "").trim();

    if (!id || !name || !promptTemplate) {
      setMessage("ID, name, and prompt template are required.");
      return;
    }

    try {
      await createAction({
        id,
        name,
        description: String(form.get("description") ?? ""),
        category: String(form.get("category") ?? "documentation"),
        output_type: String(form.get("output_type") ?? "markdown"),
        prompt_template: promptTemplate,
        default_model: String(form.get("default_model") ?? ""),
      });
      formElement.reset();
      setMessage("Custom action saved. Go to Actions and refresh the page to run it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save action.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Custom Action Builder" description="Create your own reusable task/action that AnalyticsOS can run on project and dataset context." className="span-12">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>ID</label>
              <input name="id" placeholder="monthly-adoption-update" />
            </div>
            <div className="form-field">
              <label>Name</label>
              <input name="name" placeholder="Monthly Adoption Update" />
            </div>
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea name="description" placeholder="What should this action do?" />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Category</label>
              <select name="category">
                <option value="presentation">presentation</option>
                <option value="update">update</option>
                <option value="documentation">documentation</option>
                <option value="analysis">analysis</option>
                <option value="communication">communication</option>
                <option value="governance">governance</option>
              </select>
            </div>
            <div className="form-field">
              <label>Output Type</label>
              <select name="output_type">
                <option value="markdown">markdown</option>
                <option value="email">email</option>
                <option value="slide_brief">slide_brief</option>
                <option value="checklist">checklist</option>
                <option value="analysis_plan">analysis_plan</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Default Model</label>
            <input name="default_model" placeholder="Optional, e.g. llama3.1:8b" />
          </div>

          <div className="form-field">
            <label>Prompt Template</label>
            <textarea
              name="prompt_template"
              style={{ minHeight: "260px" }}
              placeholder={`Use variables like:
{{audience}}
{{tone}}
{{project_context}}
{{dataset_context}}
{{additional_context}}`}
            />
          </div>

          <div className="toolbar">
            <button className="button" type="submit">Save Custom Action</button>
            {message ? <span className={message.includes("required") || message.includes("Could not") ? "error" : "success"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>
    </section>
  );
}
