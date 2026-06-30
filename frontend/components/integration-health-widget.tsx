"use client";

import { IntegrationStatusPayload } from "@/lib/api";

export function IntegrationHealthWidget({
  status,
  onOpenSettings,
}: {
  status: IntegrationStatusPayload | null;
  onOpenSettings: () => void;
}) {
  const items = status
    ? [
        { key: "ollama", label: "Ollama", item: status.ollama },
        { key: "anythingllm", label: "AnythingLLM", item: status.anythingllm },
        { key: "obsidian", label: "Obsidian", item: status.obsidian },
      ]
    : [];

  return (
    <div className="health-grid">
      {items.map(({ key, label, item }) => (
        <button className="health-card" key={key} onClick={onOpenSettings}>
          <span className={`health-dot ${item.available ? "green" : item.configured ? "yellow" : "red"}`} />
          <div>
            <strong>{label}</strong>
            <p>{item.available ? "Connected" : item.configured ? "Configured, not reachable" : "Not configured"}</p>
          </div>
        </button>
      ))}
      {!status ? <p>Loading integration health...</p> : null}
    </div>
  );
}
