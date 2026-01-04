# 📊 Endpoint Analizi ve Gereksiz Endpoint Değerlendirmesi

## ✅ ENDPOINTS.md vs Backend Karşılaştırması

### ENDPOINTS.md'de Listelenen ve Backend'de Var Olanlar (19 endpoint)

| Endpoint | Method | Durum | Gerekli mi? |
|----------|--------|-------|-------------|
| `/health` | GET | ✅ Var | ✅ **Evet** - Monitoring için |
| `/api/v1/templates` | GET | ✅ Var | ✅ **Evet** - Şablon listesi |
| `/api/v1/templates/{id}` | GET | ✅ Var | ✅ **Evet** - Şablon detayı |
| `/api/v1/projects` | GET | ✅ Var | ✅ **Evet** - Proje listesi |
| `/api/v1/projects/{id}` | GET | ✅ Var | ✅ **Evet** - Proje detayı |
| `/api/v1/projects` | POST | ✅ Var | ✅ **Evet** - Yeni proje |
| `/api/v1/projects/{id}` | PATCH | ✅ Var | ✅ **Evet** - Başlık güncelle |
| `/api/v1/projects/{id}/general-info` | PATCH | ✅ Var | ✅ **Evet** - Genel bilgiler |
| `/api/v1/projects/{id}/keywords` | PATCH | ✅ Var | ✅ **Evet** - Anahtar kelimeler |
| `/api/v1/projects/{id}/scientific-merit` | PATCH | ✅ Var | ✅ **Evet** - Bilimsel nitelik |
| `/api/v1/projects/{id}/project-management` | PATCH | ✅ Var | ✅ **Evet** - Proje yönetimi |
| `/api/v1/projects/{id}/wide-impact` | PATCH | ✅ Var | ✅ **Evet** - Geniş etki |
| `/api/v1/projects/{id}` | DELETE | ✅ Var | ✅ **Evet** - Proje silme |
| `/api/v1/sections/{id}` | PATCH | ✅ Var | ✅ **Evet** - Bölüm güncelle |
| `/api/v1/sections/{id}/generate` | POST | ✅ Var | ✅ **Evet** - AI üretim |
| `/api/v1/sections/{id}/revise` | POST | ✅ Var | ✅ **Evet** - AI revizyon |
| `/api/v1/sections/{id}/accept` | POST | ✅ Var | ✅ **Evet** - AI kabul |
| `/api/v1/sections/{id}/revisions` | GET | ✅ Var | ⚠️ **Belki** - Geçmiş görüntüleme |
| `/api/v1/debug/models` | GET | ✅ Var | ⚠️ **Sadece Dev** - Debug için |

---

### Backend'de Var Ama ENDPOINTS.md'de Yok (3 endpoint)

| Endpoint | Method | Durum | Gerekli mi? |
|----------|--------|-------|-------------|
| `/` | GET | ✅ Var | ⚠️ **Opsiyonel** - Root endpoint, hoş geldin mesajı |
| `/api/v1/ready` | GET | ✅ Var | ⚠️ **Kubernetes için** - Readiness probe |
| `/api/v1/live` | GET | ✅ Var | ⚠️ **Kubernetes için** - Liveness probe |

---

### API_Contract.md'de Var Ama Backend'de Yok (1 endpoint)

| Endpoint | Method | Durum | Gerekli mi? |
|----------|--------|-------|-------------|
| `/api/v1/export` | POST | ❌ **Eksik** | ✅ **Evet** - Export özelliği için gerekli |

---

## 🤔 Gereksiz Endpoint Analizi

### 1. **GET `/api/v1/sections/{id}/revisions`** ⚠️
**Durum:** Var ama kullanımı belirsiz

**Gerekçe:**
- ✅ **Tut:** Revizyon geçmişi önemli bir özellik
- ❌ **Sil:** Frontend'de henüz kullanılmıyor, MVP için gerekli değil

**Öneri:** **MVP'de tut, sonra değerlendir**
- Kullanıcılar önceki versiyonları görmek isteyebilir
- Ama MVP için kritik değil

---

### 2. **GET `/api/v1/debug/models`** ⚠️
**Durum:** Sadece development için

**Gerekçe:**
- ✅ **Tut:** Debug için çok yararlı (model seçimi sorunlarında)
- Production'da olmamalı

**Öneri:** **Tut ama production'da devre dışı bırak**
- `ENVIRONMENT=production` ise endpoint'i gizle veya 404 döndür

