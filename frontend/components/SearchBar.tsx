"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSearch: (query: string) => Promise<void>;
  loading: boolean;
};

export function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim().length < 2) return;
    await onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search topic: transformers, RAG, graph neural networks..."
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition-colors duration-200 focus:ring-2 focus:ring-slate-400 dark:border-white dark:bg-[#1b1c1c] dark:text-slate-100 dark:placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:border dark:border-white dark:bg-[#1b1c1c] dark:text-slate-100 dark:hover:bg-[#252626]"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
