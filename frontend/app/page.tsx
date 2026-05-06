"use client";

import { useEffect, useState } from "react";

import { GraphView } from "@/components/GraphView";
import { InsightPanel } from "@/components/InsightPanel";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PaperList } from "@/components/PaperList";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { searchTopic } from "@/services/api";
import { SearchResponse } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("cne-theme");
    const shouldUseDark = storedTheme === "dark";
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("cne-theme", next ? "dark" : "light");
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchTopic(query);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      {loading ? <LoadingOverlay /> : null}

      <header className="fade-up mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Citation Network Explorer</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Explore scientific literature through citation graphs and semantic similarity.
          </p>
        </div>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </header>

      <div className="fade-up mb-6" style={{ animationDelay: "60ms" }}>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {error ? (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>
      ) : null}

      {!data ? (
        <p className="fade-up rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 transition-colors duration-300 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300">
          Start by searching a research topic.
        </p>
      ) : (
        <div key={data.query} className="fade-up grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="fade-up">
              <GraphView nodes={data.graph_nodes} edges={data.graph_edges} isDark={isDark} />
            </div>
            <div className="fade-up" style={{ animationDelay: "70ms" }}>
              <PaperList papers={data.papers} influentialIds={data.influential_papers} />
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay: "110ms" }}>
            <InsightPanel
              influentialIds={data.influential_papers}
              recommendations={data.recommendations}
              insights={data.insights}
            />
          </div>
        </div>
      )}
    </main>
  );
}
