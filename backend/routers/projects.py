"""
Projects Router
Proje oluşturma, listeleme, güncelleme ve silme işlemleri.
"""

from fastapi import APIRouter, HTTPException, Query
from models.project import (
    Project,
    ProjectList,
    CreateProjectRequest,
    UpdateProjectTitleRequest,
    UpdateGeneralInfoRequest,
    UpdateKeywordsRequest,
    UpdateScientificMeritRequest,
    UpdateProjectManagementRequest,
    UpdateWideImpactRequest
)
from data.mock_projects import (
    get_all_projects,
    get_project_by_id,
    create_project,
    update_project_title,
    update_general_info,
    update_keywords,
    update_scientific_merit,
    update_project_management,
    update_wide_impact,
    delete_project,
    get_mock_user_id
)
from data.mock_templates import get_template_by_id

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


def get_current_user_id():
    """
    Mock user ID döndürür.
    Auth eklendiğinde JWT token'dan gerçek user ID alınacak.
    """
    return get_mock_user_id()


@router.get("/", response_model=ProjectList)
async def list_projects(
    page: int = Query(1, ge=1, description="Sayfa numarası"),
    limit: int = Query(20, ge=1, le=100, description="Sayfa başına kayıt sayısı")
):
    """
    📁 Kullanıcının tüm projelerini listeler
    
    Args:
        page: Sayfa numarası (default: 1)
        limit: Sayfa başına kayıt (default: 20, max: 100)
        
    Returns:
        ProjectList: Projeler listesi, toplam, sayfa ve limit bilgisi
    """
    user_id = get_current_user_id()
    return get_all_projects(user_id, page, limit)


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """
    📄 Belirli bir projeyi detaylı olarak getirir
    
    Args:
        project_id: Proje ID'si
        
    Returns:
        Project: Proje detayları (bölümler, tablolar, vb. dahil)
        
    Raises:
        HTTPException: Proje bulunamazsa 404 hatası
    """
    user_id = get_current_user_id()
    project = get_project_by_id(project_id, user_id)
    
    if not project:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return project


@router.post("/", response_model=Project, status_code=201)
async def create_new_project(request: CreateProjectRequest):
    """
    ➕ Yeni proje oluşturur
    
    Args:
        request: template_id ve title içerir
        
    Returns:
        Project: Oluşturulan proje (boş bölümlerle birlikte)
        
    Raises:
        HTTPException: Template bulunamazsa 404 hatası
    """
    user_id = get_current_user_id()
    
    # Template'in var olduğunu kontrol et
    template = get_template_by_id(request.template_id)
    if not template:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "template_not_found",
                "message": f"'{request.template_id}' ID'li şablon bulunamadı."
            }
        )
    
    # Yeni proje oluştur
    project = create_project(
        template_id=request.template_id,
        template_name=template["name"],
        title=request.title,
        user_id=user_id
    )
    
    return project


@router.patch("/{project_id}")
async def update_project(project_id: str, request: UpdateProjectTitleRequest):
    """
    ✏️ Proje başlığını günceller
    
    Args:
        project_id: Proje ID'si
        request: Yeni başlık
        
    Returns:
        dict: Güncellenmiş başlık ve timestamp
        
    Raises:
        HTTPException: Proje bulunamazsa 404 hatası
    """
    user_id = get_current_user_id()
    result = update_project_title(project_id, request.title, user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.patch("/{project_id}/general-info")
async def update_project_general_info(project_id: str, request: UpdateGeneralInfoRequest):
    """
    📝 Genel bilgileri (A bölümü) günceller
    
    Args:
        project_id: Proje ID'si
        request: Genel bilgiler (applicant_name, research_title, vb.)
        
    Returns:
        dict: Güncellenmiş general_info ve timestamp
    """
    user_id = get_current_user_id()
    result = update_general_info(project_id, request.model_dump(), user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.patch("/{project_id}/keywords")
async def update_project_keywords(project_id: str, request: UpdateKeywordsRequest):
    """
    🔑 Anahtar kelimeleri günceller
    
    Args:
        project_id: Proje ID'si
        request: Anahtar kelimeler
        
    Returns:
        dict: Güncellenmiş keywords ve timestamp
    """
    user_id = get_current_user_id()
    result = update_keywords(project_id, request.keywords, user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.patch("/{project_id}/scientific-merit")
async def update_project_scientific_merit(project_id: str, request: UpdateScientificMeritRequest):
    """
    🔬 Bilimsel Nitelik (1.1 ve 1.2) günceller
    
    Args:
        project_id: Proje ID'si
        request: Bilimsel nitelik bilgileri
        
    Returns:
        dict: Güncellenmiş scientific_merit ve timestamp
    """
    user_id = get_current_user_id()
    result = update_scientific_merit(project_id, request.model_dump(), user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.patch("/{project_id}/project-management")
async def update_project_project_management(project_id: str, request: UpdateProjectManagementRequest):
    """
    📊 Proje Yönetimi tablolarını (3.1, 3.2, 3.3) günceller
    
    Args:
        project_id: Proje ID'si
        request: İş programı, risk yönetimi, araştırma imkanları
        
    Returns:
        dict: Güncellenmiş project_management ve timestamp
    """
    user_id = get_current_user_id()
    result = update_project_management(project_id, request.model_dump(), user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.patch("/{project_id}/wide-impact")
async def update_project_wide_impact(project_id: str, request: UpdateWideImpactRequest):
    """
    🌍 Projenin Geniş Etkisi tablosunu günceller
    
    Args:
        project_id: Proje ID'si
        request: Geniş etki verileri
        
    Returns:
        dict: Güncellenmiş wide_impact ve timestamp
    """
    user_id = get_current_user_id()
    
    # List[WideImpactRow] -> list of dicts
    wide_impact_data = [item.model_dump() for item in request.wide_impact]
    result = update_wide_impact(project_id, wide_impact_data, user_id)
    
    if not result:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return result


@router.delete("/{project_id}", status_code=204)
async def delete_project_endpoint(project_id: str):
    """
    🗑️ Projeyi siler
    
    Args:
        project_id: Proje ID'si
        
    Returns:
        None (204 No Content)
        
    Raises:
        HTTPException: Proje bulunamazsa 404 hatası
    """
    user_id = get_current_user_id()
    success = delete_project(project_id, user_id)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "project_not_found",
                "message": f"'{project_id}' ID'li proje bulunamadı."
            }
        )
    
    return None

