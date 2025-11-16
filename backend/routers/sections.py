"""
Sections Router
Proje bölümlerini düzenleme ve AI ile metin üretme
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.gemini import generate_text, revise_text
from data.mock_projects import get_project_by_id, get_mock_user_id, MOCK_PROJECTS
from datetime import datetime


router = APIRouter(prefix="/api/v1/sections", tags=["Sections"])


# --- Request Models ---

class UpdateSectionRequest(BaseModel):
    """Bölüm draft_content güncelleme request"""
    draft_content: str


class GenerateRequest(BaseModel):
    """AI metin üretme request"""
    draft_content: str
    style: str = "Akademik, bilimsel ve profesyonel"
    additional_instructions: str = ""


class ReviseRequest(BaseModel):
    """AI metin revizyonu request"""
    current_content: str
    revision_prompt: str
    style: str = "Akademik, bilimsel ve profesyonel"


class AcceptContentRequest(BaseModel):
    """AI önerisini kabul etme request"""
    content: str


# --- Helper Functions ---

def get_section_from_project(project_id: str, section_id: str, user_id: str):
    """
    Proje içinden section'ı bulur
    
    Returns:
        tuple: (project, section) veya (None, None) if not found
    """
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None, None
    
    section = None
    for sec in project.get("sections", []):
        if sec["id"] == section_id:
            section = sec
            break
    
    return project, section


def get_template_section_limits(section_title: str):
    """
    Section başlığına göre min/max kelime limitlerini döndürür
    Gerçek uygulamada template'den alınacak
    """
    # Basit bir mapping, gerçekte template'den gelecek
    limits = {
        "Projenin Özeti": {"min": 25, "max": 450},
        "Araştırma Önerisinin Bilimsel Niteliği": {"min": 0, "max": 0},
        "Projenin Yönetimi": {"min": 100, "max": 800},
        "Projenin Geniş Etkisi": {"min": 50, "max": 500},
    }
    return limits.get(section_title, {"min": 0, "max": 0})


# --- Endpoints ---

@router.patch("/{section_id}")
async def update_section(section_id: str, request: UpdateSectionRequest):
    """
    ✏️ Bölüm taslağını (draft_content) günceller
    
    Args:
        section_id: Section ID'si
        request: Yeni draft_content
        
    Returns:
        dict: Güncellenmiş section
        
    Raises:
        HTTPException: Section bulunamazsa 404 hatası
    """
    user_id = get_mock_user_id()
    
    # Section'ı bul
    found_section = None
    found_project = None
    
    for project in MOCK_PROJECTS.values():
        if project["user_id"] != user_id:
            continue
        
        for section in project.get("sections", []):
            if section["id"] == section_id:
                found_section = section
                found_project = project
                break
        
        if found_section:
            break
    
    if not found_section:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "section_not_found",
                "message": f"'{section_id}' ID'li bölüm bulunamadı."
            }
        )
    
    # Güncelle
    found_section["draft_content"] = request.draft_content
    found_section["updated_at"] = datetime.utcnow().isoformat() + "Z"
    
    return found_section


@router.post("/{section_id}/generate")
async def generate_section_content(section_id: str, request: GenerateRequest):
    """
    🤖 AI ile metin üretir veya iyileştirir
    
    Args:
        section_id: Section ID'si
        request: draft_content, style, additional_instructions
        
    Returns:
        dict: {"generated_content": str}
        
    Raises:
        HTTPException: Section bulunamazsa 404 hatası veya AI hatası
    """
    user_id = get_mock_user_id()
    
    # Section'ı bul
    found_section = None
    found_project = None
    
    for project in MOCK_PROJECTS.values():
        if project["user_id"] != user_id:
            continue
        
        for section in project.get("sections", []):
            if section["id"] == section_id:
                found_section = section
                found_project = project
                break
        
        if found_section:
            break
    
    if not found_section:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "section_not_found",
                "message": f"'{section_id}' ID'li bölüm bulunamadı."
            }
        )
    
    # Template limits
    limits = get_template_section_limits(found_section["title"])
    
    try:
        # AI ile metin üret
        result = await generate_text(
            draft_content=request.draft_content,
            section_title=found_section["title"],
            project_title=found_project["title"],
            style=request.style,
            min_words=limits["min"],
            max_words=limits["max"],
            additional_instructions=request.additional_instructions
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "ai_generation_failed",
                "message": f"AI metin üretimi başarısız: {str(e)}"
            }
        )


@router.post("/{section_id}/revise")
async def revise_section_content(section_id: str, request: ReviseRequest):
    """
    🔄 Mevcut AI önerisini kullanıcı talimatıyla revize eder
    
    Args:
        section_id: Section ID'si
        request: current_content, revision_prompt, style
        
    Returns:
        dict: {"generated_content": str}
        
    Raises:
        HTTPException: Section bulunamazsa 404 hatası veya AI hatası
    """
    user_id = get_mock_user_id()
    
    # Section'ı bul
    found_section = None
    found_project = None
    
    for project in MOCK_PROJECTS.values():
        if project["user_id"] != user_id:
            continue
        
        for section in project.get("sections", []):
            if section["id"] == section_id:
                found_section = section
                found_project = project
                break
        
        if found_section:
            break
    
    if not found_section:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "section_not_found",
                "message": f"'{section_id}' ID'li bölüm bulunamadı."
            }
        )
    
    # Template limits
    limits = get_template_section_limits(found_section["title"])
    
    try:
        # AI ile metni revize et
        result = await revise_text(
            current_content=request.current_content,
            revision_prompt=request.revision_prompt,
            section_title=found_section["title"],
            project_title=found_project["title"],
            style=request.style,
            min_words=limits["min"],
            max_words=limits["max"]
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "ai_revision_failed",
                "message": f"AI revizyonu başarısız: {str(e)}"
            }
        )


@router.post("/{section_id}/accept")
async def accept_section_content(section_id: str, request: AcceptContentRequest):
    """
    ✅ AI önerisini kabul eder ve final_content olarak kaydeder
    
    Args:
        section_id: Section ID'si
        request: Kabul edilen içerik
        
    Returns:
        dict: Güncellenmiş section (revizyon bilgisiyle birlikte)
        
    Raises:
        HTTPException: Section bulunamazsa 404 hatası
    """
    user_id = get_mock_user_id()
    
    # Section'ı bul
    found_section = None
    found_project = None
    
    for project in MOCK_PROJECTS.values():
        if project["user_id"] != user_id:
            continue
        
        for section in project.get("sections", []):
            if section["id"] == section_id:
                found_section = section
                found_project = project
                break
        
        if found_section:
            break
    
    if not found_section:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "section_not_found",
                "message": f"'{section_id}' ID'li bölüm bulunamadı."
            }
        )
    
    # final_content'i güncelle
    found_section["final_content"] = request.content
    found_section["updated_at"] = datetime.utcnow().isoformat() + "Z"
    
    # Revision oluştur (basit mock)
    revision = {
        "id": f"rev-{section_id}-{int(datetime.utcnow().timestamp())}",
        "section_id": section_id,
        "content": request.content,
        "revision_number": 1,  # Basitleştirilmiş, gerçekte revision sayısını tutmalıyız
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    
    return {
        **found_section,
        "revision": revision
    }


@router.get("/{section_id}/revisions")
async def get_section_revisions(section_id: str):
    """
    📚 Bölümün revizyon geçmişini getirir
    
    Args:
        section_id: Section ID'si
        
    Returns:
        dict: {"revisions": [...], "total": int}
        
    Raises:
        HTTPException: Section bulunamazsa 404 hatası
    """
    user_id = get_mock_user_id()
    
    # Section'ı bul
    found_section = None
    
    for project in MOCK_PROJECTS.values():
        if project["user_id"] != user_id:
            continue
        
        for section in project.get("sections", []):
            if section["id"] == section_id:
                found_section = section
                break
        
        if found_section:
            break
    
    if not found_section:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "section_not_found",
                "message": f"'{section_id}' ID'li bölüm bulunamadı."
            }
        )
    
    # Mock revisions (gerçek uygulamada database'den gelecek)
    revisions = []
    
    # Eğer final_content varsa, bir revizyon oluştur
    if found_section.get("final_content"):
        revisions.append({
            "id": f"rev-{section_id}-1",
            "section_id": section_id,
            "content": found_section["final_content"],
            "revision_number": 1,
            "created_at": found_section["updated_at"]
        })
    
    return {
        "revisions": revisions,
        "total": len(revisions)
    }

