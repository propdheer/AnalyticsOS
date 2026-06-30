const API_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICSOS_API_URL ?? "http://127.0.0.1:8000";

export type ApiVersion = {
  name: string;
  api_version: string;
  environment: string;
};

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

export async function getVersion(): Promise<ApiVersion> {
  return fetchJson<ApiVersion>("/version");
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
