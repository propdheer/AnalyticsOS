"use client";

import { useEffect, useMemo, useState } from "react";
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
import { makeId, titleCase } from "@/lib/format";

type ResourceTab =
  | "projects"
  | "datasets"
  | "businessRules"
  | "promptTemplates"
  | "memories"
  | "knowledgeAssets";

type Props = {
  kind: ResourceTab;
  projects: Project[];
  datasets: Dataset[];
  businessRules: BusinessRule[];
  promptTemplates: PromptTemplate[];
  memories: Memory[];
  knowledgeAssets: KnowledgeAsset[];
  onRefresh: () => Promise<void>;
};

const resourceMap: Record<ResourceTab, ResourceName> = {
  projects: "projects",
  datasets: "datasets",
  businessRules: "business-rules",
  promptTemplates: "prompt-templates",
  memories: "memories",
  knowledgeAssets: "knowledge-assets",
};

const labelMap: Record<ResourceTab, string> = {
  projects: "Projects",
  datasets: "Datasets",
  businessRules: "Business Rules",
  promptTemplates: "Prompt Templates",
  memories: "Memories",
  knowledgeAssets: "Knowledge Assets",
};

const prefixMap: Record<ResourceTab, string> = {
  projects: "project",
  datasets: "dataset",
  businessRules: "rule",
  promptTemplates: "prompt",
  memories: "memory",
  knowledgeAssets: "knowledge",
};

