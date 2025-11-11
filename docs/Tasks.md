# ✅ Tasks — Roadmap (MVP → Gelişim)

Zaman tanımları:
- **Kısa vade (MVP)**: Hafta 1–2
- **Orta vade**: Hafta 3–4
- **Uzun vade**: MVP sonrası

---

## 🎨 Frontend (Next.js + TipTap + Tailwind + shadcn/ui)

### Kısa vade (MVP)
- [x] Proje iskeleti (Next.js App Router, TS, Tailwind, shadcn/ui kurulumu)
- [x] Temel sayfalar: `/login`, `/dashboard`, `/editor/[projectId]`
- [x] TipTap entegrasyonu (StarterKit) ve **Split View**
- [x] Inline diff görselleştirme (diff-match-patch)
- [x] Word/Character counter (kelime ve karakter sayacı)
- [x] Inline title editing (proje başlığı düzenleme - pencil icon)
- [x] Writing style input (yazım tarzı için serbest metin girişi)
- [x] Copilot-style AI action popup (Accept/Reject/Revise + inline revise input)
- [x] Modern toast notification system (bottom-left stacked toasts)
- [ ] Bölüm durum rozetleri & ilerleme barı (tamamlanan/total)
- [ ] Revizyon Geçmişi: Drawer/Modal UI (mock veri)
- [x] Export Paneli (DOCX/PDF butonları) – UI

### Orta vade
- [ ] API bağlama: mock → gerçek FastAPI endpoint'leri
- [x] Hata/skeleton/loader durumları, toast bildirimler
- [ ] Form validasyonları (react-hook-form + zod)
- [ ] Editor performans iyileştirmeleri (uzun metin, tipografi)
- [ ] Erişilebilirlik (a11y) ve klavye kısayolları

### Uzun vade
- [ ] Versiyonlar arası karşılaştırma ekranı (history diff)
- [ ] Şablon seçici/önizleme (çoklu şablon)
- [ ] Yorumlar (inline comment pins)
- [ ] Mobil uyum optimizasyonu

---

## 🧠 Backend (FastAPI)

### Kısa vade (MVP)
- [ ] FastAPI iskeleti + temel health endpoint
- [ ] Endpoint sözleşmesi (OpenAPI): `/projects`, `/sections`, `/export`, `/generate`
- [ ] `/sections/:id/generate` → HF proxy (stub yanıt)
- [ ] `/sections/:id/accept`, `/sections/:id/revise` (iş akışı stub)
- [ ] `/sections/:id/revisions` (mock data)

### Orta vade
- [ ] HF gerçek entegrasyonu + post-processing (kelime sınırı)
- [ ] Revizyon kayıtları (DB’ye yazma, snapshot_text/diff)
- [ ] Hata yönetimi ve rate limit
- [ ] Export servisleri ile entegrasyon (DOCX/PDF)

### Uzun vade
- [ ] Queue/Job sistemi (export ve uzun istekler için)
- [ ] Role-based access (ileride ekip kullanımına hazırlık)
- [ ] Gelişmiş metin kalite kontrolleri (tekrar/okunabilirlik)

---

## 🤖 LLM & Prompting (Hugging Face Inference API)

### Kısa vade (MVP)
- [ ] Model seçimi (Türkçe destekli) ve ilk benchmark
- [ ] Bölüm bazlı **base prompt** şablonu (SYSTEM + CONTEXT + TASK)
- [ ] Stil/ton parametreleri (kısa, akademik, teknik) desteği
- [ ] Minimum/maximum kelime kontrolü (post-processing)

### Orta vade
- [ ] Bölümler arası tutarlılık kontrolleri (Amaç ↔ Yöntem)
- [ ] Revize isteği için ek talimat alanı (instruction tuning benzeri)
- [ ] Yanıt temizleme (HTML/etiket, whitespace, tekrar cümleler)

### Uzun vade
- [ ] Alternatif model A/B
- [ ] Uzun metinler için parça-parça üretim (chunking/merge)
- [ ] Prompt library (şablonlara göre otomasyon)

---

## 🗄️ Database & Storage (Supabase — PostgreSQL + Storage)

### Kısa vade (MVP)
- [ ] Tablolar: `users`, `projects`, `sections`, `revisions`, `export_jobs`
- [ ] İlişkiler ve indeksler (owner_id, project_id, section_id)
- [ ] RLS politikaları (kullanıcı → kendi projeleri)
- [ ] Storage bucket: `exports/` (DOCX/PDF)

