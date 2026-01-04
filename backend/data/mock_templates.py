"""
Mock template data for development and testing.
Bu dosya API_Contract.md'deki template yapısına göre hazırlanmıştır.
"""

MOCK_TEMPLATES = [
    {
        "id": "tubitak-2209a",
        "name": "TÜBİTAK 2209-A",
        "description": "Üniversite öğrencileri araştırma projeleri destek programı",
        "sections": [
            {
                "title": "Projenin Özeti",
                "order": 0,
                "placeholder": "Projenizin özetini yazın (bilimsel nitelik, yöntem, proje yönetimi, yaygın etki)...",
                "min_words": 25,
                "max_words": 450
            },
            {
                "title": "Araştırma Önerisinin Bilimsel Niteliği",
                "order": 1,
                "placeholder": "Bu bölüm 1.1 ve 1.2 alt bölümlerinden oluşur...",
                "min_words": 0,
                "max_words": 0
            },
            {
                "title": "Yöntem",
                "order": 2,
                "placeholder": "Araştırmada uygulanacak yöntem ve araştırma tekniklerinin, amaç ve hedeflere ulaşmaya ne düzeyde elverişli olduğu ilgili literatüre atıf yapılarak ortaya konulur...",
                "min_words": 0,
                "max_words": 0
            },
            {
                "title": "Proje Yönetimi",
                "order": 3,
                "placeholder": "Bu bölüm 3.1, 3.2 ve 3.3 tablolarından oluşur...",
                "min_words": 0,
                "max_words": 0
            },
            {
                "title": "Araştırma Önerisinin Yaygın Etkisi",
                "order": 4,
                "placeholder": "Bu bölüm çıktı kategorilerinden oluşur...",
                "min_words": 0,
                "max_words": 0
            },
            {
                "title": "Belirtmek İstediğiniz Diğer Konular",
                "order": 5,
                "placeholder": "Sadece araştırma önerisinin değerlendirilmesine katkı sağlayabilecek bilgi/veri eklenebilir...",
                "min_words": 0,
                "max_words": 0
            },
            {
                "title": "Kaynakça",
                "order": 6,
                "placeholder": "Araştırma önerisinde kullandığınız kaynakları yazın...",
                "min_words": 0,
                "max_words": 0
            }
        ]
    },
    {
        "id": "tubitak-1001",
        "name": "TÜBİTAK 1001 - Bilimsel ve Teknolojik Araştırma Projelerini Destekleme Programı",
        "description": "Bilim insanlarının özgün araştırma projelerini destekleyen ulusal program",
        "sections": [
            {
                "title": "Projenin Özeti",
                "order": 0,
                "placeholder": "Projenizin özetini yazın (max 1 sayfa)...",
                "min_words": 50,
                "max_words": 500
            },
            {
                "title": "Giriş ve Amaç",
                "order": 1,
                "placeholder": "Araştırmanın amacını ve önemini açıklayın...",
                "min_words": 100,
                "max_words": 1000
            },
            {
                "title": "Literatür Özeti",
                "order": 2,
                "placeholder": "İlgili literatürü özetleyin ve araştırmanızın katkısını belirtin...",
                "min_words": 200,
                "max_words": 2000
            },
            {
                "title": "Materyal ve Yöntem",
                "order": 3,
                "placeholder": "Kullanılacak materyal ve yöntemleri detaylı açıklayın...",
                "min_words": 150,
                "max_words": 1500
            },
            {
                "title": "Bulgular ve Tartışma",
                "order": 4,
                "placeholder": "Beklenen bulguları ve tartışmayı açıklayın...",
                "min_words": 100,
                "max_words": 1000
            },
            {
                "title": "Kaynaklar",
                "order": 5,
                "placeholder": "Referanslarınızı listeleyin...",
                "min_words": 0,
                "max_words": 0
            }
        ]
    },
    {
        "id": "tubitak-1003",
        "name": "TÜBİTAK 1003 - Öncelikli Alanlar Araştırma Teknoloji Geliştirme ve Yenilik Projeleri Destekleme Programı",
        "description": "Türkiye'nin öncelikli alanlarında teknoloji geliştirme ve yenilik projelerini destekleyen program",
        "sections": [
            {
                "title": "Yönetici Özeti",
                "order": 0,
                "placeholder": "Projenin yönetici özetini yazın...",
                "min_words": 100,
                "max_words": 800
            },
            {
                "title": "Proje Tanımı",
                "order": 1,
                "placeholder": "Projenizi detaylı tanımlayın...",
                "min_words": 200,
                "max_words": 2000
            },
            {
                "title": "Teknoloji ve Yenilik",
                "order": 2,
                "placeholder": "Teknolojik yenilik ve katkıları açıklayın...",
                "min_words": 150,
                "max_words": 1500
            },
            {
                "title": "İş Planı ve Zaman Çizelgesi",
                "order": 3,
                "placeholder": "İş paketlerini ve zaman çizelgesini belirtin...",
                "min_words": 100,
                "max_words": 1000
            },
            {
                "title": "Proje Ekibi ve Organizasyon",
                "order": 4,
                "placeholder": "Proje ekibini ve organizasyon yapısını açıklayın...",
                "min_words": 50,
                "max_words": 500
            },
            {
                "title": "Ticari Potansiyel ve Yaygın Etki",
                "order": 5,
                "placeholder": "Projenin ticari potansiyelini ve toplumsal etkisini açıklayın...",
                "min_words": 100,
                "max_words": 1000
            }
        ]
    }
]


def get_all_templates():
    """Tüm şablonları döndürür"""
    return MOCK_TEMPLATES


def get_template_by_id(template_id: str):
    """Belirli bir şablonu ID'ye göre döndürür"""
    for template in MOCK_TEMPLATES:
        if template["id"] == template_id:
            return template
    return None

