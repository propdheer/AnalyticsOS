"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/dashboard-card";
import { RuntimeStatus, getRuntimeStatus } from "@/lib/api";

export function RuntimeStatusPanel() {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [error, setError] = useState("");

  async function loadStatus() {
    setError("");
    try {
      setStatus(await getRuntimeStatus());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load runtime status.");
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  return (
    <DashboardCard
      title="Second Brain Runtime"
      description="Confirms the active project folder, virtual environment, Data folder, and Knowledge folder."
      className="span-12"
    >
      <div className="toolbar">
        <button className="button" type="button" onClick={() => void loadStatus()}>
          Refresh Runtime Check
        </button>
        {error ? <span className="error">{error}</span> : null}
      </div>

      {status ? (
        <div className="runtime-grid">
          <div><strong>Version</strong><p>{status.version}</p></div>
          <div><strong>Project Root</strong><p>{status.project_root}</p></div>
          <div><strong>Data Directory</strong><p>{status.data_dir}</p></div>
          <div><strong>Knowledge Directory</strong><p>{status.knowledge_dir}</p></div>
          <div><strong>Virtual Environment</strong><p>{status.venv || "Not detected"}</p></div>
        </div>
      ) : (
        <p>Loading runtime status...</p>
      )}

      {status ? (
        <div className="list">
          {status.checks.map((check) => (
            <div className="list-item" key={check.name}>
              <div className="list-item-header">
                <div>
                  <div className="list-item-title">{check.ok ? "✅" : "⚠️"} {check.name}</div>
                  <div className="list-item-description">{check.details}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </DashboardCard>
  );
}
