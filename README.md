# 📄 Bitirme Projesi – AI Destekli Akademik Doküman Editörü  

## 🎯 Proje Amacı  
Bu proje, kullanıcıların hazır şablonlar üzerinden akademik doküman hazırlamasını kolaylaştırmayı amaçlamaktadır. Kullanıcı, bölüm bazlı kısa taslaklar yazar ve **Replicate API** üzerinden erişilen LLM'ler (Llama, Mistral, Qwen gibi) aracılığıyla bu taslakları akademik bir dile dönüştürür.  

Amaç, kullanıcıya **kontrolü kaybetmeden**, AI destekli düzenleme, revizyon ve export (DOCX / PDF) imkânı sağlamaktır.  

---

## 🧑‍💻 Kullanıcı Akışı  

1. **Login / Register**  
   - Kullanıcı giriş yapar veya hesap oluşturur.  
   - Geçmiş projeler kullanıcıya özel saklanır.  

2. **Ana Sayfa (Dashboard)**  
   - "Yeni Doküman Başlat" seçeneği ile şablon seçilir.  
   - "Geçmiş Projelerim" alanında daha önce oluşturulmuş dokümanlar listelenir.  

3. **Bölüm Editörü (Ana Ekran)**  
   - Şablon başlıkları (örn. Özet, Amaç, Yöntem, vb.) otomatik listelenir.  
   - Kullanıcı kendi taslağını ve istediği yazım tarzını girer.  
   - AI önerisi alınır → split view (sol: kullanıcı taslağı, sağ: AI önerisi) veya inline diff görünümü.  
   - Kullanıcı öneriyi **Kabul / Reddet / Revize Et** seçenekleriyle yönetir.  
   - Revizyon geçmişi butonuyla önceki sürümlere erişilebilir.  
   - Sayfanın altında/sağ üstünde export (DOCX / PDF) seçenekleri bulunur.  

4. **Export**  
   - Tüm bölümler tamamlandığında, kurallara uygunluk kontrolü yapılır (örn. kelime sınırı).  
   - Doküman **DOCX veya PDF** formatında indirilebilir.  

---

## ✅ User Stories  

- **Yeni doküman başlatma**: Kullanıcı hazır şablon seçer ve yeni bir proje başlatır.  
- **Bölüm yazma ve tarz belirtme**: Her bölüm için içerik taslağı ve tarz yönlendirmesi yapılır.  
- **AI önerisi alma**: Kullanıcı taslağını AI toparlar.  
- **AI önerisini değerlendirme**: Çıktı kabul/red/revize seçenekleriyle yönetilir.  
- **Bölüm bazlı ilerleme**: Tamamlanan bölümler takip edilir.  
- **Son kontrol ve dışa aktarma**: Doküman kurallara uygunluk açısından kontrol edilir ve indirilebilir.  
- **Geçmiş revizyonlar**: Kullanıcı önceki sürümlere dönebilir.  

---

## 🖼️ Ekranlar  

1. **Login / Register**  
2. **Ana Sayfa (Dashboard)**  
   - Yeni Doküman Başlat  
   - Geçmiş Projelerim  
3. **Bölüm Editörü**  
   - Kullanıcı girişi + AI önerisi  
   - Revizyon geçmişi (modal/side panel)  
   - Export seçenekleri (DOCX / PDF)  

> MVP için 3 ana ekran + login ekranı = 4 ekran yeterlidir.  

---

## ⚙️ Teknik Mimari  

- **Frontend**: React / Next.js  
  - **Editör Kütüphanesi**: TipTap (ProseMirror tabanlı, inline diff ve track changes desteği ile)  
  - **UI Kit**: Tailwind CSS + Shadcn/UI  

- **Backend**: FastAPI (Python)  
  - **Replicate API** entegrasyonu  
  - Metin işleme (token/kelime kontrolü, post-processing)  
  - DOCX / PDF export  
  - Proje, bölüm ve revizyon yönetimi  

- **LLM Entegrasyonu**: Replicate API ([replicate.com](https://replicate.com/))
  - Tek satır kod ile model kullanımı (REST API)  
  - Türkçe destekli LLM'ler:
  - Prompt şablonları backend'de oluşturulur, frontend'den gelen girdilere göre işlenir
  - Automatic scaling ve pay-as-you-go fiyatlandırma

- **Veritabanı**: Supabase (PostgreSQL)  
  - Tablolar: `projects`, `sections`, `revisions`, `export_jobs` (+ `users`)  
  - İlişkisel yapı: Project → Section → Revision  
  - RLS (Row Level Security) ile kullanıcı bazlı erişim  

- **Depolama**: Supabase Storage (veya S3 uyumlu)
  - Export edilen **DOCX/PDF** dosyaları için bucket
  - İndirme için **signed URL** (zaman sınırlı)

    - **Neden Supabase?**
    - İlişkisel model ve SQL sorguları (revizyon geçmişi, raporlama)
    - FastAPI + SQLAlchemy ile doğal entegrasyon
    - RLS ve migration desteği


- **Export**  
  - **DOCX**: `python-docx-template` ile .docx şablonunu doldurma  
  - **PDF**: LibreOffice headless ile **DOCX → PDF** dönüştürme  
    - (Alternatif) WeasyPrint ile **HTML → PDF** (LibreOffice yoksa)  

- **Authentication**:  
  - MVP'de basit e-posta/şifre veya Google Login  
  - İleride NextAuth.js / Auth0 entegrasyonu  

- **Diff Karşılaştırma**:  
  - Inline farkları göstermek için `diff-match-patch` kütüphanesi (JS ve Python desteği mevcut)  

- **Deployment**:  
  - **Frontend**: Vercel  
  - **Backend**: Railway / Render  
  - **Veritabanı & Depolama**: Supabase Cloud
  - **AI Models**: Replicate (automatic scaling, pay-per-use)  

---

## 🔑 Önemli Özellikler  

- Hazır şablon yapısı (örn. TÜBİTAK 2209-A)  
- AI ile akademik dile dönüştürme  
- Split view & inline diff görünümü  
- Kabul/Red/Revize akışı  
- Revizyon geçmişi (her bölüm için)  
- Export (DOCX / PDF)  

---

## 🚀 Yol Haritası (MVP → Gelişim)  

- [ ] Login/Register ekranı  
- [ ] Dashboard (Yeni Doküman + Geçmiş Projelerim)  
- [ ] Bölüm Editörü (taslak girişi + AI entegrasyonu)  
- [ ] Revizyon geçmişi (modal/side panel)  
- [ ] Export (DOCX / PDF)  

**Gelecek aşamalar**:  
- Son Kontrol ekranı (ayrı sayfa)  
- Yorum sistemi (ekip çalışması için)  
- Şablon oluşturucu (custom şablonlar)  
