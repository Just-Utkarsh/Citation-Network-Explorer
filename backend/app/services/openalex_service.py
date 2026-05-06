from __future__ import annotations

from typing import Any, Dict, List

import httpx

from app.core.config import get_settings


class OpenAlexService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def search_works(self, query: str, per_page: int | None = None) -> List[Dict[str, Any]]:
        params = {
            "search": query,
            "per-page": per_page or self.settings.max_results,
            "sort": "cited_by_count:desc",
        }
        url = f"{self.settings.openalex_base_url}/works"

        async with httpx.AsyncClient(timeout=self.settings.request_timeout_seconds) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            payload = response.json()

        return payload.get("results", [])
