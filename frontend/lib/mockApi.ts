import type { Project, Section, Revision, Template, AIGenerateResponse } from "@/types";

// Mock Templates
const templates: Template[] = [
  {
    id: "tubitak-2209a",
    name: "TÜBİTAK 2209-A",
    description: "Üniversite öğrencileri araştırma projeleri destek programı",
    sections: [
      {
        title: "Projenin Özeti",
        order: 1,
        placeholder: "Projenizin kısa özetini yazın...",
        min_words: 150,
        max_words: 300,
      },
      {
        title: "Projenin Amacı",
        order: 2,
        placeholder: "Projenizin ana amacını açıklayın...",
        min_words: 200,
        max_words: 400,
      },
      {
        title: "Literatür Özeti",
        order: 3,
        placeholder: "İlgili literatürü özetleyin...",
        min_words: 300,
        max_words: 600,
      },
      {
        title: "Gereç ve Yöntem",
        order: 4,
        placeholder: "Kullanılacak materyal ve yöntemi açıklayın...",
        min_words: 200,
        max_words: 500,
      },
      {
        title: "Beklenen Sonuçlar",
        order: 5,
        placeholder: "Projeden beklediğiniz sonuçları yazın...",
        min_words: 150,
        max_words: 300,
      },
    ],
  },
];

// Mock Projects
const mockProjects: Project[] = [
  {
    id: "1",
    user_id: "user123",
    template_id: "tubitak-2209a",
    template_name: "TÜBİTAK 2209-A",
    title: "Yapay Zeka ile Akademik Metin Analizi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: [
      {
        id: "s1",
        project_id: "1",
        title: "Projenin Özeti",
        order: 1,
        draft_content: "Bu proje yapay zeka kullanarak akademik metinleri analiz etmeyi amaçlamaktadır.",
        final_content: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
];

// Mock API functions
export const mockApi = {
  // Projects
  getProjects: (): Project[] => {
    return mockProjects;
  },

  getProject: (id: string): Project | undefined => {
    return mockProjects.find((p) => p.id === id);
  },

  createProject: (templateId: string, title: string): Project => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) throw new Error("Template not found");

    // Benzersiz ID için timestamp + random sayı
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const newProject: Project = {
      id: projectId,
      user_id: "user123",
      template_id: templateId,
      template_name: template.name,
      title,
      created_at: timestamp,
      updated_at: timestamp,
      sections: template.sections.map((ts, idx) => ({
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${idx}`,
        project_id: projectId,
        title: ts.title,
        order: ts.order,
        draft_content: "",
        final_content: null,
        created_at: timestamp,
        updated_at: timestamp,
      })),
    };

    mockProjects.push(newProject);
    return newProject;
  },

  // Sections
  updateSection: (sectionId: string, draft: string): Section => {
    const project = mockProjects.find((p) =>
      p.sections?.some((s) => s.id === sectionId)
    );
    const section = project?.sections?.find((s) => s.id === sectionId);

    if (!section) throw new Error("Section not found");

    section.draft_content = draft;
    section.updated_at = new Date().toISOString();

    return section;
  },

  acceptRevision: (sectionId: string, content: string): Section => {
    const project = mockProjects.find((p) =>
      p.sections?.some((s) => s.id === sectionId)
    );
    const section = project?.sections?.find((s) => s.id === sectionId);

    if (!section) throw new Error("Section not found");

    section.final_content = content;
    section.updated_at = new Date().toISOString();

    // Revizyon ekle
    if (!section.revisions) section.revisions = [];
    section.revisions.push({
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      section_id: sectionId,
      content,
      revision_number: section.revisions.length + 1,
      created_at: new Date().toISOString(),
    });

    return section;
  },

  getRevisions: (sectionId: string): Revision[] => {
    const project = mockProjects.find((p) =>
      p.sections?.some((s) => s.id === sectionId)
    );
    const section = project?.sections?.find((s) => s.id === sectionId);

    return section?.revisions || [];
  },

  // AI Generate (Mock)
  generateAI: async (draft: string, style: string): Promise<AIGenerateResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock AI response
    const enhanced = `${draft} Bu metin AI tarafından akademik dile dönüştürülmüştür. Bilimsel terminoloji ve formal yapı kullanılmıştır.`;

    return {
      generated_content: enhanced,
    };
  },

  // Templates
  getTemplates: (): Template[] => {
    return templates;
  },

  getTemplate: (id: string): Template | undefined => {
    return templates.find((t) => t.id === id);
  },
};

