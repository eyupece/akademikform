# ✅ Backend Endpoint Test Checklist

Bu dosya, Swagger UI üzerinden yapılacak testlerin checklist'idir.

---

## 🔍 Health Check Endpoints

- [ ] `GET /` - Root endpoint
- [ ] `GET /health` - Health check
- [ ] `GET /api/v1/ready` - Readiness probe
- [ ] `GET /api/v1/live` - Liveness probe

**Beklenen:** Tüm endpoint'ler 200 OK dönmeli

---

## 📋 Templates Endpoints

- [ ] `GET /api/v1/templates` - Şablon listesi
  - Response'da en az 3 şablon var mı?
  - Her şablonun `id`, `name`, `sections` alanları dolu mu?

- [ ] `GET /api/v1/templates/tubitak-2209a` - Şablon detayı
  - Sections listesi dolu mu?
  - Min/max kelime limitleri var mı?

---

## 📁 Projects Endpoints

### GET Endpoints
- [ ] `GET /api/v1/projects?page=1&limit=20` - Proje listesi
- [ ] `GET /api/v1/projects/project-1` - Proje detayı (mock ID kullan)

### POST Endpoints
- [ ] `POST /api/v1/projects`
  - **Request Body:**
    ```json
    {
      "template_id": "tubitak-2209a",
      "title": "Test Projesi - Swagger"
    }
    ```
  - **Not:** Response'dan `id` al, sonraki testlerde kullan

### PATCH Endpoints
- [ ] `PATCH /api/v1/projects/{project_id}` - Başlık güncelle
  ```json
  {
    "title": "Güncellenmiş Başlık"
  }
  ```

- [ ] `PATCH /api/v1/projects/{project_id}/general-info` - Genel bilgiler
  ```json
  {
    "applicant_name": "Ahmet Yılmaz",
    "research_title": "Yapay Zeka ile Metin Analizi",
    "advisor_name": "Prof. Dr. Mehmet Demir",
    "institution": "İstanbul Üniversitesi"
  }
  ```

- [ ] `PATCH /api/v1/projects/{project_id}/keywords` - Anahtar kelimeler
  ```json
  {
    "keywords": "yapay zeka, akademik metin, NLP"
  }
  ```

- [ ] `PATCH /api/v1/projects/{project_id}/scientific-merit` - Bilimsel nitelik
  ```json
  {
    "importance_and_quality": "Bu proje akademik metin analizi için önemlidir...",
    "aims_and_objectives": "Projenin amacı yapay zeka ile metin analizi yapmaktır..."
  }
  ```

- [ ] `PATCH /api/v1/projects/{project_id}/project-management` - Proje yönetimi
  ```json
  {
    "work_schedule": [
      {
        "task": "Literatür taraması",
        "duration_months": 2,
        "responsible": "Araştırmacı"
      }
    ],
    "risk_management": [
      {
        "risk": "Veri eksikliği",
        "probability": "Orta",
        "impact": "Yüksek",
        "mitigation": "Alternatif veri kaynakları"
      }
    ],
    "research_facilities": [
      {
        "facility": "Bilgisayar laboratuvarı",
        "availability": "Mevcut",
        "notes": "GPU desteği var"
      }
    ]
  }
  ```

- [ ] `PATCH /api/v1/projects/{project_id}/wide-impact` - Geniş etki
  ```json
  {
    "wide_impact": [
      {
        "category": "Bilimsel",
        "outputs": "Akademik yayınlar, konferans sunumları"
      }
    ]
  }
  ```

### DELETE Endpoints
- [ ] `DELETE /api/v1/projects/{project_id}` - Proje sil
  - **Beklenen:** 204 No Content
  - **Sonra:** Aynı ID ile GET isteği at → 404 almalısın

---

## ✍️ Sections Endpoints

**Önce:** Bir proje oluştur ve section_id al

- [ ] `PATCH /api/v1/sections/{section_id}` - Bölüm güncelle
  ```json
  {
    "draft_content": "Bu bir test metnidir. Kullanıcı bu metni yazdı."
  }
  ```

- [ ] `POST /api/v1/sections/{section_id}/generate` - AI ile üret
  ```json
  {
    "draft_content": "Bu proje yapay zeka kullanarak akademik metin analizi yapacak.",
    "style": "Akademik, bilimsel ve profesyonel",
    "additional_instructions": "Daha teknik bir dil kullan"
  }
  ```
  - **Not:** AI yanıtı 2-5 saniye sürebilir
  - **Beklenen:** `generated_content` dönmeli

- [ ] `POST /api/v1/sections/{section_id}/revise` - AI revizyon
  ```json
  {
    "current_content": "AI tarafından üretilmiş metin...",
    "revision_prompt": "Daha kısa yaz, özet şeklinde",
    "style": "Akademik, bilimsel ve profesyonel"
  }
  ```

- [ ] `POST /api/v1/sections/{section_id}/accept` - AI önerisini kabul et
  ```json
  {
    "content": "Kabul edilen final metin..."
  }
  ```
  - **Beklenen:** `final_content` dolu section dönmeli

- [ ] `GET /api/v1/sections/{section_id}/revisions` - Revizyon geçmişi
  - **Beklenen:** `revisions` array dönmeli

---

## 🔍 Debug Endpoints

- [ ] `GET /api/v1/debug/models` - Model listesi
  - **Beklenen:** Gemini modelleri listesi
  - **Not:** API key doğru ayarlanmış olmalı

---

## ❌ Hata Senaryoları

- [ ] Var olmayan proje ID → `GET /api/v1/projects/invalid-id` → 404
- [ ] Var olmayan section ID → `PATCH /api/v1/sections/invalid-id` → 404
- [ ] Geçersiz template_id → `POST /api/v1/projects` → 404
- [ ] Boş request body → `POST /api/v1/projects` → 422 (Validation Error)

---

## 📝 Test Sonuçları

**Test Tarihi:** _______________

**Test Eden:** _______________

**Genel Durum:**
- [ ] Tüm endpoint'ler çalışıyor
- [ ] Bazı endpoint'lerde sorun var (detaylar aşağıda)
- [ ] Kritik sorunlar var

**Sorunlar ve Notlar:**

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

**Öneriler:**

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

**Sonraki Adım:** Test sonuçlarını `backend/TEST_RESULTS.md` dosyasına kaydet.

