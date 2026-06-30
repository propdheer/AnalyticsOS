const API_BASE_URL =
  process.env.NEXT_PUBLIC_ANALYTICSOS_API_URL ?? "http://127.0.0.1:8000";

export type ApiVersion = {
  name: string;
  api_version: string;
  environment: string;
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

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getVersion(): Promise<ApiVersion> {
  return fetchJson<ApiVersion>("/version");
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
