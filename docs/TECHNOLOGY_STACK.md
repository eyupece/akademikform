# 🛠️ AkademikForm - Teknoloji Yığını

## Projenin Genel Çerçevesi

### 1. Veri Kaynağı ve Hazırlık

- **Hazır Şablonlar**: TÜBİTAK 2209-A gibi akademik form şablonları
- **Kullanıcı Girişleri**: Taslak metinler, stil tercihleri, ek talimatlar
- **Veri Ön İşleme**: Metin validasyonu, kelime sayısı kontrolü, içerik temizleme

---

### 2. AI Model Entegrasyonu

- **Google Gemini API**: Ana AI servisi (gemini-2.5-flash)
- **Akademik Metin Üretimi**: Taslak metinleri akademik dile dönüştürme
- **Metin Revizyonu**: Kullanıcı talimatıyla metin iyileştirme
- **Prompt Mühendisliği**: Context-aware prompt oluşturma

---

### 3. Backend ve API Geliştirme

- **FastAPI**: REST API framework (Python)
- **Supabase (PostgreSQL)**: İlişkisel veritabanı
- **RESTful API**: JSON veri iletişimi
- **Supabase Storage**: DOCX/PDF dosya depolama
- **Export Servisleri**: DOCX/PDF export işlemleri

---

### 4. Frontend ve Kullanıcı Arayüzü

- **Next.js**: Modern web framework (React tabanlı)
- **TipTap**: Rich text editor (ProseMirror tabanlı)
- **Tailwind CSS**: Utility-first CSS framework
- **diff-match-patch**: Metin fark karşılaştırma
- **Split View**: Yan yana görünüm (taslak vs AI önerisi)
- **Kullanıcı Yönetimi**: Dashboard ve proje yönetim paneli

---

**Şekil 1: Projenin genel çerçevesi**
