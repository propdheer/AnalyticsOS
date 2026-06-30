"use client";

import { useState } from "react";
import { quickCapture } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function QuickCapturePanel() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [captureType, setCaptureType] = useState("memory");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const result = await quickCapture({
        title,
        content,
        capture_type: captureType,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      setTitle("");
      setContent("");
      setTags("");
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save capture.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Quick Capture" description="Capture a thought, decision, note, or reusable knowledge item without navigating the full object model." className="span-12">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short title" />
            </div>
            <div className="form-field">
              <label>Save As</label>
              <select value={captureType} onChange={(event) => setCaptureType(event.target.value)}>
                <option value="memory">Memory</option>
                <option value="knowledge">Knowledge Asset</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Content</label>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write the note, decision, rule, or useful context." style={{ minHeight: "260px" }} />
          </div>

          <div className="form-field">
            <label>Tags</label>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="comma,separated,tags" />
          </div>

          <div className="toolbar">
            <button className="button" type="submit">Save Capture</button>
            {message ? <span className={message.includes("Could not") ? "error" : "success"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>
    </section>
  );
}
