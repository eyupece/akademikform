# 📚 Backend Endpoints - Hızlı Referans

Bu dosya, backend'deki tüm endpoint'lerin kısa açıklamalarını içerir.

---

## 🔍 Health Check

### `GET /`
**Ne yapar:** API'nin çalışıp çalışmadığını kontrol eder (root endpoint)  
**Kullanım:** API bilgisi ve hoş geldin mesajı  
**Response:** `{"message": "🎓 AkademikForm API çalışıyor!", "status": "active", "version": "1.0.0", "docs": "/docs"}`

### `GET /health`
**Ne yapar:** API'nin çalışıp çalışmadığını kontrol eder  
**Kullanım:** Monitoring ve deployment için  
**Response:** `{"status": "healthy", "service": "akademikform-api"}`

### `GET /api/v1/ready` ⚠️ (Production için)
**Ne yapar:** Servisin istekleri kabul etmeye hazır olup olmadığını kontrol eder  
**Kullanım:** Kubernetes readiness probe için  
**Response:** `{"status": "ready", "checks": {...}, "timestamp": "..."}`

### `GET /api/v1/live` ⚠️ (Production için)
**Ne yapar:** Servisin çalışır durumda olup olmadığını kontrol eder  
**Kullanım:** Kubernetes liveness probe için  
**Response:** `{"status": "alive", "timestamp": "..."}`

---

## 📋 Templates (Şablonlar)

