# 🚀 AkademikForm API - Backend

AI Destekli Akademik Doküman Editörü Backend API (FastAPI)

## 📋 İçindekiler

- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Klasör Yapısı](#klasör-yapısı)
- [Environment Variables](#environment-variables)

---

## 🔧 Kurulum

### 1. Virtual Environment Oluştur

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Bağımlılıkları Kur

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Backend klasöründe `.env` dosyası oluşturun:

```bash
# backend/.env
# Google Gemini API Key
# Buradan alın: https://aistudio.google.com/apikey
GOOGLE_API_KEY=your-api-key-here

# Environment
ENVIRONMENT=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**🔑 Google API Key Alma:**
1. https://aistudio.google.com/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. Oluşan key'i kopyalayıp `.env` dosyasına yapıştırın

---

## 🚀 Çalıştırma

### Development Mode (Auto-reload)

```bash
uvicorn main:app --reload
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Python ile Direkt

```bash
python main.py
```

---

## 📚 API Dokümantasyonu

Backend çalıştıktan sonra:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## 📁 Klasör Yapısı

```
backend/
├── main.py                 # FastAPI uygulaması
├── requirements.txt        # Python bağımlılıkları
├── .env                   # Environment variables (git'e eklenmez)
├── .env.example           # Environment template
├── .gitignore             # Git ignore kuralları
│
├── config/
│   ├── __init__.py
│   └── settings.py        # Konfigürasyon ayarları
│
├── routers/               # API endpoint'leri
│   ├── __init__.py
│   ├── health.py         # Health check
│   ├── templates.py      # Template endpoints
│   ├── projects.py       # Project CRUD
│   └── sections.py       # Section CRUD + AI
│
├── services/              # İş mantığı
│   ├── __init__.py
│   ├── gemini.py         # Google Gemini AI
│   └── mock_data.py      # Test data
│
├── models/                # Pydantic şemaları
│   ├── __init__.py
│   ├── project.py        # Project models
│   ├── section.py        # Section models
│   └── template.py       # Template models
│
└── utils/                 # Yardımcı fonksiyonlar
    ├── __init__.py
    └── helpers.py        # Helper functions
```

---

## 🔑 Environment Variables

### Gerekli

- `GOOGLE_API_KEY`: Google AI Studio API key ([Buradan alın](https://aistudio.google.com/apikey))

### Opsiyonel (Arkadaşınız ekleyecek)

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon key
- `JWT_SECRET_KEY`: JWT için secret key

---

## 🧪 Test

### Health Check

```bash
curl http://localhost:8000/health
```

### Swagger'da Test

1. http://localhost:8000/docs adresine git
2. Endpoint'e tıkla
3. "Try it out" butonuna tıkla
4. "Execute" ile test et

---

## 📦 Bağımlılıklar

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Google Generative AI**: Gemini AI

---

## 🤝 Geliştirme

### Yeni Router Eklemek

1. `routers/` klasöründe yeni dosya oluştur
2. Router'ı oluştur ve endpoint'leri ekle
3. `main.py`'de router'ı import et ve include et

```python
# routers/yeni_router.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/yeni", tags=["Yeni"])

@router.get("/")
async def get_yeni():
    return {"message": "Yeni endpoint"}

# main.py
from routers import yeni_router
app.include_router(yeni_router.router)
```

---

## 🐛 Troubleshooting

### Port zaten kullanımda

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Module not found

```bash
pip install -r requirements.txt --upgrade
```

---

## 📝 Notlar

- ⚠️ `.env` dosyasını **asla** git'e eklemeyin
- 🔐 API key'leri güvenli tutun
- 📊 Swagger UI her endpoint değişikliğinde otomatik güncellenir
- 🔄 `--reload` flag'i development için otomatik yenileme sağlar

---

## 🆘 Yardım

Hata veya soru için:
- GitHub Issues
- Email: info@akademikform.com

---

**Versiyon:** 1.0.0  
**Son Güncelleme:** 2024-11-15

