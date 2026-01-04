"""
Generic AI Router
Section'dan bağımsız AI metin üretme ve revizyon için
Wide Impact, Scientific Merit gibi özel alanlar için kullanılır
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.gemini import generate_text, revise_text


router = APIRouter(prefix="/api/v1/ai", tags=["AI"])


# --- Request Models ---

class GenericGenerateRequest(BaseModel):
    """Generic AI metin üretme request"""
    content: str
    style: str = "Akademik, bilimsel ve profesyonel"
    additional_instructions: str = ""
    context: Optional[Dict[str, Any]] = None  # Opsiyonel context bilgisi


class GenericReviseRequest(BaseModel):
    """Generic AI metin revizyonu request"""
    current_content: str
    revision_prompt: str
    style: str = "Akademik, bilimsel ve profesyonel"
    context: Optional[Dict[str, Any]] = None  # Opsiyonel context bilgisi


# --- Response Models ---

class AIResponse(BaseModel):
    """AI response"""
    generated_content: str


# --- Endpoints ---

@router.post("/generate", response_model=AIResponse)
async def generate_generic_ai(request: GenericGenerateRequest):
    """
    Generic AI metin üretimi
    
    Section ID'ye ihtiyaç duymadan AI metin üretir.
    Wide Impact, Scientific Merit gibi section olmayan alanlar için kullanılır.
    
    Args:
        request: GenericGenerateRequest
            - content: Kullanıcının taslak metni
            - style: Yazım stili
            - additional_instructions: Ek talimatlar
            - context: Opsiyonel context (field_type, project_id, vb.)
    
    Returns:
        AIResponse: generated_content
    
    Example:
        POST /api/v1/ai/generate
        {
            "content": "Robotlar üzerine araştırma yapacağız",
            "style": "Akademik, bilimsel",
            "additional_instructions": "",
            "context": {
                "field_type": "wide_impact",
                "category": "Bilimsel/Akademik Çıktılar"
            }
        }
    """
    try:
        # Context bilgisinden field type al (varsa)
        field_type = ""
        if request.context:
            field_type = request.context.get("field_type", "")
            
        # Section title için context bilgisini kullan
        section_title = "Generic Content"
        if field_type == "scientific_merit_1_1":
            section_title = "Konunun Önemi ve Araştırma Önerisinin Bilimsel Niteliği"
        elif field_type == "scientific_merit_1_2":
            section_title = "Amaç ve Hedefler"
        elif field_type == "wide_impact":
            category = request.context.get("category", "") if request.context else ""
            section_title = f"Yaygın Etki - {category}"
        
        # AI metin üretimi
        result = await generate_text(
            draft_content=request.content,
            section_title=section_title,
            project_title="",
            style=request.style,
            additional_instructions=request.additional_instructions
        )
        
        # generate_text dict döndürüyor: {"generated_content": "..."}
        return AIResponse(generated_content=result["generated_content"])
    
    except Exception as e:
        print(f"❌ Generic AI generation error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI metin üretimi sırasında bir hata oluştu: {str(e)}"
        )


@router.post("/revise", response_model=AIResponse)
async def revise_generic_ai(request: GenericReviseRequest):
    """
    Generic AI metin revizyonu
    
    Section ID'ye ihtiyaç duymadan mevcut metni revize eder.
    
    Args:
        request: GenericReviseRequest
            - current_content: Mevcut metin
            - revision_prompt: Revizyon talimatı ("Daha kısa yaz", vb.)
            - style: Yazım stili
            - context: Opsiyonel context
    
    Returns:
        AIResponse: generated_content (revize edilmiş metin)
    
    Example:
        POST /api/v1/ai/revise
        {
            "current_content": "Bu araştırma robotlar hakkındadır...",
            "revision_prompt": "Daha akademik ve detaylı yaz",
            "style": "Akademik, bilimsel",
            "context": {
                "field_type": "wide_impact"
            }
        }
    """
    try:
        # Context bilgisinden field type al (varsa)
        field_type = ""
        if request.context:
            field_type = request.context.get("field_type", "")
            
        # Section title için context bilgisini kullan
        section_title = "Generic Content"
        if field_type == "scientific_merit_1_1":
            section_title = "Konunun Önemi ve Araştırma Önerisinin Bilimsel Niteliği"
        elif field_type == "scientific_merit_1_2":
            section_title = "Amaç ve Hedefler"
        elif field_type == "wide_impact":
            category = request.context.get("category", "") if request.context else ""
            section_title = f"Yaygın Etki - {category}"
        
        # AI metin revizyonu
        result = await revise_text(
            current_content=request.current_content,
            section_title=section_title,
            project_title="",
            revision_prompt=request.revision_prompt,
            style=request.style
        )
        
        # revise_text dict döndürüyor: {"generated_content": "..."}
        return AIResponse(generated_content=result["generated_content"])
    
    except Exception as e:
        print(f"❌ Generic AI revision error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI metin revizyonu sırasında bir hata oluştu: {str(e)}"
        )




