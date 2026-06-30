"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionTemplate, Project } from "@/lib/api";

type Tab =
  | "chat"
  | "home"
  | "actions"
  | "actionBuilder"
  | "rag"
  | "search"
  | "quickCapture"
  | "settings"
  | "projects"
  | "datasets"
  | "businessRules"
  | "promptTemplates"
  | "memories"
  | "knowledgeAssets"
  | "integrations"
  | "backup";

export function CommandPalette({
  actions,
  projects,
  onSelectTab,
}: {
  actions: ActionTemplate[];
  projects: Project[];
  onSelectTab: (tab: Tab) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands = useMemo(() => {
    const base = [
      { label: "Chat with Ollama", tab: "chat" as Tab },
      { label: "Go to Home", tab: "home" as Tab },
      { label: "Run Actions", tab: "actions" as Tab },
      { label: "Quick Capture", tab: "quickCapture" as Tab },
      { label: "Ask Knowledge Base", tab: "rag" as Tab },
      { label: "Search", tab: "search" as Tab },
      { label: "Settings", tab: "settings" as Tab },
      { label: "Backup", tab: "backup" as Tab },
    ];

    const actionCommands = actions.map((action) => ({
      label: `Run action: ${action.name}`,
      tab: "actions" as Tab,
    }));

    const projectCommands = projects.map((project) => ({
      label: `Open project list: ${project.name}`,
      tab: "projects" as Tab,
    }));

    return [...base, ...actionCommands, ...projectCommands];
  }, [actions, projects]);

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  if (!open) {
    return null;
  }

  return (
    <div className="command-backdrop" onClick={() => setOpen(false)}>
      <div className="command-panel" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search commands, actions, projects..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="command-list">
          {filtered.slice(0, 12).map((command) => (
            <button
              key={command.label}
              onClick={() => {
                onSelectTab(command.tab);
                setOpen(false);
                setQuery("");
              }}
            >
              {command.label}
            </button>
          ))}
        </div>
        <p>Shortcut: Ctrl+K · Esc to close</p>
      </div>
    </div>
  );
}
