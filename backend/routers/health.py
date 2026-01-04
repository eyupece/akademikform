"""
Health Check Router
Sistem sağlık kontrolü endpoint'leri
"""

from fastapi import APIRouter, status
from datetime import datetime
from config.settings import settings

router = APIRouter(
    prefix="/api/v1",
    tags=["Health"]
)


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Sağlık kontrolü",
    description="Backend servisinin çalışıp çalışmadığını kontrol eder"
)
async def health_check():
    """
    Backend servisinin sağlık kontrolü.
    
    Returns:
        dict: Servis durumu ve bilgileri
    """
    return {
        "status": "healthy",
        "service": "akademikform-api",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT,
    }


@router.get(
    "/ready",
    status_code=status.HTTP_200_OK,
    summary="Hazırlık kontrolü",
    description="Servisin istekleri kabul etmeye hazır olup olmadığını kontrol eder"
)
async def readiness_check():
    """
    Readiness probe - Kubernetes ve deployment için.
    
    Returns:
        dict: Hazırlık durumu
    """
    # Burada database bağlantısı, external API'ler vb. kontrol edilebilir
    checks = {
        "api": "ready",
        "google_ai": "configured" if settings.GOOGLE_API_KEY else "not_configured",
        # Arkadaşınız ekleyecek:
        # "database": "connected" if check_db() else "disconnected",
        # "supabase": "connected" if check_supabase() else "disconnected",
    }
    
    all_ready = all(v in ["ready", "configured", "connected"] for v in checks.values())
    
    return {
        "status": "ready" if all_ready else "not_ready",
        "checks": checks,
        "timestamp": datetime.now().isoformat(),
    }


@router.get(
    "/live",
    status_code=status.HTTP_200_OK,
    summary="Liveness probe",
    description="Servisin çalışır durumda olup olmadığını kontrol eder"
)
async def liveness_check():
    """
    Liveness probe - Kubernetes için.
    Servis donmuş veya crash olmuş mu kontrol eder.
    
    Returns:
        dict: Liveness durumu
    """
    return {
        "status": "alive",
        "timestamp": datetime.now().isoformat(),
    }

