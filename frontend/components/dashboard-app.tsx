"use client";

import { useEffect, useState } from "react";
import {
  ActionTemplate,
  AppConfig,
  BusinessRule,
  Dataset,
  IntegrationStatusPayload,
  KnowledgeAsset,
  Memory,
  Project,
  PromptTemplate,
  getActions,
  getAppConfig,
  getBusinessRules,
  getDatasets,
  getIntegrationStatus,
  getKnowledgeAssets,
  getMemories,
  getProjects,
  getPromptTemplates,
} from "@/lib/api";
import { ActionBuilderPanel } from "@/components/action-builder-panel";
import { ActionsPanel } from "@/components/actions-panel";
import { BackupPanel } from "@/components/backup-panel";
import { CommandCenterPanel } from "@/components/command-center-panel";
import { CommandPalette } from "@/components/command-palette";
import { IntegrationsPanel } from "@/components/integrations-panel";
import { OllamaChatPanel } from "@/components/ollama-chat-panel";
import { QuickCapturePanel } from "@/components/quick-capture-panel";
import { RagPanel } from "@/components/rag-panel";
import { ResourceManager } from "@/components/resource-manager";
import { SearchPanel } from "@/components/search-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { tabId } from "@/lib/format";

type Tab =
  | "chat"
  | "home"
  | "actions"
  | "actionBuilder"
  | "rag"
  | "search"
  | "quickCapture"
  | "settings"
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
      { id: "chat", label: "Chat" },
      { id: "home", label: "Home" },
      { id: "quickCapture", label: "Quick Capture" },
      { id: "search", label: "Search" },
    ],
  },
  {
    title: "Work",
    items: [
      { id: "actions", label: "Run Actions" },
      { id: "rag", label: "Ask Knowledge Base" },
      { id: "projects", label: "Projects" },
      { id: "datasets", label: "Datasets" },
      { id: "businessRules", label: "Business Rules" },
    ],
  },
  {
    title: "Build",
    items: [
      { id: "actionBuilder", label: "Action Builder" },
      { id: "promptTemplates", label: "Prompt Templates" },
      { id: "memories", label: "Memories" },
      { id: "knowledgeAssets", label: "Knowledge Assets" },
    ],
  },
  {
    title: "System",
    items: [
      { id: "settings", label: "Settings" },
      { id: "integrations", label: "Integrations" },
      { id: "backup", label: "Backup" },
    ],
  },
];

const titleMap: Record<Tab, string> = {
  chat: "Chat with Ollama",
  home: "Home",
  quickCapture: "Quick Capture",
  actions: "Run Actions",
  actionBuilder: "Action Builder",
  rag: "Ask Knowledge Base",
  search: "Search",
  settings: "Settings",
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
  chat: "Talk to your local Ollama model with optional access to AnalyticsOS knowledge context.",
  home: "Capture context, run actions, ask your documents, and preserve useful outputs.",
  quickCapture: "Save a thought, decision, note, or reusable knowledge item in seconds.",
  actions: "Run repeatable professional tasks using project context, dataset context, prompts, and Ollama.",
  actionBuilder: "Create your own reusable task/action templates with live prompt preview.",
  rag: "Ask AnythingLLM over your indexed knowledge base and save useful answers.",
  search: "Search across projects, datasets, rules, prompts, memories, knowledge, and saved outputs.",
  settings: "Configure runtime paths and integrations without manually editing .env on each laptop.",
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
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [knowledgeAssets, setKnowledgeAssets] = useState<KnowledgeAsset[]>([]);
  const [actions, setActions] = useState<ActionTemplate[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatusPayload | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      const [configData, projectData, datasetData, ruleData, templateData, memoryData, assetData, actionData, integrationData] =
        await Promise.all([
          getAppConfig(),
          getProjects(),
          getDatasets(),
          getBusinessRules(),
          getPromptTemplates(),
          getMemories(),
          getKnowledgeAssets(),
          getActions(),
          getIntegrationStatus(),
        ]);

      setConfig(configData);
      setProjects(projectData);
      setDatasets(datasetData);
      setBusinessRules(ruleData);
      setPromptTemplates(templateData);
      setMemories(memoryData);
      setKnowledgeAssets(assetData);
      setActions(actionData);
      setIntegrationStatus(integrationData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not connect to backend.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function toggleGroup(title: string) {
    setCollapsedGroups((current) => ({ ...current, [title]: !current[title] }));
  }

  return (
    <main className="app-shell">
      <CommandPalette actions={actions} projects={projects} onSelectTab={setActiveTab} />

      <aside className="sidebar">
        <div className="brand compact">
          <div className="brand-row">
            <div className="brand-mark">A</div>
            <div>
              <div className="brand-title">{config?.app_name ?? "AnalyticsOS"}</div>
              <div className="brand-subtitle">Build Once. Learn Forever.</div>
            </div>
          </div>
        </div>

        <nav className="nav">
          {navGroups.map((group) => {
            const collapsed = collapsedGroups[group.title] ?? false;
            return (
              <div className="nav-group" key={group.title}>
                <button className="nav-group-toggle" onClick={() => toggleGroup(group.title)}>
                  <span>{group.title}</span>
                  <span>{collapsed ? "›" : "⌄"}</span>
                </button>
                {!collapsed ? (
                  <div className="nav-group-items">
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
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span>{config ? config.api_version : "Checking..."}</span>
          <span>Ctrl+K</span>
        </div>
      </aside>

      <section className="main">
        <header className="header">
          <div>
            <div className="page-id">{tabId(activeTab)}</div>
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

        {activeTab === "chat" ? <OllamaChatPanel /> : null}

        {activeTab === "home" ? (
          <CommandCenterPanel
            businessRules={businessRules}
            datasets={datasets}
            integrationStatus={integrationStatus}
            knowledgeAssets={knowledgeAssets}
            memories={memories}
            onSelectTab={setActiveTab}
            projects={projects}
            promptTemplates={promptTemplates}
          />
        ) : null}

        {activeTab === "quickCapture" ? <QuickCapturePanel /> : null}
        {activeTab === "actions" ? <ActionsPanel projects={projects} datasets={datasets} /> : null}
        {activeTab === "actionBuilder" ? <ActionBuilderPanel /> : null}
        {activeTab === "rag" ? <RagPanel /> : null}
        {activeTab === "search" ? <SearchPanel /> : null}
        {activeTab === "settings" ? <SettingsPanel /> : null}
        {activeTab === "integrations" ? <IntegrationsPanel /> : null}
        {activeTab === "backup" ? <BackupPanel onRefresh={refresh} /> : null}

        {!["chat", "home", "quickCapture", "actions", "actionBuilder", "rag", "search", "settings", "integrations", "backup"].includes(activeTab) ? (
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