### Orta vade
- [ ] Migration betikleri (schema versioning)
- [ ] Basit raporlama sorguları (tamamlanan bölüm sayısı, revizyon sayısı)
- [ ] Yedekleme/geri yükleme prosedürü

### Uzun vade
- [ ] Arama/filtre (full-text search ihtiyacı doğarsa)
- [ ] Analytics tabloları (denormalize özetler)

---

## 🧾 Export (DOCX & PDF)

### Kısa vade (MVP)
- [ ] `python-docx-template` ile .docx şablonu doldurma
- [ ] LibreOffice headless ile **DOCX → PDF** dönüşümü
- [ ] Supabase Storage’a yükleme, **signed URL** üretimi
- [ ] Export öncesi kontroller (kelime sınırı, boş bölüm)

### Orta vade
- [ ] Export queue (arka plan iş)
- [ ] Export geçmişi (export_jobs liste/tekrar indir)
- [ ] HTML→PDF (WeasyPrint) alternatifi (LibreOffice yoksa)

### Uzun vade
- [ ] Çoklu şablon desteği ve kapak sayfası/özet oto-derleme
- [ ] Tablolar ve görseller için gelişmiş yerleşim

---

## 🔐 Authentication & Authorization

### Kısa vade (MVP)
- [ ] Basit e-posta/şifre veya Google ile giriş (NextAuth/Supabase Auth)
- [ ] FastAPI’de JWT doğrulama (middleware)

### Orta vade
- [ ] Şifre sıfırlama / e-posta doğrulama
- [ ] Rate limit / brute-force koruması

### Uzun vade
- [ ] Rol bazlı yetkilendirme (owner, collaborator)
- [ ] Organizasyonlar/ekipler

---

## 🚀 DevOps / Deployment

### Kısa vade (MVP)
- [ ] Frontend: Vercel deploy
- [ ] Backend: Railway/Render deploy
- [ ] Supabase: DB & Storage prod projeleri

### Orta vade
- [ ] Ortam değişkenleri & gizli anahtar yönetimi (HF token, DB URL)
- [ ] Temel gözlemlenebilirlik (request logları, LLM latency)
- [ ] Basit CI (lint, typecheck, build)

### Uzun vade
- [ ] CDN & Cache stratejisi
- [ ] Health checks, uptime izleme
- [ ] Gelişmiş CI/CD (test + deploy pipeline)

---

## 🧪 Test & Kalite

### Kısa vade (MVP)
- [ ] Kritik akışlar için smoke test (create → generate → accept → export)
- [x] Tip güvenliği (TS) ve linter/formatter (ESLint, Prettier)
- [ ] Backend için basit unit (generate, accept)

### Orta vade
- [ ] Component testleri (React Testing Library)
- [ ] API contract testleri (schemalar)
- [ ] E2E senaryolar (Playwright/Cypress) – en az 1 temel akış

### Uzun vade
- [ ] Performans testleri (büyük içerik/diff)
- [ ] Load test (export yoğunluğu)

---

## 🗂️ Dokümantasyon

### Kısa vade (MVP)
- [x] README (teknik mimari, kurulum)
- [x] `MVP_UserStories_Ekranlar.md`
- [ ] `API_Contract.md` (endpointler ve örnek gövdeler)
- [ ] `DB_Schema.md` (tablolar ve ilişkiler)

### Orta vade
- [ ] Geliştirici kılavuzu (yerel geliştirme, env, komutlar)
- [ ] Export şablonunun düzenleme rehberi

### Uzun vade
- [ ] Kullanıcı kılavuzu (non-dev)
- [ ] Şablon oluşturma sihirbazı için rehber

---

## 📍 Milestones

- **M1 (Hafta 2)**: FE mock tamam + DB şema kuruldu + BE stub endpointler
- **M2 (Hafta 3)**: HF entegrasyonu + gerçek CRUD + revizyon kaydı
- **M3 (Hafta 4)**: Export (DOCX/PDF) + prod deploy + smoke testler

---

## 🎯 Başarı Kriterleri (MVP)

- [x] Kullanıcı giriş yapıp proje oluşturabiliyor (mock auth)
- [x] Editor'de taslak girip **AI önerisi** alabiliyor (mock API)
- [x] Kabul/Revize akışı çalışıyor, revizyon geçmişi listeleniyor (UI hazır, backend bekleniyor)
- [ ] Export ile DOCX ve PDF indirilebiliyor (signed URL)
- [ ] Veriler Supabase'te; API FastAPI üzerinden güvenli akıyor
