from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class PaperAuthor(BaseModel):
    name: str


class Paper(BaseModel):
    id: str
    title: str
    abstract: str = ""
    year: int | None = None
    cited_by_count: int = 0
    referenced_works: List[str] = Field(default_factory=list)
    authors: List[PaperAuthor] = Field(default_factory=list)
    concepts: List[str] = Field(default_factory=list)
    source: str | None = None
    openalex_url: str | None = None


class GraphNode(BaseModel):
    id: str
    label: str
    year: int | None = None
    citations: int = 0
    influence_score: float = 0.0


class GraphEdge(BaseModel):
    source: str
    target: str


class Recommendation(BaseModel):
    paper_id: str
    score: float


class SearchResponse(BaseModel):
    query: str
    papers: List[Paper]
    graph_nodes: List[GraphNode]
    graph_edges: List[GraphEdge]
    influential_papers: List[str]
    recommendations: List[Recommendation]
    insights: List[str]
