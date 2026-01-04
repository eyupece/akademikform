"""
AkademikForm API - FastAPI Backend
AI Destekli Akademik Doküman Editörü
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Routers
from routers import health, templates, projects, sections, debug, ai

app = FastAPI(
    title="AkademikForm API",
    description="""
    ## 🎓 AI Destekli Akademik Doküman Editörü
    
    Bu API ile:
    - 📄 **Şablonlar**: TÜBİTAK 2209-A gibi hazır şablonlara erişin
    - 📁 **Projeler**: Akademik projelerinizi oluşturun ve yönetin
    - ✍️ **Bölümler**: Proje bölümlerinizi düzenleyin
    - 🤖 **AI Desteği**: Google Gemini ile akademik metin üretin
    - 📤 **Export**: DOCX ve PDF formatlarında dışa aktarın
    
    ### 🚀 Başlangıç:
    1. Şablonları listeleyin: `GET /api/v1/templates`
    2. Yeni proje oluşturun: `POST /api/v1/projects`
    3. AI ile metin üretin: `POST /api/v1/sections/{id}/generate`
    
    ### 📚 Dokümantasyon:
    - **Swagger UI**: [/docs](/docs)
    - **ReDoc**: [/redoc](/redoc)
    - **OpenAPI JSON**: [/openapi.json](/openapi.json)
    """,
    version="1.0.0",
    contact={
        "name": "AkademikForm Takımı",
        "email": "info@akademikform.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# CORS Middleware (Frontend bağlantısı için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, PATCH, vb.
    allow_headers=["*"],  # Content-Type, Authorization, vb.
)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    API'nin çalışıp çalışmadığını kontrol eder.
    """
    return {
        "message": "🎓 AkademikForm API çalışıyor!",
        "status": "active",
        "version": "1.0.0",
        "docs": "/docs",
    }


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Sağlık kontrolü endpoint'i.
    Monitoring ve deployment için kullanılır.
    """
    return {
        "status": "healthy",
        "service": "akademikform-api",
    }


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global hata yakalayıcı.
    Tüm beklenmeyen hataları yakalar ve JSON formatında döner.
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            "details": str(exc) if app.debug else None,
        },
    )


# Routers'ları ekle
app.include_router(health.router)
app.include_router(templates.router)
app.include_router(projects.router)
app.include_router(sections.router)
app.include_router(ai.router)  # Generic AI endpoint'leri
app.include_router(debug.router)  # Debug endpoint'leri (sadece development için)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Development için auto-reload
    )

