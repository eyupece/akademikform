"""
Templates Router
Şablon listesi ve detaylarını sağlar.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from data.mock_templates import get_all_templates, get_template_by_id

router = APIRouter(prefix="/api/v1/templates", tags=["Templates"])


@router.get("/", response_model=List[Dict[str, Any]])
async def list_templates():
    """
    📋 Tüm proje şablonlarını listeler
    
    Returns:
        List[Dict]: Mevcut tüm şablonlar (TÜBİTAK 2209-A, 1001, 1003, vb.)
    """
    return get_all_templates()


@router.get("/{template_id}", response_model=Dict[str, Any])
async def get_template(template_id: str):
    """
    📄 Belirli bir şablonu getirir
    
    Args:
        template_id: Şablon ID'si (örn: tubitak-2209a)
        
    Returns:
        Dict: Şablon detayları ve bölümleri
        
    Raises:
        HTTPException: Şablon bulunamazsa 404 hatası
    """
    template = get_template_by_id(template_id)
    
    if not template:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "template_not_found",
                "message": f"'{template_id}' ID'li şablon bulunamadı."
            }
        )
    
    return template

