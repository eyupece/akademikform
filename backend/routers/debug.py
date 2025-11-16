"""
Debug Router
Geliştirme ve test için yardımcı endpoint'ler
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import google.generativeai as genai
from config.settings import settings

router = APIRouter(prefix="/api/v1/debug", tags=["Debug"])


@router.get("/models")
async def list_available_models():
    """
    🔍 Mevcut Gemini modellerini listeler
    
    Returns:
        dict: Mevcut modeller ve özellikleri
    """
    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        # Tüm modelleri listele
        models = genai.list_models()
        
        # Model bilgilerini topla
        model_list = []
        for m in models:
            model_info = {
                "name": m.name,
                "display_name": m.display_name,
                "description": m.description,
                "supported_generation_methods": list(m.supported_generation_methods),
                "input_token_limit": m.input_token_limit if hasattr(m, 'input_token_limit') else None,
                "output_token_limit": m.output_token_limit if hasattr(m, 'output_token_limit') else None,
            }
            model_list.append(model_info)
        
        # generateContent destekleyen modelleri filtrele
        generate_models = [
            m for m in model_list 
            if 'generateContent' in m['supported_generation_methods']
        ]
        
        return {
            "total_models": len(model_list),
            "generate_content_models": len(generate_models),
            "all_models": model_list,
            "recommended_models": generate_models,
            "api_key_set": bool(settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "your-api-key-here")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "model_list_failed",
                "message": f"Model listesi alınamadı: {str(e)}",
                "hint": "API key'inizi kontrol edin: https://aistudio.google.com/apikey"
            }
        )

