"""
Pydantic models for Project-related data structures
API_Contract.md'ye göre hazırlanmıştır.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# --- Nested Models ---

class GeneralInfo(BaseModel):
    """A bölümü - Genel Bilgiler"""
    applicant_name: str = ""
    research_title: str = ""
    advisor_name: str = ""
    institution: str = ""


class ScientificMerit(BaseModel):
    """Bilimsel Nitelik (1.1 ve 1.2)"""
    importance_and_quality: str = ""
    aims_and_objectives: str = ""


class WorkScheduleRow(BaseModel):
    """Proje İş Programı - Tablo Satırı"""
    id: str
    date_range: str = ""
    activities: str = ""
    responsible: str = ""
    success_criteria_contribution: str = ""


class RiskManagementRow(BaseModel):
    """Risk Yönetimi - Tablo Satırı"""
    id: str
    risk: str = ""
    countermeasure: str = ""


class ResearchFacilityRow(BaseModel):
    """Araştırma İmkanları - Tablo Satırı"""
    id: str
    equipment_type_model: str = ""
    project_usage: str = ""


class ProjectManagement(BaseModel):
    """Proje Yönetimi (3.1, 3.2, 3.3)"""
    work_schedule: List[WorkScheduleRow] = []
    risk_management: List[RiskManagementRow] = []
    research_facilities: List[ResearchFacilityRow] = []


class WideImpactRow(BaseModel):
    """Projenin Geniş Etkisi - Tablo Satırı"""
    id: str
    category: str
    category_description: str
    outputs: str = ""


class Section(BaseModel):
    """Proje bölümü (section)"""
    id: str
    project_id: str
    title: str
    order: int
    draft_content: str = ""
    final_content: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# --- Main Project Model ---

class Project(BaseModel):
    """Ana proje modeli"""
    id: str
    user_id: str
    template_id: str
    template_name: str
    title: str
    created_at: datetime
    updated_at: datetime
    general_info: GeneralInfo = Field(default_factory=GeneralInfo)
    keywords: str = ""
    scientific_merit: ScientificMerit = Field(default_factory=ScientificMerit)
    project_management: ProjectManagement = Field(default_factory=ProjectManagement)
    wide_impact: List[WideImpactRow] = []
    sections: List[Section] = []


class ProjectListItem(BaseModel):
    """Proje listesi için basitleştirilmiş model"""
    id: str
    user_id: str
    template_id: str
    template_name: str
    title: str
    created_at: datetime
    updated_at: datetime


class ProjectList(BaseModel):
    """Proje listesi response"""
    projects: List[ProjectListItem]
    total: int
    page: int
    limit: int


# --- Request Models ---

class CreateProjectRequest(BaseModel):
    """Yeni proje oluşturma request"""
    template_id: str
    title: str


class UpdateProjectTitleRequest(BaseModel):
    """Proje başlığı güncelleme request"""
    title: str


class UpdateGeneralInfoRequest(BaseModel):
    """Genel bilgiler güncelleme request"""
    applicant_name: str
    research_title: str
    advisor_name: str
    institution: str


class UpdateKeywordsRequest(BaseModel):
    """Anahtar kelimeler güncelleme request"""
    keywords: str


class UpdateScientificMeritRequest(BaseModel):
    """Bilimsel nitelik güncelleme request"""
    importance_and_quality: str
    aims_and_objectives: str


class UpdateProjectManagementRequest(BaseModel):
    """Proje yönetimi güncelleme request"""
    work_schedule: List[WorkScheduleRow]
    risk_management: List[RiskManagementRow]
    research_facilities: List[ResearchFacilityRow]


class UpdateWideImpactRequest(BaseModel):
    """Geniş etki güncelleme request"""
    wide_impact: List[WideImpactRow]

