"use client";

import { useState } from "react";
import { RagQueryResult, queryRag, saveRagAnswer } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function RagPanel() {
  const [question, setQuestion] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [mode, setMode] = useState("query");
  const [result, setResult] = useState<RagQueryResult | null>(null);
  const [message, setMessage] = useState("");

  async function handleAsk(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!question.trim()) {
      setMessage("Question is required.");
      return;
    }

    try {
      const answer = await queryRag({
        question,
        workspace_slug: workspaceSlug,
        mode,
        session_id: "analyticsos-ui",
      });
      setResult(answer);
      setMessage("Answer received from AnythingLLM.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AnythingLLM query failed.");
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.answer);
    setMessage("Copied answer.");
  }

  async function handleSave() {
    if (!result) return;
    try {
      const asset = await saveRagAnswer({
        title: `RAG Answer - ${new Date().toISOString().slice(0, 10)}`,
        question: result.question,
        answer: result.answer,
        tags: ["rag-answer", "anythingllm"],
      });
      setMessage(`Saved as Knowledge Asset: ${asset.title}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save answer.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Ask Knowledge Base" description="Ask AnythingLLM using your configured workspace. This is the RAG layer for document-grounded answers." className="span-6">
        <form className="form" onSubmit={handleAsk}>
          <div className="form-field">
            <label>Workspace Slug</label>
            <input value={workspaceSlug} onChange={(event) => setWorkspaceSlug(event.target.value)} placeholder="Optional if configured in .env" />
          </div>

          <div className="form-field">
            <label>Mode</label>
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="query">query</option>
              <option value="chat">chat</option>
            </select>
          </div>

          <div className="form-field">
            <label>Question</label>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your documents, notes, project context, or indexed knowledge." />
          </div>

          <div className="toolbar">
            <button className="button" type="submit">Ask AnythingLLM</button>
            {message ? <span className={message.includes("failed") || message.includes("required") || message.includes("Request failed") ? "error" : "success"}>{message}</span> : null}
          </div>
        </form>
      </DashboardCard>

      <DashboardCard title="Answer" description="Save useful answers as Knowledge Assets so they become part of your AnalyticsOS memory." className="span-6">
        <div className="toolbar">
          <button className="button" onClick={() => void handleCopy()} disabled={!result}>Copy Answer</button>
          <button className="button" onClick={() => void handleSave()} disabled={!result}>Save as Knowledge</button>
        </div>
        <pre className="output-block">{result?.answer ?? "Ask AnythingLLM to see an answer here."}</pre>
      </DashboardCard>

      <DashboardCard title="Citations / Sources" className="span-12">
        <pre className="output-block">{result ? JSON.stringify(result.citations, null, 2) : "Citations will appear here when AnythingLLM returns them."}</pre>
      </DashboardCard>
    </section>
  );
}
