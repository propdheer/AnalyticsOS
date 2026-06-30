"use client";

import { useEffect, useState } from "react";
import { IntegrationStatusPayload, getIntegrationStatus } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function IntegrationsPanel() {
  const [status, setStatus] = useState<IntegrationStatusPayload | null>(null);
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      setStatus(await getIntegrationStatus());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load integration status.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <section className="grid">
      {message ? <div className="card span-12 error">{message}</div> : null}

      {status ? (
        <>
          <IntegrationCard title="Ollama" item={status.ollama} />
          <IntegrationCard title="Obsidian" item={status.obsidian} />
          <IntegrationCard title="AnythingLLM" item={status.anythingllm} />

          <DashboardCard title="Configuration" className="span-12">
            <p>Set these optional environment variables in `.env` when you are ready:</p>
            <pre className="output-block">{`ANALYTICSOS_OLLAMA_BASE_URL=http://127.0.0.1:11434
ANALYTICSOS_OLLAMA_DEFAULT_MODEL=llama3.1
ANALYTICSOS_OBSIDIAN_VAULT_PATH=C:\\Path\\To\\Obsidian\\Vault
ANALYTICSOS_ANYTHINGLLM_BASE_URL=http://127.0.0.1:3001
ANALYTICSOS_ANYTHINGLLM_API_KEY=your_key_here`}</pre>
          </DashboardCard>
        </>
      ) : null}
    </section>
  );
}

function IntegrationCard({
  title,
  item,
}: {
  title: string;
  item: { configured: boolean; available: boolean; details: string };
}) {
  return (
    <DashboardCard title={title} className="span-4">
      <p>
        Configured: <strong>{String(item.configured)}</strong>
      </p>
      <p>
        Available: <strong>{String(item.available)}</strong>
      </p>
      <p>{item.details}</p>
    </DashboardCard>
  );
}
