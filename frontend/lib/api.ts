const API_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICSOS_API_URL ?? "http://127.0.0.1:8000";

export type AppConfig = {
  app_name: string;
  tagline: string;
  mode: string;
  api_version: string;
  environment: string;
  enabled_features: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  function: string;
  owner: string;
};

export type Dataset = {
  id: string;
  name: string;
  description: string;
  dataset_type: string;
  source_system: string;
  owner: string;
};

export type BusinessRule = {
  id: string;
  name: string;
  definition: string;
  domain: string;
  status: string;
  owner: string;
  source: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  template_type: string;
  template: string;
  target_tool: string;
};

export type Memory = {
  id: string;
  title: string;
  content: string;
  memory_type: string;
  source: string;
  approved: boolean;
};

export type KnowledgeAsset = {
  id: string;
  title: string;
  path: string;
  asset_type: string;
  summary: string;
  tags: string[];
};

export type ActionTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  output_type: string;
  prompt_template: string;
  default_model: string;
};

export type ActionRunRecord = {
  id: string;
  action_id: string;
  action_name: string;
  execution_mode: string;
  model: string;
  project_id: string;
  dataset_id: string;
  audience: string;
  tone: string;
  rendered_prompt: string;
  output: string;
  used_ai: boolean;
  created_at: string;
};

export type ActionPreviewResult = {
  action_id: string;
  action_name: string;
  execution_mode: string;
  model: string;
  rendered_prompt: string;
  output: string;
  used_ai: boolean;
};

export type AiModelsPayload = {
  models: string[];
  default_model: string;
};

export type IntegrationStatus = {
  name: string;
  configured: boolean;
  available: boolean;
  details: string;
};

export type IntegrationStatusPayload = {
  ollama: IntegrationStatus;
  obsidian: IntegrationStatus;
  anythingllm: IntegrationStatus;
};

export type AppSettings = {
  id: string;
  data_dir: string;
  knowledge_dir: string;
  sync_dir: string;
  ollama_base_url: string;
  ollama_default_model: string;
  anythingllm_base_url: string;
  anythingllm_api_key: string;
  anythingllm_workspace_slug: string;
  obsidian_vault_path: string;
};

export type SettingsTestResult = {
  name: string;
  configured: boolean;
  available: boolean;
  details: string;
};

export type RagQueryResult = {
  question: string;
  answer: string;
  provider: string;
  workspace_slug: string;
  citations: Record<string, unknown>[];
  raw: Record<string, unknown>;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  answer: string;
  model: string;
  used_knowledge: boolean;
  context_items: Record<string, unknown>[];
  prompt: string;
};

export type SearchResult = {
  source: string;
  id: string;
  title: string;
  snippet: string;
  score: number;
};

export type BackupPayload = {
  version: string;
  projects: Project[];
  datasets: Dataset[];
  business_rules: BusinessRule[];
  prompt_templates: PromptTemplate[];
  memories: Memory[];
  knowledge_assets: KnowledgeAsset[];
};

export type ResourceName =
  | "projects"
  | "datasets"
  | "business-rules"
  | "prompt-templates"
  | "memories"
  | "knowledge-assets";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getAppConfig(): Promise<AppConfig> {
  return fetchJson<AppConfig>("/api/v1/app/config");
}

export async function getProjects(): Promise<Project[]> {
  return fetchJson<Project[]>("/api/v1/projects");
}

export async function getDatasets(): Promise<Dataset[]> {
  return fetchJson<Dataset[]>("/api/v1/datasets");
}

export async function getBusinessRules(): Promise<BusinessRule[]> {
  return fetchJson<BusinessRule[]>("/api/v1/business-rules");
}

export async function getPromptTemplates(): Promise<PromptTemplate[]> {
  return fetchJson<PromptTemplate[]>("/api/v1/prompt-templates");
}

export async function getMemories(): Promise<Memory[]> {
  return fetchJson<Memory[]>("/api/v1/memories");
}

export async function getKnowledgeAssets(): Promise<KnowledgeAsset[]> {
  return fetchJson<KnowledgeAsset[]>("/api/v1/knowledge-assets");
}