### `GET /api/v1/templates`
**Ne yapar:** Tüm proje şablonlarını listeler (TÜBİTAK 2209-A, 1001, 1003, vb.)  
**Kullanım:** Kullanıcı yeni proje oluştururken şablon seçmek için  
**Response:** Şablon listesi (her şablonun sections'ları dahil)

### `GET /api/v1/templates/{template_id}`
**Ne yapar:** Belirli bir şablonun detaylarını getirir  
**Kullanım:** Şablon detaylarını görmek için  
**Response:** Şablon detayları (sections, min/max kelime limitleri)

---

## 📁 Projects (Projeler)

### `GET /api/v1/projects`
**Ne yapar:** Kullanıcının tüm projelerini listeler  
**Kullanım:** Dashboard'da proje listesini göstermek için  
**Query Params:** `page`, `limit` (pagination)  
**Response:** Proje listesi (basitleştirilmiş, detay yok)

### `GET /api/v1/projects/{project_id}`
**Ne yapar:** Belirli bir projenin tüm detaylarını getirir  
**Kullanım:** Editor sayfasında projeyi açmak için  
**Response:** Proje detayları (sections, tablolar, genel bilgiler, vb.)

### `POST /api/v1/projects`
**Ne yapar:** Yeni proje oluşturur  
**Kullanım:** Kullanıcı "Yeni Proje" butonuna tıkladığında  
**Request:** `{"template_id": "tubitak-2209a", "title": "Proje Başlığı"}`  
**Response:** Oluşturulan proje (boş sections ve tablolarla)

### `PATCH /api/v1/projects/{project_id}`
**Ne yapar:** Proje başlığını günceller  
**Kullanım:** Kullanıcı proje başlığını değiştirdiğinde  
**Request:** `{"title": "Yeni Başlık"}`

### `PATCH /api/v1/projects/{project_id}/general-info`
**Ne yapar:** Genel bilgileri (A bölümü) günceller  
**Kullanım:** Kullanıcı başvuru sahibi, danışman, kurum bilgilerini girdiğinde  
**Request:** `{"applicant_name": "...", "research_title": "...", "advisor_name": "...", "institution": "..."}`

### `PATCH /api/v1/projects/{project_id}/keywords`
**Ne yapar:** Anahtar kelimeleri günceller  
**Kullanım:** Kullanıcı anahtar kelimeleri girdiğinde (Özet bölümünün parçası)  
**Request:** `{"keywords": "yapay zeka, akademik metin, NLP"}`

### `PATCH /api/v1/projects/{project_id}/scientific-merit`
**Ne yapar:** Bilimsel Nitelik bölümünü (1.1 ve 1.2) günceller  
**Kullanım:** Kullanıcı "Önem ve Nitelik" ve "Amaç ve Hedefler" bölümlerini doldurduğunda  
**Request:** `{"importance_and_quality": "...", "aims_and_objectives": "..."}`

### `PATCH /api/v1/projects/{project_id}/project-management`
**Ne yapar:** Proje Yönetimi tablolarını (3.1, 3.2, 3.3) günceller  
**Kullanım:** Kullanıcı iş programı, risk yönetimi, araştırma imkanları tablolarını doldurduğunda  
**Request:** `{"work_schedule": [...], "risk_management": [...], "research_facilities": [...]}`

### `PATCH /api/v1/projects/{project_id}/wide-impact`
**Ne yapar:** Projenin Geniş Etkisi tablosunu günceller  
**Kullanım:** Kullanıcı geniş etki çıktılarını girdiğinde  
**Request:** `{"wide_impact": [{"category": "...", "outputs": "..."}, ...]}`

### `DELETE /api/v1/projects/{project_id}`
**Ne yapar:** Projeyi siler  
**Kullanım:** Kullanıcı "Projeyi Sil" butonuna tıkladığında  
**Response:** 204 No Content

---

## ✍️ Sections (Bölümler)

### `PATCH /api/v1/sections/{section_id}`
**Ne yapar:** Bölüm taslağını (draft_content) günceller  
**Kullanım:** Kullanıcı editor'de metin yazdığında otomatik kaydetme  
**Request:** `{"draft_content": "Kullanıcının yazdığı metin..."}`  
**Response:** Güncellenmiş section

### `POST /api/v1/sections/{section_id}/generate`
**Ne yapar:** AI ile metin üretir veya iyileştirir  
**Kullanım:** Kullanıcı "AI ile Üret" butonuna tıkladığında  
**Request:** `{"draft_content": "...", "style": "...", "additional_instructions": "..."}`  
**Response:** `{"generated_content": "AI tarafından üretilen metin..."}`

### `POST /api/v1/sections/{section_id}/revise`
**Ne yapar:** Mevcut AI önerisini kullanıcı talimatıyla revize eder  
**Kullanım:** Kullanıcı "Daha kısa yaz" gibi bir talimat verdiğinde  
**Request:** `{"current_content": "...", "revision_prompt": "Daha kısa yaz", "style": "..."}`  
**Response:** `{"generated_content": "Revize edilmiş metin..."}`

### `POST /api/v1/sections/{section_id}/accept`
**Ne yapar:** AI önerisini kabul eder ve final_content olarak kaydeder  
**Kullanım:** Kullanıcı AI önerisini beğenip "Kabul Et" butonuna tıkladığında  
**Request:** `{"content": "Kabul edilen metin..."}`  
**Response:** Güncellenmiş section (final_content dolu)

### `GET /api/v1/sections/{section_id}/revisions` ⚠️ (MVP sonrası)
**Ne yapar:** Bölümün revizyon geçmişini getirir  
**Kullanım:** Kullanıcı önceki versiyonları görmek istediğinde  
**Response:** `{"revisions": [...], "total": 2}`

---

## 📤 Export (Dışa Aktarma)

### `POST /api/v1/export` ❌ (Henüz implement edilmedi)
**Ne yapar:** Projeyi DOCX veya PDF formatında export eder  
**Kullanım:** Kullanıcı "Export" butonuna tıkladığında  
**Request:** `{"project_id": "...", "format": "docx"}`  
**Response:** `{"file_url": "...", "expires_at": "...", "format": "docx", "file_size_bytes": 245678}`  
**Not:** API_Contract.md'de tanımlı, backend'de henüz implement edilmedi

---

## 🔍 Debug (Geliştirme)

### `GET /api/v1/debug/models` ⚠️ (Sadece Development)
**Ne yapar:** Mevcut Gemini modellerini listeler  
**Kullanım:** Hangi modellerin kullanılabilir olduğunu görmek için  
**Response:** Tüm modeller ve özellikleri  
**Not:** Production'da gizlenmeli veya devre dışı bırakılmalı

---

## 📊 Endpoint Özeti

| Endpoint | Method | Ne İşe Yarar |
|----------|--------|--------------|
| `/health` | GET | API sağlık kontrolü |
| `/templates` | GET | Şablon listesi |
| `/templates/{id}` | GET | Şablon detayı |
| `/projects` | GET | Proje listesi |
| `/projects/{id}` | GET | Proje detayı |
| `/projects` | POST | Yeni proje oluştur |
| `/projects/{id}` | PATCH | Proje başlığı güncelle |
| `/projects/{id}/general-info` | PATCH | Genel bilgiler güncelle |
| `/projects/{id}/keywords` | PATCH | Anahtar kelimeler güncelle |
| `/projects/{id}/scientific-merit` | PATCH | Bilimsel nitelik güncelle |
| `/projects/{id}/project-management` | PATCH | Proje yönetimi güncelle |
| `/projects/{id}/wide-impact` | PATCH | Geniş etki güncelle |
| `/projects/{id}` | DELETE | Proje sil |
| `/sections/{id}` | PATCH | Bölüm içeriği güncelle |
| `/sections/{id}/generate` | POST | AI ile metin üret |
| `/sections/{id}/revise` | POST | AI revizyonu |
| `/sections/{id}/accept` | POST | AI önerisini kabul et |
| `/sections/{id}/revisions` | GET | Revizyon geçmişi (MVP sonrası) |
| `/export` | POST | Export (henüz implement edilmedi) |
| `/debug/models` | GET | Model listesi (sadece dev) |
| `/ready` | GET | Readiness probe (production) |
| `/live` | GET | Liveness probe (production) |

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Proje Oluşturma
1. `GET /api/v1/templates` → Şablonları listele
2. `POST /api/v1/projects` → Yeni proje oluştur
3. `GET /api/v1/projects/{id}` → Proje detaylarını getir

### Senaryo 2: Bölüm Düzenleme
1. `PATCH /api/v1/sections/{id}` → Kullanıcı metin yazar
2. `POST /api/v1/sections/{id}/generate` → AI ile üret
3. `POST /api/v1/sections/{id}/revise` → Revize et
4. `POST /api/v1/sections/{id}/accept` → Kabul et

### Senaryo 3: Proje Bilgilerini Doldurma
1. `PATCH /api/v1/projects/{id}/general-info` → Genel bilgiler
2. `PATCH /api/v1/projects/{id}/keywords` → Anahtar kelimeler
3. `PATCH /api/v1/projects/{id}/scientific-merit` → Bilimsel nitelik
4. `PATCH /api/v1/projects/{id}/project-management` → Proje yönetimi
5. `PATCH /api/v1/projects/{id}/wide-impact` → Geniş etki

### Senaryo 4: Proje Export
1. Tüm bölümlerin `final_content` değerleri dolu olmalı
2. `POST /api/v1/export` → Export isteği gönder
3. `file_url` al ve kullanıcıya göster (24 saat geçerli)

---

## 📝 Endpoint Durumları

- ✅ **Var ve Çalışıyor:** 19 endpoint
- ⚠️ **Opsiyonel:** 4 endpoint (ready, live, revisions, root)
- ❌ **Eksik:** 1 endpoint (export - implement edilmeli)

**Toplam:** 24 endpoint (19 aktif + 4 opsiyonel + 1 eksik)

---

**Not:** Detaylı request/response formatları için `docs/API_Contract.md` dosyasına bakın.  
**Analiz:** Detaylı endpoint analizi için `backend/ENDPOINT_ANALYSIS.md` dosyasına bakın.


