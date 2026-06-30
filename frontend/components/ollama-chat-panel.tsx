"use client";

import { useEffect, useState } from "react";
import { ChatMessage, chatWithOllama, getAiModels } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";

export function OllamaChatPanel() {
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("");
  const [useKnowledge, setUseKnowledge] = useState(true);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [contextItems, setContextItems] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getAiModels()
      .then((payload) => {
        setModels(payload.models);
        setModel(payload.models[0] ?? payload.default_model ?? "");
      })
      .catch(() => setStatus("Could not fetch Ollama models. Check Settings or start Ollama."));
  }, []);

  async function refreshModels() {
    try {
      const payload = await getAiModels();
      setModels(payload.models);
      setModel(payload.models[0] ?? payload.default_model ?? "");
      setStatus(payload.models.length ? "Models refreshed." : "No downloaded Ollama models found.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not refresh models.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: message };
    const nextHistory = [...history, userMessage];
    setHistory(nextHistory);
    setMessage("");
    setStatus("Thinking...");

    try {
      const response = await chatWithOllama({
        message: userMessage.content,
        model,
        use_knowledge: useKnowledge,
        history: history.slice(-6),
        max_context_items: 8,
      });

      setHistory([...nextHistory, { role: "assistant", content: response.answer }]);
      setContextItems(response.context_items ?? []);
      setStatus(response.used_knowledge ? `Answered using ${response.model} with AnalyticsOS context.` : `Answered using ${response.model}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Chat failed.");
    }
  }

  async function copyLatest() {
    const latest = [...history].reverse().find((item) => item.role === "assistant");
    if (!latest) return;
    await navigator.clipboard.writeText(latest.content);
    setStatus("Copied latest answer.");
  }

  function clearChat() {
    setHistory([]);
    setContextItems([]);
    setStatus("");
  }

  return (
    <section className="grid">
      <DashboardCard title="Chat with Ollama" description="Ask your local model. Optionally include AnalyticsOS search context from projects, rules, memories, actions, and knowledge assets." className="span-8">
        <div className="chat-window">
          {history.length === 0 ? (
            <div className="chat-empty">
              <strong>Start with a question or task.</strong>
              <p>Examples: “Create an adoption update”, “Summarize my AnalyticsOS roadmap”, “Draft a stakeholder email”, or “What should I do next?”</p>
            </div>
          ) : null}

          {history.map((item, index) => (
            <div className={`chat-message ${item.role}`} key={`${item.role}-${index}`}>
              <div className="chat-role">{item.role === "user" ? "You" : "AnalyticsOS"}</div>
              <div className="chat-content">{item.content}</div>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Ollama anything..." />
          <div className="toolbar">
            <button className="button" type="submit">Send</button>
            <button className="button" type="button" onClick={() => void copyLatest()}>Copy Latest</button>
            <button className="button" type="button" onClick={clearChat}>Clear</button>
            {status ? <span className={status.includes("failed") || status.includes("Could not") || status.includes("Request failed") ? "error" : "success"}>{status}</span> : null}
          </div>
        </form>
      </DashboardCard>

      <DashboardCard title="Chat Settings" className="span-4">
        <div className="form">
          <div className="form-field">
            <label>Ollama Model</label>
            <select value={model} onChange={(event) => setModel(event.target.value)} disabled={models.length === 0}>
              {models.length === 0 ? <option value="">No local models found</option> : models.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={useKnowledge} onChange={(event) => setUseKnowledge(event.target.checked)} />
            Use AnalyticsOS knowledge base
          </label>

          <button className="button" type="button" onClick={() => void refreshModels()}>Refresh Models</button>

          <div className="notice">
            <strong>Knowledge mode</strong>
            <p>When enabled, AnalyticsOS searches your local projects, datasets, business rules, memories, prompt templates, action outputs, and knowledge assets, then sends the most relevant context to Ollama.</p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Context Used" description="These are the AnalyticsOS items passed into the model for the latest response." className="span-12">
        <pre className="output-block">{contextItems.length ? JSON.stringify(contextItems, null, 2) : "No context used yet."}</pre>
      </DashboardCard>
    </section>
  );
}
