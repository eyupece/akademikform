# 📋 API Contract — Backend Endpoint Sözleşmesi

Bu dosya, Frontend (Next.js) ve Backend (FastAPI) arasındaki API sözleşmesini tanımlar.  
**Mock API** (`frontend/lib/mockApi.ts`) bu contract'a göre tasarlanmıştır.  
Backend geliştirme sırasında bu endpoint'ler ve format'lar **birebir uygulanacaktır**.

---

## 📍 Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.akademikform.com/api/v1
```

---

## 🔐 Authentication

Tüm endpoint'ler (login/register hariç) **JWT Bearer Token** ile korunacaktır.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 📚 Endpoints

### 1. Authentication

#### POST `/auth/register`
Yeni kullanıcı kaydı.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "Ahmet Yılmaz"
}
```

**Response (201):**
```json
{
  "user_id": "user-uuid",
  "email": "user@example.com",
  "full_name": "Ahmet Yılmaz",
  "created_at": "2024-11-14T10:30:00Z"
}
```

#### POST `/auth/login`
Kullanıcı girişi.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": "user-uuid",
    "email": "user@example.com",
    "full_name": "Ahmet Yılmaz"
  }
}
```

#### POST `/auth/forgot-password`
Şifre sıfırlama bağlantısı gönderir.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
  "email": "user@example.com"
}
```

**Hata Yanıtı (404):**
```json
{
  "error": "user_not_found",
  "message": "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı."
}
```

