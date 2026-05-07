from __future__ import annotations

from typing import List

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from app.models.paper import Paper, Recommendation


class SimilarPaperRecommender:
    def recommend(self, query: str, papers: List[Paper], top_k: int = 5) -> List[Recommendation]:
        if not papers:
            return []

        try:
            # Lightweight ML ranking: TF-IDF + cosine similarity to user query.
            paper_texts = [f"{paper.title}. {paper.abstract}".strip() for paper in papers]
            vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
            matrix = vectorizer.fit_transform([query, *paper_texts])
            query_vector = matrix[0:1]
            paper_vectors = matrix[1:]
            relevance_scores = cosine_similarity(paper_vectors, query_vector).ravel()

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
