from __future__ import annotations

from typing import Dict, Iterable, List, Tuple

import networkx as nx

from app.models.paper import GraphEdge, GraphNode, Paper


class CitationGraphBuilder:
    def build(self, papers: Iterable[Paper]) -> nx.DiGraph:
        paper_list = list(papers)
        paper_ids = {paper.id for paper in paper_list}
        graph = nx.DiGraph()

        for paper in paper_list:
            graph.add_node(
                paper.id,
                label=paper.title,
                year=paper.year,
                citations=paper.cited_by_count,
            )
            for ref in paper.referenced_works:
                if ref in paper_ids:
                    graph.add_edge(paper.id, ref)

        return graph

    def influential_papers(self, graph: nx.DiGraph, top_k: int = 5) -> List[Tuple[str, float]]:
        if graph.number_of_nodes() == 0:
            return []
        scores = nx.pagerank(graph, alpha=0.85) if graph.number_of_edges() else {n: 1.0 for n in graph.nodes}
        return sorted(scores.items(), key=lambda item: item[1], reverse=True)[:top_k]

    def to_serializable(
        self,
        graph: nx.DiGraph,
        influence_scores: Dict[str, float],
    ) -> tuple[List[GraphNode], List[GraphEdge]]:
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []

        for node_id, attrs in graph.nodes(data=True):
            nodes.append(
                GraphNode(
                    id=node_id,
                    label=attrs.get("label", node_id),
                    year=attrs.get("year"),
                    citations=attrs.get("citations", 0),
                    influence_score=influence_scores.get(node_id, 0.0),
                )
            )

        for source, target in graph.edges():
            edges.append(GraphEdge(source=source, target=target))

        return nodes, edges
