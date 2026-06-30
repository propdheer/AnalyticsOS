"use client";

import { useState } from "react";
import { BackupPayload, exportBackup, importBackup } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function BackupPanel({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [backupText, setBackupText] = useState("");

  async function handleExport() {
    setMessage("");
    try {
      const payload = await exportBackup();
      const text = JSON.stringify(payload, null, 2);
      setBackupText(text);

      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `analyticsos-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);

      setMessage("Backup exported.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Export failed.");
    }
  }

  async function handleImport() {
    setMessage("");
    try {
      const parsed = JSON.parse(backupText) as BackupPayload;
      await importBackup(parsed);
      await onRefresh();
      setMessage("Backup imported.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Backup and Restore" description="Export your local AnalyticsOS objects to JSON, or import them back later." className="span-12">
        <div className="toolbar">
          <button className="button" onClick={() => void handleExport()}>Export Backup</button>
          <button className="button" onClick={() => void handleImport()}>Import from Text</button>
          {message ? <span className={message.includes("failed") ? "error" : "success"}>{message}</span> : null}
        </div>

        <div className="form-field" style={{ marginTop: "16px" }}>
          <label htmlFor="backup-text">Backup JSON</label>
          <textarea
            id="backup-text"
            value={backupText}
            onChange={(event) => setBackupText(event.target.value)}
            placeholder="Exported backup JSON appears here. You can also paste backup JSON and import it."
            style={{ minHeight: "360px" }}
          />
        </div>
      </DashboardCard>
    </section>
  );
}
