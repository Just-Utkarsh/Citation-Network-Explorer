from __future__ import annotations

from collections import defaultdict
from typing import Any, Dict, List

from app.graph.citation_graph import CitationGraphBuilder
from app.ml.recommender import SimilarPaperRecommender
from app.models.paper import Paper, PaperAuthor, SearchResponse
from app.services.openalex_service import OpenAlexService


def _decode_abstract(abstract_inverted_index: Dict[str, List[int]] | None) -> str:
    if not abstract_inverted_index:
        return ""

    token_positions: Dict[int, str] = {}
    for token, positions in abstract_inverted_index.items():
        for position in positions:
            token_positions[position] = token

    return " ".join(token for _, token in sorted(token_positions.items(), key=lambda item: item[0]))


class PaperSearchService:
    def __init__(self) -> None:
        self.openalex_service = OpenAlexService()
        self.graph_builder = CitationGraphBuilder()
        self.recommender = SimilarPaperRecommender()

    def normalize_paper(self, raw: Dict[str, Any]) -> Paper:
        authors = [
            PaperAuthor(name=entry.get("author", {}).get("display_name", "Unknown"))
            for entry in raw.get("authorships", [])
        ]
        concepts = [concept.get("display_name", "") for concept in raw.get("concepts", []) if concept.get("display_name")]

        primary_location = raw.get("primary_location") or {}
        source = (primary_location.get("source") or {}).get("display_name")

        return Paper(
            id=raw.get("id", ""),
            title=raw.get("display_name", "Untitled"),
            abstract=_decode_abstract(raw.get("abstract_inverted_index")),
            year=raw.get("publication_year"),
            cited_by_count=raw.get("cited_by_count", 0),
            referenced_works=raw.get("referenced_works", []),
            authors=authors,
            concepts=concepts[:6],
            source=source,
            openalex_url=raw.get("id"),
        )

    def generate_insights(self, papers: List[Paper], influential_ids: List[str]) -> List[str]:
        if not papers:
            return ["No papers found. Try a broader topic."]

        avg_citations = sum(p.cited_by_count for p in papers) / len(papers)
        years = [p.year for p in papers if p.year is not None]
        top_concepts = defaultdict(int)
        for paper in papers:
            for concept in paper.concepts:
                top_concepts[concept] += 1
        dominant_concepts = sorted(top_concepts.items(), key=lambda item: item[1], reverse=True)[:3]

        insights = [
            f"Average citation count in this set is {avg_citations:.1f}.",
            f"Most influential paper IDs in the local graph: {', '.join(influential_ids) if influential_ids else 'none'}.",
        ]
        if years:
            insights.append(f"Publication range: {min(years)} to {max(years)}.")
        if dominant_concepts:
            concepts = ", ".join(name for name, _ in dominant_concepts)
            insights.append(f"Dominant concepts: {concepts}.")
        return insights

    async def search_topic(self, query: str, limit: int = 20) -> SearchResponse:
        raw_results = await self.openalex_service.search_works(query=query, per_page=limit)
        papers = [self.normalize_paper(raw) for raw in raw_results]

        graph = self.graph_builder.build(papers)
        influential_pairs = self.graph_builder.influential_papers(graph, top_k=5)
        influence_scores = {paper_id: score for paper_id, score in influential_pairs}
        graph_nodes, graph_edges = self.graph_builder.to_serializable(graph, influence_scores)
        influential_ids = [paper_id for paper_id, _ in influential_pairs]
        recommendations = self.recommender.recommend(papers, top_k=5)
        insights = self.generate_insights(papers, influential_ids)

        return SearchResponse(
            query=query,
            papers=papers,
            graph_nodes=graph_nodes,
            graph_edges=graph_edges,
            influential_papers=influential_ids,
            recommendations=recommendations,
            insights=insights,
        )
