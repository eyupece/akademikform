"""
Uygulama ayarları ve konfigürasyon
Environment variable'ları yönetir
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Uygulama konfigürasyonu
    .env dosyasından environment variable'ları okur
    """
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Google AI (Gemini)
    GOOGLE_API_KEY: str = ""
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Supabase (Arkadaşınız ekleyecek)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None
    
    # JWT (Arkadaşınız ekleyecek)
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 30
    
    # Database (Arkadaşınız ekleyecek)
    DATABASE_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()


# Debug info
if __name__ == "__main__":
    print("=== SETTINGS ===")
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Google API Key: {'✓ Set' if settings.GOOGLE_API_KEY else '✗ Not set'}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")
    print(f"Supabase URL: {'✓ Set' if settings.SUPABASE_URL else '✗ Not set'}")

