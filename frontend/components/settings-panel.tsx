"use client";

import { useEffect, useState } from "react";
import { AppSettings, getSettings, saveSettings, testIntegration } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

const blankSettings: AppSettings = {
  id: "default",
  data_dir: "",
  knowledge_dir: "",
  sync_dir: "",
  ollama_base_url: "http://127.0.0.1:11434",
  ollama_default_model: "llama3.1",
  anythingllm_base_url: "",
  anythingllm_api_key: "",
  anythingllm_workspace_slug: "",
  obsidian_vault_path: "",
};

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>(blankSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load settings."));
  }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const saved = await saveSettings(settings);
      setSettings(saved);
      setMessage("Settings saved. Restart backend after changing runtime paths.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    }
  }

  async function handleTest(name: "ollama" | "anythingllm" | "obsidian") {
    try {
      const result = await testIntegration(name);
      setMessage(`${result.name}: ${result.available ? "Connected" : "Needs attention"} — ${result.details}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Test failed.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Settings" description="Configure local runtime paths and integrations without editing .env files on every laptop." className="span-12">
        <form className="form" onSubmit={handleSave}>
          <h3>Runtime Paths</h3>
          <div className="form-grid">
            <Field label="Data Directory" value={settings.data_dir} onChange={(value) => update("data_dir", value)} />
            <Field label="Knowledge Directory" value={settings.knowledge_dir} onChange={(value) => update("knowledge_dir", value)} />
            <Field label="Snapshot Sync Directory" value={settings.sync_dir} onChange={(value) => update("sync_dir", value)} />
          </div>

          <h3>Ollama</h3>
          <div className="form-grid">
            <Field label="Ollama Base URL" value={settings.ollama_base_url} onChange={(value) => update("ollama_base_url", value)} />
            <Field label="Default Model" value={settings.ollama_default_model} onChange={(value) => update("ollama_default_model", value)} />
          </div>

          <h3>AnythingLLM</h3>
          <div className="form-grid">
            <Field label="AnythingLLM Base URL" value={settings.anythingllm_base_url} onChange={(value) => update("anythingllm_base_url", value)} />
            <Field label="Workspace Slug" value={settings.anythingllm_workspace_slug} onChange={(value) => update("anythingllm_workspace_slug", value)} />
          </div>
          <div className="form-field">
            <label>AnythingLLM API Key</label>
            <input value={settings.anythingllm_api_key} onChange={(event) => update("anythingllm_api_key", event.target.value)} type="password" />
          </div>

          <h3>Obsidian</h3>
          <Field label="Obsidian Vault Path" value={settings.obsidian_vault_path} onChange={(value) => update("obsidian_vault_path", value)} />

          <div className="toolbar">
            <button className="button" type="submit">Save Settings</button>
            <button className="button" type="button" onClick={() => void handleTest("ollama")}>Test Ollama</button>
            <button className="button" type="button" onClick={() => void handleTest("anythingllm")}>Test AnythingLLM</button>
            <button className="button" type="button" onClick={() => void handleTest("obsidian")}>Test Obsidian</button>
            {message ? <span className={message.includes("Could not") || message.includes("failed") ? "error" : "success"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