export async function getActions(): Promise<ActionTemplate[]> {
  return fetchJson<ActionTemplate[]>("/api/v1/actions");
}

export async function createAction(payload: ActionTemplate): Promise<ActionTemplate> {
  return fetchJson<ActionTemplate>("/api/v1/actions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getActionRuns(): Promise<ActionRunRecord[]> {
  return fetchJson<ActionRunRecord[]>("/api/v1/actions/runs");
}

export async function getAiModels(): Promise<AiModelsPayload> {
  return fetchJson<AiModelsPayload>("/api/v1/ai/models");
}

export async function chatWithOllama(payload: {
  message: string;
  model?: string;
  use_knowledge?: boolean;
  use_actions?: boolean;
  use_projects?: boolean;
  max_context_items?: number;
  history?: ChatMessage[];
}): Promise<ChatResponse> {
  return fetchJson<ChatResponse>("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function runAction(payload: {
  action_id: string;
  execution_mode: string;
  model?: string;
  project_id?: string;
  dataset_id?: string;
  additional_context?: string;
  audience?: string;
  tone?: string;
}): Promise<ActionRunRecord> {
  return fetchJson<ActionRunRecord>("/api/v1/actions/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function previewAction(payload: {
  action_id: string;
  execution_mode: string;
  model?: string;
  project_id?: string;
  dataset_id?: string;
  additional_context?: string;
  audience?: string;
  tone?: string;
}): Promise<ActionPreviewResult> {
  return fetchJson<ActionPreviewResult>("/api/v1/actions/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveActionOutputAsKnowledge(payload: {
  run_id: string;
  title?: string;
  tags?: string[];
}): Promise<KnowledgeAsset> {
  return fetchJson<KnowledgeAsset>("/api/v1/actions/runs/save-as-knowledge", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getIntegrationStatus(): Promise<IntegrationStatusPayload> {
  return fetchJson<IntegrationStatusPayload>("/api/v1/integrations/status");
}

export async function getSettings(): Promise<AppSettings> {
  return fetchJson<AppSettings>("/api/v1/settings");
}

export async function saveSettings(payload: AppSettings): Promise<AppSettings> {
  return fetchJson<AppSettings>("/api/v1/settings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function testIntegration(name: "ollama" | "anythingllm" | "obsidian"): Promise<SettingsTestResult> {
  return fetchJson<SettingsTestResult>(`/api/v1/settings/test/${name}`);
}

export async function quickCapture(payload: {
  title: string;
  content: string;
  capture_type: string;
  tags?: string[];
}): Promise<{ saved: boolean; target_type: string; id: string; message: string }> {
  return fetchJson("/api/v1/quick-capture", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function queryRag(payload: {
  question: string;
  workspace_slug?: string;
  mode?: string;
  session_id?: string;
}): Promise<RagQueryResult> {
  return fetchJson<RagQueryResult>("/api/v1/rag/query", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveRagAnswer(payload: {
  title: string;
  question: string;
  answer: string;
  tags?: string[];
}): Promise<KnowledgeAsset> {
  return fetchJson<KnowledgeAsset>("/api/v1/rag/save-answer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function exportToObsidian(payload: {
  title: string;
  content: string;
  folder?: string;
}): Promise<{ exported: boolean; path: string; message: string }> {
  return fetchJson("/api/v1/obsidian/export", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function searchEverything(query: string): Promise<SearchResult[]> {
  return fetchJson<SearchResult[]>(`/api/v1/search?q=${encodeURIComponent(query)}`);
}

export async function createResource<TPayload, TResponse>(
  resource: ResourceName,
  payload: TPayload,
): Promise<TResponse> {
  return fetchJson<TResponse>(`/api/v1/${resource}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteResource(
  resource: ResourceName,
  id: string,
): Promise<{ deleted: boolean }> {
  return fetchJson<{ deleted: boolean }>(`/api/v1/${resource}/${id}`, {
    method: "DELETE",
  });
}

export async function exportBackup(): Promise<BackupPayload> {
  return fetchJson<BackupPayload>("/api/v1/backup/export");
}

export async function importBackup(payload: BackupPayload): Promise<Record<string, number>> {
  return fetchJson<Record<string, number>>("/api/v1/backup/import", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
