import type { Section, Project } from "@/types";

export type SectionStatus = "empty" | "draft" | "ai-suggested" | "completed";

/**
 * Bölümün mevcut durumunu hesaplar
 */
export function getSectionStatus(section: Section, aiSuggestion?: string): SectionStatus {
  // Kabul edilmiş içerik varsa tamamlanmış
  if (section.final_content && section.final_content.trim()) {
    return "completed";
  }
  
  // AI önerisi varsa (runtime state'ten)
  if (aiSuggestion && aiSuggestion.trim()) {
    return "ai-suggested";
  }
  
  // Taslak içerik varsa
  if (section.draft_content && section.draft_content.trim()) {
    return "draft";
  }
  
  // Hiçbiri yoksa boş
  return "empty";
}

/**
 * Proje ilerleme yüzdesini hesaplar
 */
export function calculateProgress(project: Project): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = project.sections?.length || 0;
  const completed = project.sections?.filter(s => s.final_content?.trim()).length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}

/**
 * Bölüm durum istatistiklerini hesaplar
 */
export function getSectionStats(sections: Section[], sectionStates?: Record<string, { aiSuggestion: string }>) {
  const stats = {
    empty: 0,
    draft: 0,
    aiSuggested: 0,
    completed: 0,
  };
  
  sections.forEach(section => {
    const aiSuggestion = sectionStates?.[section.id]?.aiSuggestion || "";
    const status = getSectionStatus(section, aiSuggestion);
    
    switch (status) {
      case "empty":
        stats.empty++;
        break;
      case "draft":
        stats.draft++;
        break;
      case "ai-suggested":
        stats.aiSuggested++;
        break;
      case "completed":
        stats.completed++;
        break;
    }
  });
  
  return stats;
}

/**
 * Durum için badge bilgilerini döndürür
 */
export function getStatusBadgeProps(status: SectionStatus): {
  label: string;
  variant: "empty" | "draft" | "ai-suggested" | "completed";
  icon: string;
} {
  switch (status) {
    case "completed":
      return { label: "Tamamlandı", variant: "completed", icon: "✓" };
    case "ai-suggested":
      return { label: "AI Önerisi", variant: "ai-suggested", icon: "✨" };
    case "draft":
      return { label: "Taslak", variant: "draft", icon: "📝" };
    case "empty":
      return { label: "Boş", variant: "empty", icon: "○" };
  }
}

