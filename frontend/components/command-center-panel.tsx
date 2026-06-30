"use client";

import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";
import {
  BusinessRule,
  Dataset,
  KnowledgeAsset,
  Memory,
  Project,
  PromptTemplate,
} from "@/lib/api";

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

export function CommandCenterPanel({
  projects,
  datasets,
  businessRules,
  promptTemplates,
  memories,
  knowledgeAssets,
  onSelectTab,
}: {
  projects: Project[];
  datasets: Dataset[];
  businessRules: BusinessRule[];
  promptTemplates: PromptTemplate[];
  memories: Memory[];
  knowledgeAssets: KnowledgeAsset[];
  onSelectTab: (tab: Tab) => void;
}) {
  const totalObjects =
    projects.length +
    datasets.length +
    businessRules.length +
    promptTemplates.length +
    memories.length +
    knowledgeAssets.length;

  const recommendedStep = getRecommendedStep(projects.length, datasets.length, businessRules.length, knowledgeAssets.length);

  return (
    <section className="grid">
      <DashboardCard title="What do you want to do?" className="span-12">
        <div className="quick-grid">
          <button className="quick-card" onClick={() => onSelectTab("projects")}>
            <div className="quick-title">1. Capture context</div>
            <p>Add a project, dataset, rule, memory, or knowledge asset.</p>
          </button>

          <button className="quick-card" onClick={() => onSelectTab("actions")}>
            <div className="quick-title">2. Run an action</div>
            <p>Create a PPT brief, adoption update, dashboard spec, email, or checklist.</p>
          </button>

          <button className="quick-card" onClick={() => onSelectTab("rag")}>
            <div className="quick-title">3. Ask your documents</div>
            <p>Use AnythingLLM to ask questions over your indexed knowledge base.</p>
          </button>

          <button className="quick-card" onClick={() => onSelectTab("backup")}>
            <div className="quick-title">4. Preserve work</div>
            <p>Backup your local system and keep outputs reusable.</p>
          </button>
        </div>
      </DashboardCard>

      <DashboardCard title="Next best step" className="span-8">
        <div className="notice">
          <strong>{recommendedStep.title}</strong>
          <p>{recommendedStep.description}</p>
          <button className="button" onClick={() => onSelectTab(recommendedStep.tab)}>
            Go there
          </button>
        </div>
      </DashboardCard>

      <DashboardCard title="System health" className="span-4">
        <p>
          Objects tracked: <strong>{totalObjects}</strong>
        </p>
        <p>
          Projects: <strong>{projects.length}</strong>
        </p>
        <p>
          Knowledge assets: <strong>{knowledgeAssets.length}</strong>
        </p>
      </DashboardCard>

      <DashboardCard title="Simple operating loop" className="span-12">
        <div className="loop-steps">
          <div><strong>Capture</strong><span>Project, dataset, rule, memory</span></div>
          <div><strong>Act</strong><span>Run a reusable action</span></div>
          <div><strong>Ask</strong><span>Query documents and context</span></div>
          <div><strong>Save</strong><span>Store useful outputs as knowledge</span></div>
          <div><strong>Reuse</strong><span>Search, export, and build again</span></div>
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Projects" className="span-6">
        <ObjectList
          emptyText="No projects yet. Start by adding your first project."
          items={projects.slice(0, 5).map((project) => ({
            id: project.id,
            title: project.name,
            description: project.description,
            meta: `${project.status} · ${project.function} · ${project.owner}`,
          }))}
        />
      </DashboardCard>

      <DashboardCard title="Recent Knowledge" className="span-6">
        <ObjectList
          emptyText="No knowledge assets yet."
          items={knowledgeAssets.slice(0, 5).map((asset) => ({
            id: asset.id,
            title: asset.title,
            description: asset.summary,
            meta: asset.path,
            badge: asset.tags.join(", "),
          }))}
        />
      </DashboardCard>
    </section>
  );
}

function getRecommendedStep(
  projectCount: number,
  datasetCount: number,
  ruleCount: number,
  knowledgeCount: number,
): { title: string; description: string; tab: Tab } {
  if (projectCount === 0) {
    return {
      title: "Add your first project",
      description: "AnalyticsOS becomes useful once it has at least one real initiative to anchor context around.",
      tab: "projects",
    };
  }

  if (datasetCount === 0) {
    return {
      title: "Add a dataset",
      description: "Connect the project to a known data asset, table, file, dashboard, or notebook.",
      tab: "datasets",
    };
  }

  if (ruleCount === 0) {
    return {
      title: "Add a business rule",
      description: "Capture definitions such as active distributor, net sales, primary sales, or adoption metrics.",
      tab: "businessRules",
    };
  }

  if (knowledgeCount === 0) {
    return {
      title: "Save your first knowledge asset",
      description: "Run an action or save a useful note so AnalyticsOS starts compounding reusable knowledge.",
      tab: "actions",
    };
  }

  return {
    title: "Run an action",
    description: "Use your captured context to generate a PPT brief, adoption update, requirement document, or stakeholder email.",
    tab: "actions",
  };
}
