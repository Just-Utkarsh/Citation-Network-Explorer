import asyncio

from fastapi import APIRouter, HTTPException, Query

from app.core.config import get_settings
from app.models.paper import SearchResponse
from app.services.paper_service import PaperSearchService

router = APIRouter(prefix="/search", tags=["search"])
paper_search_service = PaperSearchService()
settings = get_settings()


@router.get("", response_model=SearchResponse)
async def search_topic(
    q: str = Query(..., min_length=2, description="Research topic query"),
    limit: int = Query(20, ge=5, le=50),
) -> SearchResponse:
    try:
        return await asyncio.wait_for(
            paper_search_service.search_topic(query=q, limit=limit),
            timeout=settings.search_timeout_seconds,
        )
    except TimeoutError as exc:
        raise HTTPException(
            status_code=504,
            detail="Search timed out while fetching papers. Please try again with a narrower query.",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Search failed: {exc}") from exc