#### POST `/auth/reset-password`
Şifreyi sıfırlar (token ile).

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "new_password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifreniz başarıyla güncellendi."
}
```

**Hata Yanıtı (400):**
```json
{
  "error": "invalid_token",
  "message": "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı."
}
```

#### GET `/auth/verify-reset-token/:token`
Şifre sıfırlama token'ını doğrular (opsiyonel - UI için).

**Response (200):**
```json
{
  "valid": true,
  "email": "user@example.com",
  "expires_at": "2024-11-15T10:30:00Z"
}
```

**Response (400):**
```json
{
  "valid": false,
  "error": "Token geçersiz veya süresi dolmuş"
}
```

---

### 2. Templates

#### GET `/templates`
Mevcut tüm şablonları listeler.

**Response (200):**
```json
[
  {
    "id": "tubitak-2209a",
    "name": "TÜBİTAK 2209-A",
    "description": "Üniversite öğrencileri araştırma projeleri destek programı",
    "sections": [
      {
        "title": "Projenin Özeti",
        "order": 0,
        "placeholder": "Projenizin özetini yazın...",
        "min_words": 25,
        "max_words": 450
      },
      {
        "title": "Araştırma Önerisinin Bilimsel Niteliği",
        "order": 1,
        "placeholder": "Bu bölüm 1.1 ve 1.2 alt bölümlerinden oluşur...",
        "min_words": 0,
        "max_words": 0
      }
    ]
  }
]
```

#### GET `/templates/:id`
Belirli bir şablonu getirir.

**Response (200):**
```json
{
  "id": "tubitak-2209a",
  "name": "TÜBİTAK 2209-A",
  "description": "Üniversite öğrencileri araştırma projeleri destek programı",
  "sections": [...]
}
```

---

### 3. Projects

#### GET `/projects`
Kullanıcının tüm projelerini listeler.

**Query Parameters:**
- `page` (optional): Sayfa numarası (default: 1)
- `limit` (optional): Sayfa başına kayıt (default: 20)

**Response (200):**
```json
{
  "projects": [
    {
      "id": "project-uuid",
      "user_id": "user-uuid",
      "template_id": "tubitak-2209a",
      "template_name": "TÜBİTAK 2209-A",
      "title": "Yapay Zeka ile Akademik Metin Analizi",
      "created_at": "2024-11-14T10:30:00Z",
      "updated_at": "2024-11-14T11:45:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

#### GET `/projects/:id`
Belirli bir projeyi detaylı olarak getirir (bölümlerle birlikte).

**Response (200):**
```json
{
  "id": "project-uuid",
  "user_id": "user-uuid",
  "template_id": "tubitak-2209a",
  "template_name": "TÜBİTAK 2209-A",
  "title": "Yapay Zeka ile Akademik Metin Analizi",
  "created_at": "2024-11-14T10:30:00Z",
  "updated_at": "2024-11-14T11:45:00Z",
  "general_info": {
    "applicant_name": "Ahmet Yılmaz",
    "research_title": "Yapay Zeka ile Akademik Metin Analizi",
    "advisor_name": "Prof. Dr. Ayşe Demir",
    "institution": "İstanbul Teknik Üniversitesi"
  },
  "keywords": "yapay zeka, akademik metin, doğal dil işleme",
  "scientific_merit": {
    "importance_and_quality": "Bu araştırma, yapay zeka alanında önemli bir boşluğu doldurmayı hedeflemektedir...",
    "aims_and_objectives": "Bu projenin temel amacı, akademik metin analizini otomatikleştirmektir..."
  },
  "project_management": {
    "work_schedule": [
      {
        "id": "ws-uuid",
        "date_range": "01/09/2024 - 30/11/2024",
        "activities": "Literatür taraması ve araştırma planının detaylandırılması",
        "responsible": "Proje ekibi tüm üyeleri",
        "success_criteria_contribution": "Kapsamlı literatür raporu hazırlanması (%15)"
      }
    ],
    "risk_management": [
      {
        "id": "rm-uuid",
        "risk": "Veri toplama sürecinde katılımcı bulunamaması",
        "countermeasure": "Alternatif veri kaynakları belirlenmesi ve online anket sistemleri kullanımı"
      }
    ],
    "research_facilities": [
      {
        "id": "rf-uuid",
        "equipment_type_model": "Dell Precision 5820 Tower (Intel Xeon, 64GB RAM)",
        "project_usage": "Veri analizi ve yapay zeka modeli eğitimi"
      }
    ]
  },
  "wide_impact": [
    {
      "id": "wi-uuid",
      "category": "Bilimsel/Akademik Çıktılar",
      "category_description": "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
      "outputs": "2 ulusal konferans bildirisi, 1 uluslararası dergi makalesi"
    },
    {
      "id": "wi-uuid-2",
      "category": "Ekonomik/Ticari/Sosyal Çıktılar",
      "category_description": "(Ürün, Prototip, Patent, Faydalı Model, Tescil vb.)",
      "outputs": "Prototip yazılım geliştirme"
    },
    {
      "id": "wi-uuid-3",
      "category": "Yeni Proje Oluşturmasına Yönelik Çıktılar",
      "category_description": "(Ulusal/Uluslararası Yeni Proje vb.)",
      "outputs": ""
    }
  ],
  "sections": [
    {
      "id": "section-uuid",
      "project_id": "project-uuid",
      "title": "Projenin Özeti",
      "order": 0,
      "draft_content": "Bu proje yapay zeka kullanarak akademik metinleri analiz etmeyi amaçlamaktadır.",
      "final_content": null,
      "created_at": "2024-11-14T10:30:00Z",
      "updated_at": "2024-11-14T11:00:00Z"
    }
  ]
}
```

#### POST `/projects`
Yeni proje oluşturur.

**Request:**
```json
{
  "template_id": "tubitak-2209a",
  "title": "Yapay Zeka ile Akademik Metin Analizi"
}
```

**Response (201):**
```json
{
  "id": "project-uuid",
  "user_id": "user-uuid",
  "template_id": "tubitak-2209a",
  "template_name": "TÜBİTAK 2209-A",
  "title": "Yapay Zeka ile Akademik Metin Analizi",
  "created_at": "2024-11-14T10:30:00Z",
  "updated_at": "2024-11-14T10:30:00Z",
  "general_info": {
    "applicant_name": "",
    "research_title": "",
    "advisor_name": "",
    "institution": ""
  },
  "keywords": "",
  "scientific_merit": {
    "importance_and_quality": "",
    "aims_and_objectives": ""
  },
  "project_management": {
    "work_schedule": [
      {
        "id": "ws-uuid",
        "date_range": "",
        "activities": "",
        "responsible": "",
        "success_criteria_contribution": ""
      }
    ],
    "risk_management": [
      {
        "id": "rm-uuid",
        "risk": "",
        "countermeasure": ""
      }
    ],
    "research_facilities": [
      {
        "id": "rf-uuid",
        "equipment_type_model": "",
        "project_usage": ""
      }
    ]
  },
  "wide_impact": [
    {
      "id": "wi-uuid",
      "category": "Bilimsel/Akademik Çıktılar",
      "category_description": "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
      "outputs": ""
    },
    {
      "id": "wi-uuid-2",
      "category": "Ekonomik/Ticari/Sosyal Çıktılar",
      "category_description": "(Ürün, Prototip, Patent, Faydalı Model, Tescil vb.)",
      "outputs": ""
    },
    {
      "id": "wi-uuid-3",
      "category": "Yeni Proje Oluşturmasına Yönelik Çıktılar",
      "category_description": "(Ulusal/Uluslararası Yeni Proje vb.)",
      "outputs": ""
    }
  ],
  "sections": [
    {
      "id": "section-uuid-1",
      "project_id": "project-uuid",
      "title": "Projenin Özeti",
      "order": 0,
      "draft_content": "",
      "final_content": null,
      "created_at": "2024-11-14T10:30:00Z",
      "updated_at": "2024-11-14T10:30:00Z"
    }
  ]
}
```

#### PATCH `/projects/:id`
Proje başlığını günceller.

**Request:**
```json
{
  "title": "Güncellenmiş Proje Başlığı"
}
```

**Response (200):**
```json
{
  "id": "project-uuid",
  "title": "Güncellenmiş Proje Başlığı",
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### PATCH `/projects/:id/general-info`
Genel bilgileri (A bölümü) günceller.

**Request:**
```json
{
  "applicant_name": "Ahmet Yılmaz",
  "research_title": "Yapay Zeka ile Akademik Metin Analizi",
  "advisor_name": "Prof. Dr. Ayşe Demir",
  "institution": "İstanbul Teknik Üniversitesi"
}
```

**Response (200):**
```json
{
  "general_info": {
    "applicant_name": "Ahmet Yılmaz",
    "research_title": "Yapay Zeka ile Akademik Metin Analizi",
    "advisor_name": "Prof. Dr. Ayşe Demir",
    "institution": "İstanbul Teknik Üniversitesi"
  },
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### PATCH `/projects/:id/keywords`
Anahtar kelimeleri günceller (Özet bölümünün parçası).

**Request:**
```json
{
  "keywords": "yapay zeka, akademik metin, doğal dil işleme"
}
```

**Response (200):**
```json
{
  "keywords": "yapay zeka, akademik metin, doğal dil işleme",
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### PATCH `/projects/:id/scientific-merit`
Bilimsel Nitelik (1.1 ve 1.2) günceller.

**Request:**
```json
{
  "importance_and_quality": "Bu araştırma, yapay zeka alanında önemli bir boşluğu doldurmayı hedeflemektedir...",
  "aims_and_objectives": "Bu projenin temel amacı, akademik metin analizini otomatikleştirmektir..."
}
```

**Response (200):**
```json
{
  "scientific_merit": {
    "importance_and_quality": "Bu araştırma, yapay zeka alanında önemli bir boşluğu doldurmayı hedeflemektedir...",
    "aims_and_objectives": "Bu projenin temel amacı, akademik metin analizini otomatikleştirmektir..."
  },
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### PATCH `/projects/:id/project-management`
Proje Yönetimi tablolarını (3.1, 3.2, 3.3) günceller.

**Request:**
```json
{
  "work_schedule": [
    {
      "id": "ws-uuid",
      "date_range": "01/09/2024 - 30/11/2024",
      "activities": "Literatür taraması ve araştırma planının detaylandırılması",
      "responsible": "Proje ekibi tüm üyeleri",
      "success_criteria_contribution": "Kapsamlı literatür raporu hazırlanması (%15)"
    }
  ],
  "risk_management": [
    {
      "id": "rm-uuid",
      "risk": "Veri toplama sürecinde katılımcı bulunamaması",
      "countermeasure": "Alternatif veri kaynakları belirlenmesi"
    }
  ],
  "research_facilities": [
    {
      "id": "rf-uuid",
      "equipment_type_model": "Dell Precision 5820 Tower",
      "project_usage": "Veri analizi ve yapay zeka modeli eğitimi"
    }
  ]
}
```

**Response (200):**
```json
{
  "project_management": {
    "work_schedule": [...],
    "risk_management": [...],
    "research_facilities": [...]
  },
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### PATCH `/projects/:id/wide-impact`
Yaygın Etki tablosunu (4. bölüm) günceller.

**Request:**
```json
{
  "wide_impact": [
    {
      "id": "wi-uuid",
      "category": "Bilimsel/Akademik Çıktılar",
      "category_description": "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
      "outputs": "2 ulusal konferans bildirisi, 1 uluslararası dergi makalesi"
    }
  ]
}
```

**Response (200):**
```json
{
  "wide_impact": [...],
  "updated_at": "2024-11-14T12:00:00Z"
}
```

#### DELETE `/projects/:id`
Projeyi siler (soft delete).

**Response (204):** No Content

---

### 4. Sections

#### PATCH `/sections/:id`
Bölüm taslağını günceller (draft_content).

**Request:**
```json
{
  "draft_content": "Bu proje yapay zeka kullanarak akademik metinleri analiz etmeyi amaçlamaktadır. Metodoloji olarak derin öğrenme tekniklerini kullanacağız..."
}
```

**Response (200):**
```json
{
  "id": "section-uuid",
  "project_id": "project-uuid",
  "title": "Projenin Özeti",
  "order": 0,
  "draft_content": "Bu proje yapay zeka kullanarak akademik metinleri analiz etmeyi amaçlamaktadır...",
  "final_content": null,
  "created_at": "2024-11-14T10:30:00Z",
  "updated_at": "2024-11-14T12:30:00Z"
}
```

#### POST `/sections/:id/generate`
AI ile metin üretir veya iyileştirir.

**Request:**
```json
{
  "draft_content": "Bu proje yapay zeka kullanarak akademik metinleri analiz etmeyi amaçlamaktadır.",
  "style": "Akademik, bilimsel ve profesyonel",
  "additional_instructions": ""
}
```

**Response (200):**
```json
{
  "generated_content": "Bu araştırma projesi, yapay zeka teknolojilerinden yararlanarak akademik metinlerin sistematik analizini gerçekleştirmeyi hedeflemektedir. Söz konusu analiz süreci, doğal dil işleme (NLP) ve makine öğrenmesi algoritmalarının entegrasyonuyla sağlanacaktır. Projenin akademik literatüre katkısı, mevcut yöntemlerin ötesinde yenilikçi bir yaklaşım sunmasıyla öne çıkmaktadır..."
}
```

#### POST `/sections/:id/revise`
Mevcut AI önerisini kullanıcı talimatıyla revize eder.

**Request:**
```json
{
  "current_content": "Bu araştırma projesi, yapay zeka teknolojilerinden yararlanarak...",
  "revision_prompt": "Daha kısa ve öz yaz, metodoloji kısmını detaylandır",
  "style": "Akademik, bilimsel ve profesyonel"
}
```

**Response (200):**
```json
{
  "generated_content": "Bu proje, yapay zeka ile akademik metin analizini hedeflemektedir. Metodoloji: Doğal dil işleme (NLP) ve derin öğrenme (BERT, GPT-3) teknikleri kullanılarak metin sınıflandırma, özet çıkarma ve anlam analizi yapılacaktır..."
}
```

#### POST `/sections/:id/accept`
AI önerisini kabul eder ve final_content olarak kaydeder.

**Request:**
```json
{
  "content": "Bu araştırma projesi, yapay zeka teknolojilerinden yararlanarak akademik metinlerin sistematik analizini gerçekleştirmeyi hedeflemektedir..."
}
```

**Response (200):**
```json
{
  "id": "section-uuid",
  "project_id": "project-uuid",
  "title": "Projenin Özeti",
  "order": 0,
  "draft_content": "Bu proje yapay zeka kullanarak...",
  "final_content": "Bu araştırma projesi, yapay zeka teknolojilerinden yararlanarak akademik metinlerin sistematik analizini gerçekleştirmeyi hedeflemektedir...",
  "created_at": "2024-11-14T10:30:00Z",
  "updated_at": "2024-11-14T12:45:00Z",
  "revision": {
    "id": "rev-uuid",
    "section_id": "section-uuid",
    "content": "Bu araştırma projesi...",
    "revision_number": 1,
    "created_at": "2024-11-14T12:45:00Z"
  }
}
```

#### GET `/sections/:id/revisions`
Bölümün revizyon geçmişini getirir.

**Response (200):**
```json
{
  "revisions": [
    {
      "id": "rev-uuid-1",
      "section_id": "section-uuid",
      "content": "İlk versiyon içeriği...",
      "revision_number": 1,
      "created_at": "2024-11-14T10:45:00Z"
    },
    {
      "id": "rev-uuid-2",
      "section_id": "section-uuid",
      "content": "İkinci versiyon içeriği (revize edilmiş)...",
      "revision_number": 2,
      "created_at": "2024-11-14T11:30:00Z"
    }
  ],
  "total": 2
}
```

---

### 5. Generic AI

Section ID'ye ihtiyaç duymadan AI metin üretimi ve revizyonu yapar.  
**Wide Impact**, **Scientific Merit** gibi section olmayan alanlar için kullanılır.

#### POST `/ai/generate`
Generic AI metin üretimi.

**Request:**
```json
{
  "content": "Robotlar üzerine araştırma yapacağız",
  "style": "Akademik, bilimsel ve profesyonel",
  "additional_instructions": "",
  "context": {
    "field_type": "wide_impact",
    "category": "Bilimsel/Akademik Çıktılar",
    "project_id": "project-uuid"
  }
}
```

**field_type Değerleri:**
- `scientific_merit_1_1` - Konunun Önemi ve Bilimsel Nitelik
- `scientific_merit_1_2` - Amaç ve Hedefler
- `wide_impact` - Yaygın Etki

**Response (200):**
```json
{
  "generated_content": "Bu araştırmada, yapay zeka destekli robotik sistemler üzerine kapsamlı bir inceleme gerçekleştirilecektir..."
}
```

**Error Responses:**
- `400` - Invalid request (content boş)
- `500` - AI generation error

---

#### POST `/ai/revise`
Generic AI metin revizyonu.

**Request:**
```json
{
  "current_content": "Bu araştırma robotlar hakkındadır...",
  "revision_prompt": "Daha akademik ve detaylı yaz",
  "style": "Akademik, bilimsel ve profesyonel",
  "context": {
    "field_type": "wide_impact",
    "category": "Ekonomik/Ticari/Sosyal Çıktılar",
    "project_id": "project-uuid"
  }
}
```

**Response (200):**
```json
{
  "generated_content": "Bu araştırma kapsamında, robotik sistemlerin endüstriyel uygulamaları ve sosyo-ekonomik etkileri..."
}
```

**Error Responses:**
- `400` - Invalid request
- `500` - AI revision error

---

### 6. Export

#### POST `/export`
Projeyi DOCX veya PDF formatında export eder.

**Request:**
```json
{
  "project_id": "project-uuid",
  "format": "docx"
}
```

**Response (200):**
```json
{
  "file_url": "https://storage.supabase.co/v1/object/sign/exports/project-uuid-2024-11-14.docx?token=...",
  "expires_at": "2024-11-15T12:00:00Z",
  "format": "docx",
  "file_size_bytes": 245678
}
```

**Export Süreci:**
1. Backend tüm bölümlerin `final_content` değerlerini kontrol eder
2. Boş bölümler varsa hata döner (400)
3. Şablon (.docx template) doldurulur
4. Supabase Storage'a yüklenir
5. Signed URL oluşturulur (24 saat geçerli)
6. URL frontend'e döner

**Hata Yanıtı (400):**
```json
{
  "error": "incomplete_sections",
  "message": "Tüm bölümler tamamlanmalıdır",
  "incomplete_sections": [
    {
      "title": "Yöntem",
      "order": 2
    }
  ]
}
```

---

## 🔔 Hata Yanıtları (Error Responses)

Tüm hata yanıtları aşağıdaki formatta olacaktır:

```json
{
  "error": "error_code",
  "message": "Kullanıcı dostu hata mesajı",
  "details": {
    "field": "Ek detay bilgisi (opsiyonel)"
  }
}
```

### Hata Kodları

| HTTP Status | Error Code | Açıklama |
|-------------|------------|----------|
| 400 | `validation_error` | Geçersiz veri formatı |
| 400 | `incomplete_sections` | Export için tüm bölümler tamamlanmamış |
| 401 | `unauthorized` | JWT token geçersiz veya eksik |
| 403 | `forbidden` | Erişim yetkisi yok |
| 404 | `not_found` | Kaynak bulunamadı |
| 429 | `rate_limit_exceeded` | Çok fazla istek (Replicate API limiti) |
| 500 | `internal_server_error` | Sunucu hatası |
| 503 | `service_unavailable` | Replicate API erişilemiyor |

---

## 🤖 Replicate API Entegrasyonu

Backend, AI metin üretimi için **Replicate API** kullanacaktır.

### Kullanılacak Modeller

- **Llama 3 70B** (öncelikli)
- **Mistral 7B** (alternatif)
- **Qwen 2.5** (alternatif)

### Prompt Yapısı

```
SYSTEM: Sen akademik metin yazma konusunda uzman bir asistansın. Kullanıcının taslak metnini akademik, bilimsel ve profesyonel bir dile dönüştür.

CONTEXT:
- Proje Başlığı: [project.title]
- Bölüm: [section.title]
- Stil: [style]
- Min Kelime: [min_words]
- Max Kelime: [max_words]

TASK:
Aşağıdaki taslak metni akademik dile çevir:
[draft_content]

[additional_instructions]
```

### Post-Processing

- Kelime sayısı kontrolü (min/max limitleri)
- HTML/Markdown etiketlerinin temizlenmesi
- Gereksiz boşlukların kaldırılması
- Tekrarlanan cümlelerin tespiti

---

## 📝 Notlar

### mockApi.ts'de Var, Backend'de Eksik Olabilecek Endpoint'ler

Aşağıdaki işlemler **frontend'de kullanılıyor** ancak **mockApi.ts'de tam karşılığı yok**:

1. ✅ `PATCH /projects/:id/general-info` → Frontend'de kullanılıyor, contract'a eklendi
2. ✅ `PATCH /projects/:id/keywords` → Frontend'de kullanılıyor, contract'a eklendi
3. ✅ `PATCH /projects/:id/scientific-merit` → Frontend'de kullanılıyor, contract'a eklendi
4. ✅ `PATCH /projects/:id/project-management` → Frontend'de kullanılıyor, contract'a eklendi
5. ✅ `PATCH /projects/:id/wide-impact` → Frontend'de kullanılıyor, contract'a eklendi
6. ✅ `POST /sections/:id/revise` → Frontend'de kullanılıyor, contract'a eklendi

**Tüm endpoint'ler contract'a eklenmiştir.**

### İleride Eklenebilecek Endpoint'ler (MVP Sonrası)

- `GET /projects/:id/export-history` → Export geçmişi
- `POST /projects/:id/duplicate` → Proje kopyalama
- `GET /projects/:id/collaborators` → Proje işbirlikçileri (rol tabanlı)
- `POST /sections/:id/comments` → Inline yorumlar
- `GET /analytics/usage` → Kullanıcı istatistikleri

---

## ✅ Son Kontrol

**Mock API ile Contract Uyumu:**
- ✅ `getProjects()` → `GET /projects`
- ✅ `getProject(id)` → `GET /projects/:id`
- ✅ `createProject(templateId, title)` → `POST /projects`
- ✅ `updateSection(sectionId, draft)` → `PATCH /sections/:id`
- ✅ `acceptRevision(sectionId, content)` → `POST /sections/:id/accept`
- ✅ `getRevisions(sectionId)` → `GET /sections/:id/revisions`
- ✅ `generateAI(draft, style)` → `POST /sections/:id/generate`
- ✅ `getTemplates()` → `GET /templates`
- ✅ `getTemplate(id)` → `GET /templates/:id`

**Frontend'de Kullanılan Tüm İşlemler:**
- ✅ Proje oluşturma ve listeleme
- ✅ Genel bilgileri güncelleme
- ✅ Anahtar kelimeleri güncelleme
- ✅ Bilimsel nitelik güncelleme
- ✅ Proje yönetimi tabloları güncelleme
- ✅ Yaygın etki tablosu güncelleme
- ✅ Bölüm taslağı güncelleme
- ✅ AI ile metin üretme ve revize etme
- ✅ AI önerisini kabul etme
- ✅ Revizyon geçmişi görüntüleme
- ✅ Export (DOCX/PDF)

**Sonuç:** Tüm endpoint'ler contract'a eklenmiştir. Backend geliştirme bu contract'a göre yapılabilir. ✨

---

**Son Güncelleme:** 2024-11-14  
**Versiyon:** 1.0  
**Durum:** ✅ MVP için hazır
