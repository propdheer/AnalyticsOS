"use client";

import { useEffect, useState } from "react";
import { ActionRunRecord, ActionTemplate, Dataset, Project, exportToObsidian, getActionRuns, getActions, getAiModels, runAction, saveActionOutputAsKnowledge } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";

export function ActionsPanel({ projects, datasets }: { projects: Project[]; datasets: Dataset[] }) {
  const [actions, setActions] = useState<ActionTemplate[]>([]);
  const [runs, setRuns] = useState<ActionRunRecord[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [executionMode, setExecutionMode] = useState("prompt_only");
  const [model, setModel] = useState("");
  const [projectId, setProjectId] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [audience, setAudience] = useState("Leadership");
  const [tone, setTone] = useState("clear, concise, executive-ready");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<ActionRunRecord | null>(null);
  const [message, setMessage] = useState("");

  async function loadRuns() { setRuns(await getActionRuns()); }

  useEffect(() => {
    getActions().then((items) => { setActions(items); setSelectedAction(items[0]?.id ?? ""); }).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load actions."));
    getAiModels().then((payload) => { setModels(payload.models); setModel(payload.models[0] ?? payload.default_model ?? ""); }).catch(() => setModels([]));
    void loadRuns();
  }, []);

  async function handleRun(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    try {
      const output = await runAction({ action_id: selectedAction, execution_mode: executionMode, model, project_id: projectId, dataset_id: datasetId, additional_context: context, audience, tone });
      setResult(output); await loadRuns();
      setMessage(output.used_ai ? `AI output generated using ${output.model}.` : "Prompt generated and saved to run history.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Action failed."); }
  }
  async function handleCopy() { if (!result) return; await navigator.clipboard.writeText(result.output); setMessage("Copied output."); }
  async function handleExport() { if (!result) return; try { const exportResult = await exportToObsidian({ title: result.action_name, content: result.output, folder: "AnalyticsOS Outputs" }); setMessage(exportResult.message); } catch (error) { setMessage(error instanceof Error ? error.message : "Export failed."); } }
  async function handleSaveAsKnowledge() { if (!result) return; try { const asset = await saveActionOutputAsKnowledge({ run_id: result.id, title: result.action_name, tags: ["action-output", result.action_id] }); setMessage(`Saved as Knowledge Asset: ${asset.title}`); } catch (error) { setMessage(error instanceof Error ? error.message : "Save as knowledge failed."); } }
  async function refreshModels() { try { const payload = await getAiModels(); setModels(payload.models); setModel(payload.models[0] ?? payload.default_model ?? ""); setMessage(payload.models.length > 0 ? "Ollama models refreshed." : "No downloaded Ollama models found."); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not fetch Ollama models."); } }
  function openRun(run: ActionRunRecord) { setResult(run); setMessage(`Opened run: ${run.action_name}`); }

  return (
    <section className="grid">
      <DashboardCard title="Action Runner" description="Run predefined professional actions on your AnalyticsOS context." className="span-6">
        <form className="form" onSubmit={handleRun}>
          <div className="form-field"><label>Action</label><select value={selectedAction} onChange={(event) => setSelectedAction(event.target.value)}>{actions.map((action) => <option key={action.id} value={action.id}>{action.name}</option>)}</select></div>
          <div className="form-grid"><div className="form-field"><label>Execution Mode</label><select value={executionMode} onChange={(event) => setExecutionMode(event.target.value)}><option value="prompt_only">Prompt only</option><option value="ollama">Ollama</option></select></div><div className="form-field"><label>Ollama Model</label><select value={model} onChange={(event) => setModel(event.target.value)} disabled={models.length === 0}>{models.length === 0 ? <option value="">No local models found</option> : models.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div>
          <div className="toolbar"><button className="button" type="button" onClick={() => void refreshModels()}>Refresh Ollama Models</button></div>
          <div className="form-grid"><div className="form-field"><label>Audience</label><input value={audience} onChange={(event) => setAudience(event.target.value)} /></div><div className="form-field"><label>Tone</label><input value={tone} onChange={(event) => setTone(event.target.value)} /></div></div>
          <div className="form-grid"><div className="form-field"><label>Project</label><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div><div className="form-field"><label>Dataset</label><select value={datasetId} onChange={(event) => setDatasetId(event.target.value)}><option value="">No dataset</option>{datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}</select></div></div>
          <div className="form-field"><label>Additional Context</label><textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="Paste meeting notes, requirements, business ask, or extra context." /></div>
          <div className="toolbar"><button className="button" type="submit">Run Action</button>{message ? <span className={message.includes("failed") || message.includes("Request failed") ? "error" : "success"}>{message}</span> : null}</div>
        </form>
      </DashboardCard>
      <DashboardCard title="Action Run History" count={runs.length} className="span-6"><div className="list">{runs.length === 0 ? <p>No action runs yet.</p> : null}{runs.slice(0, 10).map((run) => <div className="list-item" key={run.id}><div className="list-item-header"><div><div className="list-item-title">{run.action_name}</div><div className="list-item-meta">{run.execution_mode} · {run.model || "no model"} · {new Date(run.created_at).toLocaleString()}</div></div><button className="button" onClick={() => openRun(run)}>Open</button></div></div>)}</div></DashboardCard>
      <DashboardCard title="Action Library" count={actions.length} className="span-6"><ObjectList emptyText="No actions found." items={actions.map((action) => ({ id: action.id, title: action.name, description: action.description, meta: `${action.category} · ${action.output_type}` }))} /></DashboardCard>
      <DashboardCard title="Generated Output" description="Run outputs are now stored in history. You can also save an output as a Knowledge Asset." className="span-6"><div className="toolbar"><button className="button" onClick={() => void handleCopy()} disabled={!result}>Copy Output</button><button className="button" onClick={() => void handleExport()} disabled={!result}>Export</button><button className="button" onClick={() => void handleSaveAsKnowledge()} disabled={!result}>Save as Knowledge</button></div><pre className="output-block">{result?.output ?? "Run or open an action to view output."}</pre></DashboardCard>
    </section>
  );
}
