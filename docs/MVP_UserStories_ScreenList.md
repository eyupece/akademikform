# 📝 MVP – User Stories & Ekranlar

## ✅ User Stories (MVP)

- **Login / Register**
  - Kullanıcı e-posta/şifre ile hesap oluşturabilir veya giriş yapabilir.
  - Kullanıcı giriş yaptıktan sonra kendi projelerine erişebilir.

- **Yeni doküman başlatma**
  - Kullanıcı hazır bir şablon seçer ve yeni proje başlatır.
  - Başlatılan proje veritabanında kullanıcıya özel saklanır.

- **Bölüm yazma ve tarz belirtme**
  - Kullanıcı her bölüm için taslak içerik girer.
  - Kullanıcı yazım tarzını (resmî, akademik, sade) belirtebilir.

- **AI önerisi alma**
  - Kullanıcı taslağını AI toparlar ve akademik dile dönüştürür.
  - AI çıktısı kullanıcıya split view (sol: kendi metni, sağ: AI önerisi) olarak gösterilir.

- **AI önerisini değerlendirme**
  - Kullanıcı AI önerisini **Kabul / Reddet / Revize Et** seçenekleriyle yönetebilir.
  - Kabul edilen revizyonlar veritabanına kaydedilir.

- **Revizyon geçmişi**
  - Kullanıcı her bölüm için önceki sürümlere dönebilir.
  - Revizyon geçmişi modal/side panel üzerinden listelenir.

- **Export (DOCX / PDF)**
  - Kullanıcı dokümanı tamamladığında kurallara uygunluk kontrolü yapılır.
  - Doküman DOCX veya PDF formatında indirilebilir.

---

## 🖼️ MVP Ekranlar

1. **Login / Register**
   - E-posta + şifre giriş/üye ol
   - Google ile giriş (opsiyonel MVP için)

2. **Ana Sayfa (Dashboard)**
   - “Yeni Doküman Başlat” butonu
   - “Geçmiş Projelerim” listesi (kullanıcıya özel projeler)

3. **Bölüm Editörü**
   - Sol tarafta kullanıcı taslağı
   - Sağ tarafta AI önerisi (split view)
   - Inline diff görünümü (highlight edilmiş değişiklikler)
   - Revizyon geçmişi (modal/side panel)
   - Kabul / Reddet / Revize Et butonları
   - Export (DOCX / PDF) butonu

4. **Export İşlemi**
   - Kullanıcı export ettiğinde belge Supabase Storage’a kaydedilir.
   - Kullanıcıya **signed URL** üzerinden indirme linki verilir.

---

## 📌 Not
MVP için toplam **4 ekran yeterlidir**:  
- Login / Register  
- Dashboard  
- Bölüm Editörü  
- Export (işlem ekranı veya buton)  
