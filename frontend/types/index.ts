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

