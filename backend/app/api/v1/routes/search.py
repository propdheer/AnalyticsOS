from fastapi import APIRouter

from app.services.search_service import GlobalSearchResult, global_search

router = APIRouter()


@router.get("")
def search(q: str) -> list[GlobalSearchResult]:
    return global_search(q)
