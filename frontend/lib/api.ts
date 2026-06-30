const API_BASE_URL = process.env.NEXT_PUBLIC_ANALYTICSOS_API_URL ?? "http://127.0.0.1:8000";

export type AppConfig = { app_name: string; tagline: string; mode: string; api_version: string; environment: string; enabled_features: string[] };
export type Project = { id: string; name: string; description: string; status: string; function: string; owner: string };
export type Dataset = { id: string; name: string; description: string; dataset_type: string; source_system: string; owner: string };
export type BusinessRule = { id: string; name: string; definition: string; domain: string; status: string; owner: string; source: string };
export type PromptTemplate = { id: string; name: string; description: string; template_type: string; template: string; target_tool: string };
export type Memory = { id: string; title: string; content: string; memory_type: string; source: string; approved: boolean };
export type KnowledgeAsset = { id: string; title: string; path: string; asset_type: string; summary: string; tags: string[] };
export type SearchResult = { source: string; id: string; title: string; snippet: string; score: number };
export type ResourceName = "projects" | "datasets" | "business-rules" | "prompt-templates" | "memories" | "knowledge-assets";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export const getAppConfig = () => fetchJson<AppConfig>("/api/v1/app/config");
export const getProjects = () => fetchJson<Project[]>("/api/v1/projects");
export const getDatasets = () => fetchJson<Dataset[]>("/api/v1/datasets");
export const getBusinessRules = () => fetchJson<BusinessRule[]>("/api/v1/business-rules");
export const getPromptTemplates = () => fetchJson<PromptTemplate[]>("/api/v1/prompt-templates");
export const getMemories = () => fetchJson<Memory[]>("/api/v1/memories");
export const getKnowledgeAssets = () => fetchJson<KnowledgeAsset[]>("/api/v1/knowledge-assets");
export const searchEverything = (query: string) => fetchJson<SearchResult[]>(`/api/v1/search?q=${encodeURIComponent(query)}`);

export function createResource<TPayload, TResponse>(resource: ResourceName, payload: TPayload): Promise<TResponse> {
  return fetchJson<TResponse>(`/api/v1/${resource}`, { method: "POST", body: JSON.stringify(payload) });
}

export function deleteResource(resource: ResourceName, id: string): Promise<{ deleted: boolean }> {
  return fetchJson<{ deleted: boolean }>(`/api/v1/${resource}/${id}`, { method: "DELETE" });
}
