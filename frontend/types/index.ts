// Proje türleri
export interface Project {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  title: string;
  created_at: string;
  updated_at: string;
  sections?: Section[];
  // A. GENEL BİLGİLER
  general_info?: {
    applicant_name: string;
    research_title: string;
    advisor_name: string;
    institution: string;
  };
  // Anahtar Kelimeler (Özet bölümüne ait)
  keywords?: string;
  // 1. Bölüm Alt Alanları (Bilimsel Nitelik)
  scientific_merit?: {
    importance_and_quality: string; // 1.1
    aims_and_objectives: string;    // 1.2
  };
  // 3. Bölüm - Proje Yönetimi (Tablolar)
  project_management?: {
    work_schedule: WorkScheduleRow[];      // 3.1 Çalışma Takvimi
    risk_management: RiskManagementRow[];  // 3.2 Risk Yönetimi
    research_facilities: ResearchFacilityRow[]; // 3.3 Araştırma Olanakları
  };
  // 4. Bölüm - Yaygın Etki (Tablo + AI)
  wide_impact?: WideImpactRow[];
}

// 3.1 Çalışma Takvimi satır yapısı
export interface WorkScheduleRow {
  id: string;
  date_range: string;                    // Tarih Aralığı
  activities: string;                    // Faaliyetler
  responsible: string;                   // Kimler tarafından
  success_criteria_contribution: string; // Başarı ölçütü ve katkısı
}

// 3.2 Risk Yönetimi satır yapısı
export interface RiskManagementRow {
  id: string;
  risk: string;           // En Önemli Riskler
  countermeasure: string; // Alınacak Tedbirler (B Planı)
}

// 3.3 Araştırma Olanakları satır yapısı
export interface ResearchFacilityRow {
  id: string;
  equipment_type_model: string; // Altyapı/Ekipman Türü, Modeli
  project_usage: string;        // Projede Kullanım Amacı
}

// 4. Yaygın Etki satır yapısı
export interface WideImpactRow {
  id: string;
  category: string;           // Kategori (sabit)
  category_description: string; // Kategori açıklaması (sabit)
  outputs: string;            // Öngörülen Çıktılar (kullanıcı girer)
}

// Bölüm türleri
export interface Section {
  id: string;
  project_id: string;
  title: string;
  order: number;
  draft_content: string;
  final_content: string | null;
  created_at: string;
  updated_at: string;
  revisions?: Revision[];
}

// Revizyon türleri
export interface Revision {
  id: string;
  section_id: string;
  content: string;
  revision_number: number;
  created_at: string;
}

// AI önerisi türleri
export interface AIGenerateResponse {
  generated_content: string;
}

// Export türleri
export interface ExportRequest {
  project_id: string;
  format: "docx" | "pdf";
}

export interface ExportResponse {
  file_url: string;
  expires_at: string;
}

// Şablon türleri
export interface Template {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
}

export interface TemplateSection {
  title: string;
  order: number;
  placeholder: string;
  min_words?: number;
  max_words?: number;
}

