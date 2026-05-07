from __future__ import annotations

from functools import lru_cache
from typing import Any, List

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import get_settings
from app.models.paper import Paper, Recommendation


@lru_cache
def get_embedding_model() -> Any:
    # Import lazily so app startup/healthcheck doesn't depend on ML model boot.
    from sentence_transformers import SentenceTransformer

    settings = get_settings()
    return SentenceTransformer(settings.embedding_model_name)


class SimilarPaperRecommender:
    def recommend(self, papers: List[Paper], top_k: int = 5) -> List[Recommendation]:
        if len(papers) < 2:
            return []

        try:
            texts = [f"{paper.title}. {paper.abstract}" for paper in papers]
            embeddings = get_embedding_model().encode(texts)
            centroid = np.mean(embeddings, axis=0, keepdims=True)
            scores = cosine_similarity(embeddings, centroid).flatten()
        except Exception:
            # Keep API responsive even when embedding stack is unavailable.
            return []

        ranked = sorted(
            [(papers[idx].id, float(score)) for idx, score in enumerate(scores)],
            key=lambda item: item[1],
            reverse=True,
        )
        return [Recommendation(paper_id=paper_id, score=score) for paper_id, score in ranked[:top_k]]
