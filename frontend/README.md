# Akademik Form Editörü - Frontend

AI destekli akademik doküman editörü frontend uygulaması.

## Teknolojiler

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **TipTap** (Rich text editor)

## Kurulum

```bash
# Paketleri kur
npm install

# Development server başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

## Klasör Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Ana sayfa
│   ├── editor/            # Editör sayfası
│   │   └── [projectId]/
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React componentleri
│   ├── ui/               # UI bileşenleri
│   ├── editor/           # Editor bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── shared/           # Paylaşılan bileşenler
├── lib/                  # Utility fonksiyonlar
│   ├── mockApi.ts       # Mock API (MVP)
│   └── api.ts           # Real API (sonra)
├── types/               # TypeScript tipleri
└── hooks/               # Custom React hooks
```

## MVP Özellikleri

✅ Login / Register ekranları  
✅ Dashboard (proje listesi)  
✅ Mock API ile çalışan data flow  
🔄 Editor (TipTap entegrasyonu) - Devam ediyor  
🔄 AI önerisi & Split view - Devam ediyor  
⏳ Revizyon geçmişi - Bekliyor  
⏳ Export (DOCX/PDF) - Bekliyor  

## Geliştirme Notları

- Mock API kullanılıyor (`lib/mockApi.ts`)
- Gerçek API bağlantısı sonra yapılacak
- Auth sistemi basitleştirilmiş (MVP için)


