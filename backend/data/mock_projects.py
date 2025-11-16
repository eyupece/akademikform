"""
Mock project data for development and testing.
Bu dosya API_Contract.md'deki project yapısına göre hazırlanmıştır.
"""

from datetime import datetime
from typing import List, Optional
import uuid

# In-memory mock database
MOCK_PROJECTS = {}


def get_mock_user_id():
    """Mock user ID - Auth eklendiğinde gerçek user ID'den gelecek"""
    return "user-mock-123"


def generate_id(prefix: str = ""):
    """UUID oluşturur"""
    return f"{prefix}{str(uuid.uuid4())}"


def create_empty_project(template_id: str, template_name: str, title: str):
    """Boş proje yapısı oluşturur"""
    now = datetime.utcnow()
    project_id = generate_id("project-")
    
    # Varsayılan boş tablolar
    work_schedule_rows = [
        {
            "id": generate_id("ws-"),
            "date_range": "",
            "activities": "",
            "responsible": "",
            "success_criteria_contribution": ""
        }
    ]
    
    risk_management_rows = [
        {
            "id": generate_id("rm-"),
            "risk": "",
            "countermeasure": ""
        }
    ]
    
    research_facilities_rows = [
        {
            "id": generate_id("rf-"),
            "equipment_type_model": "",
            "project_usage": ""
        }
    ]
    
    wide_impact_rows = [
        {
            "id": generate_id("wi-"),
            "category": "Bilimsel/Akademik Çıktılar",
            "category_description": "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
            "outputs": ""
        },
        {
            "id": generate_id("wi-"),
            "category": "Ekonomik/Ticari/Sosyal Çıktılar",
            "category_description": "(Ürün, Prototip, Patent, Faydalı Model, Tescil vb.)",
            "outputs": ""
        },
        {
            "id": generate_id("wi-"),
            "category": "Yeni Proje Oluşturmasına Yönelik Çıktılar",
            "category_description": "(Ulusal/Uluslararası Yeni Proje vb.)",
            "outputs": ""
        }
    ]
    
    # Template'e göre sections oluştur (mock templates'den alınacak)
    sections = []
    # Bu kısmı basit tutalım, gerçekte template'e göre dinamik olacak
    template_sections = get_template_sections(template_id)
    for i, section_title in enumerate(template_sections):
        sections.append({
            "id": generate_id("section-"),
            "project_id": project_id,
            "title": section_title,
            "order": i,
            "draft_content": "",
            "final_content": None,
            "created_at": now.isoformat() + "Z",
            "updated_at": now.isoformat() + "Z"
        })
    
    return {
        "id": project_id,
        "user_id": get_mock_user_id(),
        "template_id": template_id,
        "template_name": template_name,
        "title": title,
        "created_at": now.isoformat() + "Z",
        "updated_at": now.isoformat() + "Z",
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
            "work_schedule": work_schedule_rows,
            "risk_management": risk_management_rows,
            "research_facilities": research_facilities_rows
        },
        "wide_impact": wide_impact_rows,
        "sections": sections
    }


def get_template_sections(template_id: str) -> List[str]:
    """Template'e göre section başlıklarını döndürür"""
    templates_map = {
        "tubitak-2209a": [
            "Projenin Özeti",
            "Araştırma Önerisinin Bilimsel Niteliği",
            "Projenin Yönetimi",
            "Projenin Geniş Etkisi"
        ],
        "tubitak-1001": [
            "Projenin Özeti",
            "Giriş ve Amaç",
            "Literatür Özeti",
            "Materyal ve Yöntem",
            "Bulgular ve Tartışma",
            "Kaynaklar"
        ],
        "tubitak-1003": [
            "Yönetici Özeti",
            "Proje Tanımı",
            "Teknoloji ve Yenilik",
            "İş Planı ve Zaman Çizelgesi",
            "Proje Ekibi ve Organizasyon",
            "Ticari Potansiyel ve Yaygın Etki"
        ]
    }
    return templates_map.get(template_id, ["Projenin Özeti"])


# --- CRUD İşlemleri ---

def get_all_projects(user_id: str, page: int = 1, limit: int = 20):
    """Kullanıcının tüm projelerini listeler"""
    user_projects = [p for p in MOCK_PROJECTS.values() if p["user_id"] == user_id]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = user_projects[start:end]
    
    # Basitleştirilmiş liste için gereksiz alanları kaldır
    simplified = []
    for p in paginated:
        simplified.append({
            "id": p["id"],
            "user_id": p["user_id"],
            "template_id": p["template_id"],
            "template_name": p["template_name"],
            "title": p["title"],
            "created_at": p["created_at"],
            "updated_at": p["updated_at"]
        })
    
    return {
        "projects": simplified,
        "total": len(user_projects),
        "page": page,
        "limit": limit
    }


def get_project_by_id(project_id: str, user_id: str):
    """Belirli bir projeyi getirir"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project:
        return None
    
    # Kullanıcının kendi projesi mi kontrol et
    if project["user_id"] != user_id:
        return None
    
    return project


def create_project(template_id: str, template_name: str, title: str, user_id: str):
    """Yeni proje oluşturur"""
    project = create_empty_project(template_id, template_name, title)
    project["user_id"] = user_id
    MOCK_PROJECTS[project["id"]] = project
    return project


def update_project_title(project_id: str, title: str, user_id: str):
    """Proje başlığını günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["title"] = title
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "id": project["id"],
        "title": project["title"],
        "updated_at": project["updated_at"]
    }


def update_general_info(project_id: str, general_info: dict, user_id: str):
    """Genel bilgileri günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["general_info"] = general_info
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "general_info": project["general_info"],
        "updated_at": project["updated_at"]
    }


def update_keywords(project_id: str, keywords: str, user_id: str):
    """Anahtar kelimeleri günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["keywords"] = keywords
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "keywords": project["keywords"],
        "updated_at": project["updated_at"]
    }


def update_scientific_merit(project_id: str, scientific_merit: dict, user_id: str):
    """Bilimsel niteliği günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["scientific_merit"] = scientific_merit
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "scientific_merit": project["scientific_merit"],
        "updated_at": project["updated_at"]
    }


def update_project_management(project_id: str, project_management: dict, user_id: str):
    """Proje yönetimini günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["project_management"] = project_management
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "project_management": project["project_management"],
        "updated_at": project["updated_at"]
    }


def update_wide_impact(project_id: str, wide_impact: list, user_id: str):
    """Geniş etkiyi günceller"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return None
    
    project["wide_impact"] = wide_impact
    project["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "wide_impact": project["wide_impact"],
        "updated_at": project["updated_at"]
    }


def delete_project(project_id: str, user_id: str):
    """Projeyi siler"""
    project = MOCK_PROJECTS.get(project_id)
    
    if not project or project["user_id"] != user_id:
        return False
    
    del MOCK_PROJECTS[project_id]
    return True

