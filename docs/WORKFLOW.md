# 🚀 Geliştirme Akışı (Vibe Coding Tarzı)

## Sıra
1. **Frontend (mock API ile)**  
   - Next.js + TipTap + Tailwind + shadcn/ui kurulumu  
   - Login, Dashboard, Editor, Export UI  
   - Mock API (`utils/mockApi.ts`) → hard-coded JSON döner  
   - UI %90 çalışır hale gelir  

2. **API Contract**  
   - Mock’ta kullanılan request/response body’leri `API_Contract.md` dosyasına sabitle  
   - Endpoint isimleri ve yanıt şekilleri kesinleşir  

3. **Backend (FastAPI + Supabase)**  
   - Contract’a göre endpointleri yaz  
   - Supabase tabloları: users, projects, sections, revisions  
   - Hugging Face entegrasyonu  
   - Export (DOCX/PDF)  

4. **Bağlantı**  
   - Frontend mock çağrılarını backend URL ile değiştir  
   - Loader/hata durumları ekle  

## Notlar
- Öncelik: **MVP akışı çalışır hale gelsin**  
- UI → API → DB → Export sırası takip edilecek  
- Gereksiz optimizasyon yapılmayacak  
- Commit mesajları kısa, net, atomic