export function ResourceManager({
  kind,
  projects,
  datasets,
  businessRules,
  promptTemplates,
  memories,
  knowledgeAssets,
  onRefresh,
}: Props) {
  const [message, setMessage] = useState("");
  const [generatedId, setGeneratedId] = useState(makeId(prefixMap[kind]));

  useEffect(() => {
    setGeneratedId(makeId(prefixMap[kind]));
  }, [kind]);

  const items = useMemo(() => {
    if (kind === "projects") return projects;
    if (kind === "datasets") return datasets;
    if (kind === "businessRules") return businessRules;
    if (kind === "promptTemplates") return promptTemplates;
    if (kind === "memories") return memories;
    return knowledgeAssets;
  }, [kind, projects, datasets, businessRules, promptTemplates, memories, knowledgeAssets]);

  const objectItems = items.map((item: any) => ({
    id: item.id,
    title: item.name ?? item.title,
    description: item.description ?? item.definition ?? item.content ?? item.summary ?? "",
    meta: buildMeta(kind, item),
    badge: item.tags?.join(", "),
  }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = buildPayload(kind, form, generatedId);

    try {
      await createResource(resourceMap[kind], payload);
      formElement.reset();
      setGeneratedId(makeId(prefixMap[kind]));
      await onRefresh();
      setMessage(`${labelMap[kind].slice(0, -1)} saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save.");
    }
  }

  async function handleDelete(id: string) {
    setMessage("");
    try {
      await deleteResource(resourceMap[kind], id);
      await onRefresh();
      setMessage("Deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title={`Create ${labelMap[kind].slice(0, -1)}`} description={`Generated ID: ${generatedId}`} className="span-5">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>ID</label>
            <div className="inline-field">
              <input name="id" value={generatedId} onChange={(event) => setGeneratedId(event.target.value)} />
              <button className="button" type="button" onClick={() => setGeneratedId(makeId(prefixMap[kind]))}>New ID</button>
            </div>
          </div>
          {renderFields(kind)}
          <div className="toolbar">
            <button className="button" type="submit">Save</button>
            {message ? <span className={message.includes("Could not") || message.includes("Request failed") ? "error" : "success"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>

      <DashboardCard title={labelMap[kind]} count={items.length} className="span-7">
        <ObjectList
          emptyText={`No ${labelMap[kind].toLowerCase()} yet.`}
          items={objectItems}
          onDelete={(id) => void handleDelete(id)}
        />
      </DashboardCard>
    </section>
  );
}

function renderFields(kind: ResourceTab) {
  if (kind === "projects") {
    return (
      <>
        <Field name="name" label="Name" />
        <TextArea name="description" label="Description" />
        <Field name="status" label="Status" defaultValue="Active" />
        <Field name="function" label="Function" defaultValue="Analytics" />
        <Field name="owner" label="Owner" defaultValue="Analytics Team" />
      </>
    );
  }

  if (kind === "datasets") {
    return (
      <>
        <Field name="name" label="Name" />
        <TextArea name="description" label="Description" />
        <Field name="dataset_type" label="Dataset Type" defaultValue="Table" />
        <Field name="source_system" label="Source System" defaultValue="Oracle ERP" />
        <Field name="owner" label="Owner" defaultValue="Analytics Team" />
      </>
    );
  }

  if (kind === "businessRules") {
    return (
      <>
        <Field name="name" label="Name" />
        <TextArea name="definition" label="Definition" />
        <Field name="domain" label="Domain" defaultValue="Sales" />
        <Field name="status" label="Status" defaultValue="Active" />
        <Field name="owner" label="Owner" defaultValue="Analytics Team" />
        <Field name="source" label="Source" defaultValue="Business Sign-off" />
      </>
    );
  }

  if (kind === "promptTemplates") {
    return (
      <>
        <Field name="name" label="Name" />
        <TextArea name="description" label="Description" />
        <Field name="template_type" label="Template Type" defaultValue="Prompt" />
        <TextArea name="template" label="Template" placeholder="Use {{context}}, {{audience}}, {{tone}}, and {{additional_context}}" />
        <Field name="target_tool" label="Target Tool" defaultValue="Ollama" />
      </>
    );
  }

  if (kind === "memories") {
    return (
      <>
        <Field name="title" label="Title" />
        <TextArea name="content" label="Content" />
        <Field name="memory_type" label="Memory Type" defaultValue="Context" />
        <Field name="source" label="Source" defaultValue="Manual" />
        <div className="form-field">
          <label>Approved</label>
          <select name="approved" defaultValue="true">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </>
    );
  }

  return (
    <>
      <Field name="title" label="Title" />
      <Field name="path" label="Path" />
      <Field name="asset_type" label="Asset Type" defaultValue="Markdown" />
      <TextArea name="summary" label="Summary" />
      <Field name="tags" label="Tags" placeholder="comma,separated,tags" />
    </>
  );
}

function Field({ name, label, defaultValue = "", placeholder = "" }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}

function TextArea({ name, label, placeholder = "" }: { name: string; label: string; placeholder?: string }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <textarea name={name} placeholder={placeholder} />
    </div>
  );
}

function buildPayload(kind: ResourceTab, form: FormData, id: string): any {
  if (kind === "projects") {
    return {
      id,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      status: String(form.get("status") ?? "Active"),
      function: String(form.get("function") ?? "Analytics"),
      owner: String(form.get("owner") ?? "Analytics Team"),
    };
  }

  if (kind === "datasets") {
    return {
      id,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      dataset_type: String(form.get("dataset_type") ?? "Table"),
      source_system: String(form.get("source_system") ?? "Oracle ERP"),
      owner: String(form.get("owner") ?? "Analytics Team"),
    };
  }

  if (kind === "businessRules") {
    return {
      id,
      name: String(form.get("name") ?? ""),
      definition: String(form.get("definition") ?? ""),
      domain: String(form.get("domain") ?? "Sales"),
      status: String(form.get("status") ?? "Active"),
      owner: String(form.get("owner") ?? "Analytics Team"),
      source: String(form.get("source") ?? "Business Sign-off"),
    };
  }

  if (kind === "promptTemplates") {
    return {
      id,
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      template_type: String(form.get("template_type") ?? "Prompt"),
      template: String(form.get("template") ?? ""),
      target_tool: String(form.get("target_tool") ?? "Ollama"),
    };
  }

  if (kind === "memories") {
    return {
      id,
      title: String(form.get("title") ?? ""),
      content: String(form.get("content") ?? ""),
      memory_type: String(form.get("memory_type") ?? "Context"),
      source: String(form.get("source") ?? "Manual"),
      approved: String(form.get("approved") ?? "true") === "true",
    };
  }

  return {
    id,
    title: String(form.get("title") ?? ""),
    path: String(form.get("path") ?? ""),
    asset_type: String(form.get("asset_type") ?? "Markdown"),
    summary: String(form.get("summary") ?? ""),
    tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
  };
}

function buildMeta(kind: ResourceTab, item: any): string {
  if (kind === "projects") return `${titleCase(item.status)} · ${titleCase(item.function)} · ${item.owner}`;
  if (kind === "datasets") return `${titleCase(item.dataset_type)} · ${item.source_system} · ${item.owner}`;
  if (kind === "businessRules") return `${titleCase(item.status)} · ${titleCase(item.domain)} · ${item.owner}`;
  if (kind === "promptTemplates") return `${titleCase(item.template_type)} · ${item.target_tool}`;
  if (kind === "memories") return `${titleCase(item.memory_type)} · ${item.source} · ${item.approved ? "Approved" : "Not Approved"}`;
  return `${titleCase(item.asset_type)} · ${item.path}`;
}
