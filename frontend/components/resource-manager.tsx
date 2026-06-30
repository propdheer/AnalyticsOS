"use client";

import { useMemo, useState } from "react";
import { BusinessRule, Dataset, KnowledgeAsset, Memory, Project, PromptTemplate, ResourceName, createResource, deleteResource } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";

type ResourceKind = "projects" | "datasets" | "businessRules" | "promptTemplates" | "memories" | "knowledgeAssets";
type Props = { kind: ResourceKind; projects: Project[]; datasets: Dataset[]; businessRules: BusinessRule[]; promptTemplates: PromptTemplate[]; memories: Memory[]; knowledgeAssets: KnowledgeAsset[]; onRefresh: () => Promise<void> };

const resourceMap: Record<ResourceKind, ResourceName> = { projects: "projects", datasets: "datasets", businessRules: "business-rules", promptTemplates: "prompt-templates", memories: "memories", knowledgeAssets: "knowledge-assets" };

export function ResourceManager(props: Props) {
  const { kind, onRefresh } = props;
  const [message, setMessage] = useState("");
  const config = useMemo(() => getConfig(props), [props]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id") ?? "").trim();
    if (!id) return setMessage("ID is required.");
    try {
      await createResource(resourceMap[kind], buildPayload(kind, form));
      event.currentTarget.reset();
      await onRefresh();
      setMessage("Saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm(`Delete ${id}?`)) return;
    await deleteResource(resourceMap[kind], id);
    await onRefresh();
    setMessage("Deleted successfully.");
  }

  return (
    <section className="grid">
      <DashboardCard title={`Create ${config.singular}`} description={config.description} className="span-6">
        <form className="form" onSubmit={submit}>
          <div className="form-grid">
            <Field name="id" label="ID" placeholder="unique-kebab-case-id" />
            <Field name={kind === "memories" ? "title" : "name"} label={kind === "memories" ? "Title" : "Name"} placeholder="Display name" />
          </div>
          {fields(kind)}
          <div className="toolbar">
            <button className="button" type="submit">Save</button>
            {message ? <span className={message.includes("success") ? "success" : "error"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>
      <DashboardCard title={config.title} count={config.items.length} className="span-6">
        <ObjectList emptyText={`No ${config.title.toLowerCase()} found.`} items={config.items} onDelete={remove} />
      </DashboardCard>
    </section>
  );
}

function getConfig(props: Props) {
  const common = { description: "Create, review, and manage this AnalyticsOS object type." };
  if (props.kind === "projects") return { title: "Projects", singular: "Project", ...common, items: props.projects.map((x) => ({ id: x.id, title: x.name, description: x.description, meta: `${x.status} · ${x.function} · ${x.owner}` })) };
  if (props.kind === "datasets") return { title: "Datasets", singular: "Dataset", ...common, items: props.datasets.map((x) => ({ id: x.id, title: x.name, description: x.description, meta: `${x.dataset_type} · ${x.source_system} · ${x.owner}` })) };
  if (props.kind === "businessRules") return { title: "Business Rules", singular: "Business Rule", ...common, items: props.businessRules.map((x) => ({ id: x.id, title: x.name, description: x.definition, meta: `${x.status} · ${x.domain}` })) };
  if (props.kind === "promptTemplates") return { title: "Prompt Templates", singular: "Prompt Template", ...common, items: props.promptTemplates.map((x) => ({ id: x.id, title: x.name, description: x.description, meta: `${x.template_type} · ${x.target_tool}` })) };
  if (props.kind === "knowledgeAssets") return { title: "Knowledge Assets", singular: "Knowledge Asset", ...common, items: props.knowledgeAssets.map((x) => ({ id: x.id, title: x.title, description: x.summary, meta: x.path, badge: x.tags.join(", ") })) };
  return { title: "Memories", singular: "Memory", ...common, items: props.memories.map((x) => ({ id: x.id, title: x.title, description: x.content, meta: `${x.memory_type} · approved: ${x.approved}` })) };
}

function buildPayload(kind: ResourceKind, form: FormData) {
  const id = String(form.get("id") ?? "");
  if (kind === "projects") return { id, name: form.get("name"), description: form.get("description"), status: form.get("status") || "active", function: form.get("function"), owner: form.get("owner") };
  if (kind === "datasets") return { id, name: form.get("name"), description: form.get("description"), dataset_type: form.get("dataset_type") || "unknown", source_system: form.get("source_system"), owner: form.get("owner") };
  if (kind === "businessRules") return { id, name: form.get("name"), definition: form.get("definition"), domain: form.get("domain"), status: form.get("status") || "draft", owner: form.get("owner"), source: form.get("source") };
  if (kind === "promptTemplates") return { id, name: form.get("name"), description: form.get("description"), template_type: form.get("template_type") || "general", template: form.get("template"), target_tool: form.get("target_tool") };
  if (kind === "knowledgeAssets") return { id, title: form.get("name"), path: form.get("path"), asset_type: form.get("asset_type") || "markdown", summary: form.get("summary"), tags: String(form.get("tags") ?? "").split(",").map((x) => x.trim()).filter(Boolean) };
  return { id, title: form.get("title"), content: form.get("content"), memory_type: form.get("memory_type") || "context", source: form.get("source"), approved: form.get("approved") === "on" };
}

function fields(kind: ResourceKind) {
  if (kind === "projects") return <><TextArea name="description" label="Description" /><div className="form-grid"><Select name="status" label="Status" options={["active","planned","paused","completed"]}/><Field name="function" label="Function"/><Field name="owner" label="Owner"/></div></>;
  if (kind === "datasets") return <><TextArea name="description" label="Description" /><div className="form-grid"><Select name="dataset_type" label="Dataset Type" options={["table","file","dashboard","notebook","unknown"]}/><Field name="source_system" label="Source System"/><Field name="owner" label="Owner"/></div></>;
  if (kind === "businessRules") return <><TextArea name="definition" label="Definition" /><div className="form-grid"><Field name="domain" label="Domain"/><Select name="status" label="Status" options={["draft","active","deprecated"]}/><Field name="owner" label="Owner"/><Field name="source" label="Source"/></div></>;
  if (kind === "promptTemplates") return <><TextArea name="description" label="Description" /><TextArea name="template" label="Template" /><div className="form-grid"><Select name="template_type" label="Template Type" options={["analysis","documentation","slide_brief","code","general"]}/><Field name="target_tool" label="Target Tool"/></div></>;
  if (kind === "knowledgeAssets") return <><TextArea name="summary" label="Summary" /><div className="form-grid"><Field name="path" label="Path" placeholder="../knowledge/welcome.md"/><Select name="asset_type" label="Asset Type" options={["markdown","txt","pdf","spreadsheet","other"]}/><Field name="tags" label="Tags" placeholder="comma,separated,tags"/></div></>;
  return <><TextArea name="content" label="Content" /><div className="form-grid"><Select name="memory_type" label="Memory Type" options={["preference","decision","lesson","context"]}/><Field name="source" label="Source"/><div className="form-field"><label htmlFor="approved">Approved</label><input id="approved" name="approved" type="checkbox"/></div></div></>;
}

function Field({ name, label, placeholder = "" }: { name: string; label: string; placeholder?: string }) { return <div className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} placeholder={placeholder}/></div>; }
function TextArea({ name, label }: { name: string; label: string }) { return <div className="form-field"><label htmlFor={name}>{label}</label><textarea id={name} name={name}/></div>; }
function Select({ name, label, options }: { name: string; label: string; options: string[] }) { return <div className="form-field"><label htmlFor={name}>{label}</label><select id={name} name={name}>{options.map((x) => <option key={x} value={x}>{x}</option>)}</select></div>; }
