"use client";

import { useEffect, useState } from "react";
import {
  AppConfig,
  BusinessRule,
  Dataset,
  KnowledgeAsset,
  Memory,
  Project,
  PromptTemplate,
  getAppConfig,
  getBusinessRules,
  getDatasets,
  getKnowledgeAssets,
  getMemories,
  getProjects,
  getPromptTemplates,
} from "@/lib/api";
import { ActionBuilderPanel } from "@/components/action-builder-panel";
import { ActionsPanel } from "@/components/actions-panel";
import { BackupPanel } from "@/components/backup-panel";
import { CommandCenterPanel } from "@/components/command-center-panel";
import { IntegrationsPanel } from "@/components/integrations-panel";
import { RagPanel } from "@/components/rag-panel";
import { ResourceManager } from "@/components/resource-manager";
import { SearchPanel } from "@/components/search-panel";

type Tab =
  | "home"
  | "actions"
  | "actionBuilder"
  | "rag"
  | "search"
  | "projects"
  | "datasets"
  | "businessRules"
  | "promptTemplates"
  | "memories"
  | "knowledgeAssets"
  | "integrations"
  | "backup";

const navGroups: { title: string; items: { id: Tab; label: string }[] }[] = [
  {
    title: "Start",
    items: [
      { id: "home", label: "Home" },
      { id: "actions", label: "Run Actions" },
      { id: "rag", label: "Ask Knowledge Base" },
      { id: "search", label: "Search" },
    ],
  },
  {
    title: "Build",
    items: [
      { id: "projects", label: "Projects" },
      { id: "datasets", label: "Datasets" },
      { id: "businessRules", label: "Business Rules" },
      { id: "actionBuilder", label: "Action Builder" },
    ],
  },
  {
    title: "Library",
    items: [
      { id: "promptTemplates", label: "Prompt Templates" },
      { id: "memories", label: "Memories" },
      { id: "knowledgeAssets", label: "Knowledge Assets" },
    ],
  },
  {
    title: "System",
    items: [
      { id: "integrations", label: "Integrations" },
      { id: "backup", label: "Backup" },
    ],
  },
];

const titleMap: Record<Tab, string> = {
  home: "Home",
  actions: "Run Actions",
  actionBuilder: "Action Builder",
  rag: "Ask Knowledge Base",
  search: "Search",
  projects: "Projects",
  datasets: "Datasets",
  businessRules: "Business Rules",
  promptTemplates: "Prompt Templates",
  memories: "Memories",
  knowledgeAssets: "Knowledge Assets",
  integrations: "Integrations",
  backup: "Backup",
};

const subtitleMap: Record<Tab, string> = {
  home: "Start here. Capture context, run actions, ask your documents, and preserve useful outputs.",
  actions: "Run repeatable professional tasks using project context, dataset context, prompts, and Ollama.",
  actionBuilder: "Create your own reusable task/action templates for AnalyticsOS.",
  rag: "Ask AnythingLLM over your indexed knowledge base and save useful answers.",
  search: "Search across projects, datasets, rules, prompts, memories, knowledge, and saved outputs.",
  projects: "Track professional initiatives, analytics use cases, and delivery work.",
  datasets: "Document files, tables, dashboards, notebooks, and other data assets.",
  businessRules: "Store definitions and business logic that should not be lost.",
  promptTemplates: "Reusable prompts for Claude, ChatGPT, NotebookLM, Ollama, and other tools.",
  memories: "Approved durable context, decisions, preferences, and lessons.",
  knowledgeAssets: "Markdown/text notes and saved outputs that AnalyticsOS can search.",
  integrations: "Check Ollama, Obsidian, and AnythingLLM configuration.",
  backup: "Export and import your local AnalyticsOS state.",
};

export function DashboardApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
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
      const [configData, projectData, datasetData, ruleData, templateData, memoryData, assetData] =
        await Promise.all([
          getAppConfig(),
          getProjects(),
          getDatasets(),
          getBusinessRules(),
          getPromptTemplates(),
          getMemories(),
          getKnowledgeAssets(),
        ]);

      setConfig(configData);
      setProjects(projectData);
      setDatasets(datasetData);
      setBusinessRules(ruleData);
      setPromptTemplates(templateData);
      setMemories(memoryData);
      setKnowledgeAssets(assetData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not connect to backend.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div className="brand-title">{config?.app_name ?? "AnalyticsOS"}</div>
          <div className="brand-subtitle">{config?.tagline ?? "Build Once. Learn Forever."}</div>
        </div>

        <nav className="nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              {group.items.map((item) => (
                <button
                  className={`nav-button ${activeTab === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          Backend: {config ? `${config.api_version} · ${config.environment}` : "checking..."}
        </div>
      </aside>

      <section className="main">
        <header className="header">
          <div>
            <div className="eyebrow">Local-first Professional Intelligence</div>
            <h1>{titleMap[activeTab]}</h1>
            <p className="subtitle">{subtitleMap[activeTab]}</p>
          </div>
          <div className="toolbar">
            <button className="button" onClick={() => void refresh()}>Refresh</button>
            <a className="button" href="http://127.0.0.1:8000/docs" rel="noreferrer" target="_blank">API Docs</a>
          </div>
        </header>

        {error ? (
          <section className="card span-12">
            <h2>Backend connection needed</h2>
            <p className="error">{error}</p>
            <p>Start the FastAPI backend, then refresh this page.</p>
          </section>
        ) : null}

        {activeTab === "home" ? (
          <CommandCenterPanel
            businessRules={businessRules}
            datasets={datasets}
            knowledgeAssets={knowledgeAssets}
            memories={memories}
            onSelectTab={setActiveTab}
            projects={projects}
            promptTemplates={promptTemplates}
          />
        ) : null}

        {activeTab === "actions" ? <ActionsPanel projects={projects} datasets={datasets} /> : null}
        {activeTab === "actionBuilder" ? <ActionBuilderPanel /> : null}
        {activeTab === "rag" ? <RagPanel /> : null}
        {activeTab === "search" ? <SearchPanel /> : null}
        {activeTab === "integrations" ? <IntegrationsPanel /> : null}
        {activeTab === "backup" ? <BackupPanel onRefresh={refresh} /> : null}

        {!["home", "actions", "actionBuilder", "rag", "search", "integrations", "backup"].includes(activeTab) ? (
          <ResourceManager
            businessRules={businessRules}
            datasets={datasets}
            kind={activeTab}
            knowledgeAssets={knowledgeAssets}
            memories={memories}
            onRefresh={refresh}
            projects={projects}
            promptTemplates={promptTemplates}
          />
        ) : null}
      </section>
    </main>
  );
}
