"use client";

import { useMemo, useState } from "react";
import {
  BusinessRule,
  Dataset,
  KnowledgeAsset,
  Memory,
  Project,
  PromptTemplate,
  ResourceName,
  createResource,
  deleteResource,
} from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";

type ResourceKind =
  | "projects"
  | "datasets"
  | "businessRules"
  | "promptTemplates"
  | "memories"
  | "knowledgeAssets";

type ResourceManagerProps = {
  kind: ResourceKind;
  projects: Project[];
  datasets: Dataset[];
  businessRules: BusinessRule[];
  promptTemplates: PromptTemplate[];
  memories: Memory[];
  knowledgeAssets: KnowledgeAsset[];
  onRefresh: () => Promise<void>;
};

const resourceMap: Record<ResourceKind, ResourceName> = {
  projects: "projects",
  datasets: "datasets",
  businessRules: "business-rules",
  promptTemplates: "prompt-templates",
  memories: "memories",
  knowledgeAssets: "knowledge-assets",
};

export function ResourceManager(props: ResourceManagerProps) {
  const { kind, onRefresh } = props;
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const resource = resourceMap[kind];

  const config = useMemo(() => getConfig(props), [props]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const id = String(form.get("id") ?? "").trim();

    setIsSaving(true);
    setMessage("");

    if (!id) {
      setMessage("ID is required.");
      setIsSaving(false);
      return;
    }

    try {
      await createResource(resource, buildPayload(kind, form));
      formElement.reset();
      await onRefresh();
      setMessage("Saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(`Delete ${id}?`)) return;

    try {
      await deleteResource(resource, id);
      await onRefresh();
      setMessage("Deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title={`Create ${config.singular}`} description={config.description} className="span-6">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <Field name="id" label="ID" placeholder="unique-kebab-case-id" />
            {kind === "memories" ? (
              <Field name="title" label="Title" placeholder="Short memory title" />
            ) : (
              <Field name="name" label="Name" placeholder="Display name" />
            )}
          </div>

          {renderFields(kind)}

          <div className="toolbar">
            <button className="button" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Save"}
            </button>
            {message ? <span className={message.includes("success") ? "success" : "error"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>

      <DashboardCard title={config.title} count={config.items.length} className="span-6">
        <ObjectList emptyText={`No ${config.title.toLowerCase()} found.`} items={config.items} onDelete={handleDelete} />
      </DashboardCard>
    </section>
  );
}

function getConfig(props: ResourceManagerProps) {
  if (props.kind === "projects") {
    return {
      title: "Projects",
      singular: "Project",
      description: "Track professional initiatives, analytics use cases, and delivery work.",
      items: props.projects.map((project) => ({
        id: project.id,
        title: project.name,
        description: project.description,
        meta: `${project.status} · ${project.function} · ${project.owner}`,
      })),
    };
  }

  if (props.kind === "datasets") {
    return {
      title: "Datasets",
      singular: "Dataset",
      description: "Document known files, tables, dashboards, and data assets.",
      items: props.datasets.map((dataset) => ({
        id: dataset.id,
        title: dataset.name,
        description: dataset.description,
        meta: `${dataset.dataset_type} · ${dataset.source_system} · ${dataset.owner}`,
      })),
    };
  }

  if (props.kind === "businessRules") {
    return {
      title: "Business Rules",
      singular: "Business Rule",
      description: "Save definitions and reusable business logic.",
      items: props.businessRules.map((rule) => ({
        id: rule.id,
        title: rule.name,
        description: rule.definition,
        meta: `${rule.status} · ${rule.domain} · ${rule.owner}`,
      })),
    };
  }

  if (props.kind === "promptTemplates") {
    return {
      title: "Prompt Templates",
      singular: "Prompt Template",
      description: "Reusable prompts for Claude, NotebookLM, and other tools.",
      items: props.promptTemplates.map((template) => ({
        id: template.id,
        title: template.name,
        description: template.description,
        meta: `${template.template_type} · ${template.target_tool}`,
      })),
    };
  }

  if (props.kind === "knowledgeAssets") {
    return {
      title: "Knowledge Assets",
      singular: "Knowledge Asset",
      description: "Register local markdown/text knowledge assets.",
      items: props.knowledgeAssets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        description: asset.summary,
        meta: `${asset.asset_type} · ${asset.path}`,
        badge: asset.tags.join(", "),
      })),
    };
  }

  return {
    title: "Memories",
    singular: "Memory",
    description: "Approved professional context and durable lessons.",
    items: props.memories.map((memory) => ({
      id: memory.id,
      title: memory.title,
      description: memory.content,
      meta: `${memory.memory_type} · approved: ${memory.approved}`,
    })),
  };
}

function buildPayload(kind: ResourceKind, form: FormData) {
  const base = {
    id: String(form.get("id") ?? ""),
  };

  if (kind === "projects") {
    return {
      ...base,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      status: String(form.get("status") ?? "active"),
      function: String(form.get("function") ?? ""),
      owner: String(form.get("owner") ?? ""),
    };
  }

  if (kind === "datasets") {
    return {
      ...base,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      dataset_type: String(form.get("dataset_type") ?? "unknown"),
      source_system: String(form.get("source_system") ?? ""),
      owner: String(form.get("owner") ?? ""),
    };
  }

  if (kind === "businessRules") {
    return {
      ...base,
      name: String(form.get("name") ?? ""),
      definition: String(form.get("definition") ?? ""),
      domain: String(form.get("domain") ?? ""),
      status: String(form.get("status") ?? "draft"),
      owner: String(form.get("owner") ?? ""),
      source: String(form.get("source") ?? ""),
    };
  }

  if (kind === "promptTemplates") {
    return {
      ...base,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      template_type: String(form.get("template_type") ?? "general"),
      template: String(form.get("template") ?? ""),
      target_tool: String(form.get("target_tool") ?? ""),
    };
  }

  if (kind === "knowledgeAssets") {
    return {
      ...base,
      title: String(form.get("name") ?? ""),
      path: String(form.get("path") ?? ""),
      asset_type: String(form.get("asset_type") ?? "markdown"),
      summary: String(form.get("summary") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  }

  return {
    ...base,
    title: String(form.get("title") ?? ""),
    content: String(form.get("content") ?? ""),
    memory_type: String(form.get("memory_type") ?? "context"),
    source: String(form.get("source") ?? ""),
    approved: form.get("approved") === "on",
  };
}

function renderFields(kind: ResourceKind) {
  if (kind === "projects") {
    return (
      <>
        <TextArea name="description" label="Description" placeholder="What is this project about?" />
        <div className="form-grid">
          <Select name="status" label="Status" options={["active", "planned", "paused", "completed"]} />
          <Field name="function" label="Function" placeholder="Sales, Finance, Supply Chain..." />
          <Field name="owner" label="Owner" placeholder="Owner name" />
        </div>
      </>
    );
  }

  if (kind === "datasets") {
    return (
      <>
        <TextArea name="description" label="Description" placeholder="What does this dataset contain?" />
        <div className="form-grid">
          <Select name="dataset_type" label="Dataset Type" options={["table", "file", "dashboard", "notebook", "unknown"]} />
          <Field name="source_system" label="Source System" placeholder="Oracle, Excel, Power BI..." />
          <Field name="owner" label="Owner" placeholder="Owner name" />
        </div>
      </>
    );
  }

  if (kind === "businessRules") {
    return (
      <>
        <TextArea name="definition" label="Definition" placeholder="Write the business rule clearly." />
        <div className="form-grid">
          <Field name="domain" label="Domain" placeholder="Sales, Finance, Supply Chain..." />
          <Select name="status" label="Status" options={["draft", "active", "deprecated"]} />
          <Field name="owner" label="Owner" placeholder="Owner name" />
          <Field name="source" label="Source" placeholder="Where did this come from?" />
        </div>
      </>
    );
  }

  if (kind === "promptTemplates") {
    return (
      <>
        <TextArea name="description" label="Description" placeholder="What is this prompt for?" />
        <TextArea name="template" label="Prompt Template" placeholder="Use {{context}} where project context should go." />
        <div className="form-grid">
          <Select name="template_type" label="Template Type" options={["analysis", "documentation", "slide_brief", "code", "general"]} />
          <Field name="target_tool" label="Target Tool" placeholder="Claude, NotebookLM, ChatGPT..." />
        </div>
      </>
    );
  }

  if (kind === "knowledgeAssets") {
    return (
      <>
        <TextArea name="summary" label="Summary" placeholder="What does this asset contain?" />
        <div className="form-grid">
          <Field name="path" label="Path" placeholder="../knowledge/welcome.md" />
          <Select name="asset_type" label="Asset Type" options={["markdown", "txt", "pdf", "spreadsheet", "other"]} />
          <Field name="tags" label="Tags" placeholder="comma,separated,tags" />
        </div>
      </>
    );
  }

  return (
    <>
      <TextArea name="content" label="Content" placeholder="What should AnalyticsOS remember?" />
      <div className="form-grid">
        <Select name="memory_type" label="Memory Type" options={["preference", "decision", "lesson", "context"]} />
        <Field name="source" label="Source" placeholder="Where did this memory come from?" />
        <div className="form-field">
          <label htmlFor="approved">Approved</label>
          <input id="approved" name="approved" type="checkbox" />
        </div>
      </div>
    </>
  );
}

function Field({ name, label, placeholder, type = "text" }: { name: string; label: string; placeholder?: string; type?: string }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} placeholder={placeholder} type={type} />
    </div>
  );
}

function TextArea({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} placeholder={placeholder} />
    </div>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
