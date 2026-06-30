from fastapi import APIRouter, HTTPException

from app.domain.knowledge_assets import KnowledgeAsset, KnowledgeSearchResult
from app.services.knowledge_service import create_asset, delete_asset, get_asset, list_assets, search_assets

router = APIRouter()


@router.get("")
def get_knowledge_assets() -> list[KnowledgeAsset]:
    return list_assets()


@router.get("/search")
def search_knowledge_assets(q: str) -> list[KnowledgeSearchResult]:
    return search_assets(q)


@router.get("/{asset_id}")
def get_knowledge_asset_by_id(asset_id: str) -> KnowledgeAsset:
    asset = get_asset(asset_id)
    if asset is None:
        raise HTTPException(status_code=404, detail="Knowledge asset not found")
    return asset


@router.post("")
def post_knowledge_asset(asset: KnowledgeAsset) -> KnowledgeAsset:
    return create_asset(asset)


@router.delete("/{asset_id}")
def delete_knowledge_asset_by_id(asset_id: str) -> dict[str, bool]:
    deleted = delete_asset(asset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Knowledge asset not found")
    return {"deleted": True}
