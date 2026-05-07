from __future__ import annotations

import math
import re
from collections import Counter
from typing import List

from app.models.paper import Paper, Recommendation


class SimilarPaperRecommender:
    _token_pattern = re.compile(r"[a-zA-Z]{3,}")

    def _tokenize(self, text: str) -> list[str]:
        return [token.lower() for token in self._token_pattern.findall(text)]

    def _tfidf_vector(self, tokens: list[str], idf_map: dict[str, float]) -> dict[str, float]:
        if not tokens:
            return {}
        counts = Counter(tokens)
        total = len(tokens)
        return {term: (count / total) * idf_map.get(term, 0.0) for term, count in counts.items()}

    def _cosine_similarity(self, vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
        if not vec_a or not vec_b:
            return 0.0
        dot = sum(value * vec_b.get(term, 0.0) for term, value in vec_a.items())
        norm_a = math.sqrt(sum(value * value for value in vec_a.values()))
        norm_b = math.sqrt(sum(value * value for value in vec_b.values()))
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        return dot / (norm_a * norm_b)

    def recommend(self, query: str, papers: List[Paper], top_k: int = 5) -> List[Recommendation]:
        if not papers:
            return []

        try:
            # Pure-Python TF-IDF + cosine keeps startup stable on lightweight hosts.
            paper_texts = [f"{paper.title}. {paper.abstract}".strip() for paper in papers]
            tokenized_docs = [self._tokenize(text) for text in paper_texts]
            query_tokens = self._tokenize(query)
            all_docs = tokenized_docs + [query_tokens]

            doc_count = len(all_docs)
            document_frequency: Counter[str] = Counter()
            for tokens in all_docs:
                document_frequency.update(set(tokens))

            idf_map = {term: math.log((1 + doc_count) / (1 + freq)) + 1.0 for term, freq in document_frequency.items()}
            query_vector = self._tfidf_vector(query_tokens, idf_map)
            relevance_scores = [
                self._cosine_similarity(self._tfidf_vector(tokens, idf_map), query_vector) for tokens in tokenized_docs
            ]

            max_citations = max((paper.cited_by_count for paper in papers), default=1)
            citation_scores = [paper.cited_by_count / max_citations if max_citations > 0 else 0.0 for paper in papers]

            # Blend semantic relevance and citation strength for robust ranking.
            final_scores = [(0.75 * relevance_scores[idx]) + (0.25 * citation_scores[idx]) for idx in range(len(papers))]
        except Exception:
            # Keep API responsive even when ML scoring fails.
            return []

        ranked = sorted(
            [(papers[idx].id, float(score)) for idx, score in enumerate(final_scores)],
            key=lambda item: item[1],
            reverse=True,
        )
        return [Recommendation(paper_id=paper_id, score=score) for paper_id, score in ranked[:top_k]]
