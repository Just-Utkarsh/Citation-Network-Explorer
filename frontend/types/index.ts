export type PaperAuthor = {
  name: string;
};

export type Paper = {
  id: string;
  title: string;
  abstract: string;
  year?: number;
  cited_by_count: number;
  referenced_works: string[];
  authors: PaperAuthor[];
  concepts: string[];
  source?: string;
  openalex_url?: string;
};

export type GraphNode = {
  id: string;
  label: string;
  year?: number;
  citations: number;
  influence_score: number;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type Recommendation = {
  paper_id: string;
  score: number;
};

export type SearchResponse = {
  query: string;
  papers: Paper[];
  graph_nodes: GraphNode[];
  graph_edges: GraphEdge[];
  influential_papers: string[];
  recommendations: Recommendation[];
  insights: string[];
};
