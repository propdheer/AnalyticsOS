"use client";

import { useEffect, useState } from "react";
import { AppConfig, BusinessRule, Dataset, KnowledgeAsset, Memory, Project, PromptTemplate, getAppConfig, getBusinessRules, getDatasets, getKnowledgeAssets, getMemories, getProjects, getPromptTemplates } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";
import { ResourceManager } from "@/components/resource-manager";
import { SearchPanel } from "@/components/search-panel";

type Tab = "overview" | "search" | "projects" | "datasets" | "businessRules" | "promptTemplates" | "memories" | "knowledgeAssets";
const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" }, { id: "search", label: "Search" }, { id: "projects", label: "Projects" },
  { id: "datasets", label: "Datasets" }, { id: "businessRules", label: "Business Rules" }, { id: "promptTemplates", label: "Prompt Templates" },
  { id: "memories", label: "Memories" }, { id: "knowledgeAssets", label: "Knowledge Assets" },
];

export function DashboardApp() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [knowledgeAssets, setKnowledgeAssets] = useState<KnowledgeAsset[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      const [configData, projectData, datasetData, ruleData, templateData, memoryData, assetData] = await Promise.all([
        getAppConfig(), getProjects(), getDatasets(), getBusinessRules(), getPromptTemplates(), getMemories(), getKnowledgeAssets(),
      ]);
      setConfig(configData); setProjects(projectData); setDatasets(datasetData); setBusinessRules(ruleData); setPromptTemplates(templateData); setMemories(memoryData); setKnowledgeAssets(assetData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not connect to backend.");
    }
  }

  useEffect(() => { void refresh(); }, []);
  const title = activeTab === "overview" ? "Command center" : tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">A</div><div className="brand-title">{config?.app_name ?? "AnalyticsOS"}</div><div className="brand-subtitle">{config?.tagline ?? "Build Once. Learn Forever."}</div></div>
        <nav className="nav">{tabs.map((tab) => <button className={`nav-button ${activeTab === tab.id ? "active" : ""}`} key={tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</nav>
        <div className="sidebar-footer">Backend: {config ? `${config.api_version} · ${config.environment}` : "checking..."}</div>
      </aside>
      <section className="main">
        <header className="header">
          <div><div className="eyebrow">Local-first Professional Intelligence</div><h1>{title}</h1><p className="subtitle">Create, search, and manage the professional objects that make AnalyticsOS useful.</p></div>
          <div className="toolbar"><button className="button" onClick={() => void refresh()}>Refresh</button><a className="button" href="http://127.0.0.1:8000/docs" rel="noreferrer" target="_blank">API Docs</a></div>
        </header>
        {error ? <section className="card span-12"><h2>Backend connection needed</h2><p className="error">{error}</p><p>Start the FastAPI backend, then refresh this page.</p></section> : null}
        {activeTab === "overview" ? <Overview projects={projects} datasets={datasets} businessRules={businessRules} promptTemplates={promptTemplates} memories={memories} knowledgeAssets={knowledgeAssets} /> : null}
        {activeTab === "search" ? <SearchPanel /> : null}
        {activeTab !== "overview" && activeTab !== "search" ? <ResourceManager businessRules={businessRules} datasets={datasets} kind={activeTab} knowledgeAssets={knowledgeAssets} memories={memories} onRefresh={refresh} projects={projects} promptTemplates={promptTemplates} /> : null}
      </section>
    </main>
  );
}

function Overview({ projects, datasets, businessRules, promptTemplates, memories, knowledgeAssets }: { projects: Project[]; datasets: Dataset[]; businessRules: BusinessRule[]; promptTemplates: PromptTemplate[]; memories: Memory[]; knowledgeAssets: KnowledgeAsset[] }) {
  return (
    <section className="grid">
      <DashboardCard title="Projects" count={projects.length} description="Professional initiatives." className="span-3" />
      <DashboardCard title="Datasets" count={datasets.length} description="Known data assets." className="span-3" />
      <DashboardCard title="Rules" count={businessRules.length} description="Reusable logic." className="span-3" />
      <DashboardCard title="Knowledge" count={knowledgeAssets.length} description="Local assets." className="span-3" />
      <DashboardCard title="Recommended next steps" className="span-12"><div className="notice">Add one real project, one dataset, one rule, and one memory. Then use Search to verify AnalyticsOS can retrieve them.</div></DashboardCard>
      <DashboardCard title="Recent Projects" className="span-6"><ObjectList emptyText="No projects found." items={projects.map((x) => ({ id: x.id, title: x.name, description: x.description, meta: `${x.status} · ${x.function} · ${x.owner}` }))} /></DashboardCard>
      <DashboardCard title="Prompt Templates" className="span-6"><ObjectList emptyText="No prompt templates found." items={promptTemplates.map((x) => ({ id: x.id, title: x.name, description: x.description, meta: `${x.template_type} · ${x.target_tool}` }))} /></DashboardCard>
      <DashboardCard title="Professional Memories" className="span-6"><ObjectList emptyText="No memories found." items={memories.map((x) => ({ id: x.id, title: x.title, description: x.content, meta: `${x.memory_type} · approved: ${x.approved}` }))} /></DashboardCard>
      <DashboardCard title="Knowledge Assets" className="span-6"><ObjectList emptyText="No knowledge assets found." items={knowledgeAssets.map((x) => ({ id: x.id, title: x.title, description: x.summary, meta: x.path, badge: x.tags.join(", ") }))} /></DashboardCard>
    </section>
  );
}