---

### 3. **GET `/`** (Root endpoint) ⚠️
**Durum:** Hoş geldin mesajı

**Gerekçe:**
- ✅ **Tut:** API'nin çalıştığını kontrol etmek için basit
- ❌ **Sil:** `/health` zaten var, gereksiz olabilir

**Öneri:** **Tut** - Basit ve zararsız, API dokümantasyonu için iyi

---

### 4. **GET `/api/v1/ready` ve `/api/v1/live`** ⚠️
**Durum:** Kubernetes için health check'ler

**Gerekçe:**
- ✅ **Tut:** Production deployment için gerekli (Kubernetes, Docker, vb.)
- ❌ **Sil:** MVP'de kullanılmayabilir

**Öneri:** **Tut** - Production'a geçerken gerekli olacak

---

## 📋 Özet ve Öneriler

### ✅ **Kesinlikle Gerekli (18 endpoint)**
Tüm CRUD operasyonları, AI fonksiyonları, temel proje yönetimi

### ⚠️ **MVP'de Opsiyonel Ama Sonra Gerekli (4 endpoint)**
- `GET /api/v1/sections/{id}/revisions` - Revizyon geçmişi
- `GET /api/v1/ready` - Kubernetes readiness
- `GET /api/v1/live` - Kubernetes liveness
- `GET /` - Root endpoint

### ⚠️ **Sadece Development (1 endpoint)**
- `GET /api/v1/debug/models` - Model listesi (production'da gizle)

### ❌ **Eksik (1 endpoint)**
- `POST /api/v1/export` - **EKLENMELİ** (API_Contract.md'de var)

---

## 🎯 Sonuç ve Aksiyonlar

### 1. **Eksik Endpoint Ekle**
```
POST /api/v1/export
```
- API_Contract.md'de tanımlı
- Frontend'de mockApi'de var
- Backend'de implement edilmeli

### 2. **Gereksiz Endpoint Yok**
Tüm endpoint'ler bir amaca hizmet ediyor:
- MVP için kritik olanlar: 18 endpoint
- Production için gerekli olanlar: 3 endpoint (ready, live, root)
- Development için yararlı: 1 endpoint (debug/models)
- Gelecek için planlanan: 1 endpoint (revisions)

### 3. **Önerilen Aksiyon Planı**

#### Faz 1: MVP Test (Şimdi)
- ✅ Tüm 19 endpoint'i test et
- ✅ Export endpoint'ini ekle (20 endpoint)
- ✅ Frontend entegrasyonu

#### Faz 2: Production Hazırlığı
- ✅ Debug endpoint'ini production'da gizle
- ✅ Ready/Live endpoint'lerini test et
- ✅ Export endpoint'ini implement et

#### Faz 3: İyileştirmeler
- ✅ Revizyon geçmişi UI'ı ekle
- ✅ Prompt özelleştirmesi

---

## 🗄️ Supabase Şeması Çıktısı (Özet)

- Backend modelleri `docs/DB_Schema.md` dosyasında detaylandırılan Supabase/PostgreSQL şemasına
  aktarıldı.
- Temel varlıklar: `projects`, `sections`, `section_revisions`, `project_work_schedule`,
  `project_risk_management`, `project_research_facilities`, `project_wide_impact`, `project_exports`.
- Tüm tablolar RLS ile `auth.uid()` bazlı korunacak; kullanıcılar yalnızca kendi projelerini ve
  bağlı kayıtlarını görebilecek.
- `ai_requests` ve `project_exports` tabloları AI günlükleri ile export akışındaki backend
  endpoint'lerini izlemek için kullanılacak.
- Şema, mock API'deki alanların tamamını saklayacak şekilde tasarlandığından FastAPI katmanı
  minimum değişiklikle Supabase'e bağlanabilir.

Detaylı sütun tanımları ve örnek SQL komutları için `docs/DB_Schema.md` dosyasına bakılabilir.

## 📝 ENDPOINTS.md Güncelleme Önerisi

1. **Eksik endpoint ekle:**
   - `POST /api/v1/export` - Export endpoint'i

2. **Opsiyonel endpoint'leri işaretle:**
   - `GET /api/v1/sections/{id}/revisions` - (MVP sonrası)
   - `GET /api/v1/ready` - (Production için)
   - `GET /api/v1/live` - (Production için)
   - `GET /api/v1/debug/models` - (Sadece development)

3. **Root endpoint ekle:**
   - `GET /` - API bilgisi

