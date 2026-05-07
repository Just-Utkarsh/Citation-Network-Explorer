import { SearchResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

export async function searchTopic(query: string, limit = 20): Promise<SearchResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in production.");
  }

  const url = new URL("/api/search", API_BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`);
  }
  return response.json();
}
