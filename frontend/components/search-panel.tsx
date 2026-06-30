"use client";

import { useState } from "react";
import { SearchResult, searchEverything } from "@/lib/api";
import { DashboardCard } from "@/components/dashboard-card";
import { ObjectList } from "@/components/object-list";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!query.trim()) return setResults([]);
    try {
      const data = await searchEverything(query);
      setResults(data);
      if (data.length === 0) setMessage("No results found.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Search failed.");
    }
  }

  return (
    <section className="grid">
      <DashboardCard title="Search Everything" description="Search projects, datasets, rules, prompts, memories, and local knowledge assets." className="span-12">
        <form className="search-box" onSubmit={handleSearch}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: AnalyticsOS, distributor, sales, markdown..." />
          <div className="toolbar"><button className="button" type="submit">Search</button>{message ? <span className="error">{message}</span> : null}</div>
        </form>
        <ObjectList emptyText="Search results will appear here." items={results.map((x) => ({ id: `${x.source}-${x.id}`, title: x.title, description: x.snippet, meta: `${x.source} · score ${x.score}` }))} />
      </DashboardCard>
    </section>
  );
}
