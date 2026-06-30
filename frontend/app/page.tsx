import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";
import {
  getBusinessRules,
  getDatasets,
  getMemories,
  getProjects,
  getPromptTemplates,
  getVersion,
} from "@/lib/api";

export default async function Home() {
  try {
    const [version, projects, datasets, businessRules, promptTemplates, memories] =
      await Promise.all([
        getVersion(),
        getProjects(),
        getDatasets(),
        getBusinessRules(),
        getPromptTemplates(),
        getMemories(),
      ]);

    return (
      <main className="page-shell">
        <header className="header">
          <div>
            <div className="eyebrow">AnalyticsOS Dashboard MVP</div>
            <h1>Build Once. Learn Forever.</h1>
            <p className="subtitle">
              A local-first professional intelligence platform for projects,
              datasets, rules, prompt templates, and memories.
            </p>
          </div>
          <div className="status-pill">
            API <strong>{version.api_version}</strong> · {version.environment}
          </div>
        </header>

        <section className="grid">
          <DashboardCard
            title="Projects"
            count={projects.length}
            description="Professional initiatives being tracked by AnalyticsOS."
          />
          <DashboardCard
            title="Datasets"
            count={datasets.length}
            description="Known data assets, files, tables, dashboards, and notebooks."
          />
          <DashboardCard
            title="Business Rules"
            count={businessRules.length}
            description="Reusable definitions and business logic."
          />
          <DashboardCard
            title="Prompt Templates"
            count={promptTemplates.length}
            description="Reusable prompts for Claude, NotebookLM, and other tools."
          />
          <DashboardCard
            title="Memories"
            count={memories.length}
            description="Approved professional memory and durable context."
          />
          <DashboardCard
            title="Next"
            description="The next release will add create forms and a more structured navigation shell."
          >
            <div className="toolbar">
              <a className="button" href="http://127.0.0.1:8000/docs">
                Open API Docs
              </a>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Projects" className="span-6">
            <ObjectList
              emptyText="No projects found."
              items={projects.map((project) => ({
                id: project.id,
                title: project.name,
                description: project.description,
                meta: `${project.status} · ${project.function} · ${project.owner}`,
              }))}
            />
          </DashboardCard>

          <DashboardCard title="Known Datasets" className="span-6">
            <ObjectList
              emptyText="No datasets found."
              items={datasets.map((dataset) => ({
                id: dataset.id,
                title: dataset.name,
                description: dataset.description,
                meta: `${dataset.dataset_type} · ${dataset.source_system}`,
              }))}
            />
          </DashboardCard>

          <DashboardCard title="Business Rules" className="span-6">
            <ObjectList
              emptyText="No business rules found."
              items={businessRules.map((rule) => ({
                id: rule.id,
                title: rule.name,
                description: rule.definition,
                meta: `${rule.status} · ${rule.domain}`,
              }))}
            />
          </DashboardCard>

          <DashboardCard title="Professional Memories" className="span-6">
            <ObjectList
              emptyText="No memories found."
              items={memories.map((memory) => ({
                id: memory.id,
                title: memory.title,
                description: memory.content,
                meta: `${memory.memory_type} · approved: ${memory.approved}`,
              }))}
            />
          </DashboardCard>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="page-shell">
        <header className="header">
          <div>
            <div className="eyebrow">AnalyticsOS Dashboard MVP</div>
            <h1>Backend connection needed</h1>
            <p className="subtitle">
              Start the FastAPI backend first, then refresh this page.
            </p>
          </div>
        </header>
        <section className="card span-12">
          <h2>Connection error</h2>
          <p className="error">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <p>Run this from the repository root:</p>
          <pre>{".\\scripts\\run-backend.ps1"}</pre>
        </section>
      </main>
    );
  }
}
