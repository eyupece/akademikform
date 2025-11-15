import type { Project, Section, Revision, Template, AIGenerateResponse, WorkScheduleRow, RiskManagementRow, ResearchFacilityRow, WideImpactRow } from "@/types";

// Mock Templates
const templates: Template[] = [
  {
    id: "tubitak-2209a",
    name: "TÜBİTAK 2209-A",
    description: "Üniversite öğrencileri araştırma projeleri destek programı",
    sections: [
      {
        title: "Projenin Özeti",
        order: 0, // Numarasız - A'nın altında
        placeholder: "Projenizin özetini yazın (bilimsel nitelik, yöntem, proje yönetimi, yaygın etki)...",
        min_words: 25,
        max_words: 450,
      },
      {
        title: "Araştırma Önerisinin Bilimsel Niteliği",
        order: 1,
        placeholder: "Bu bölüm 1.1 ve 1.2 alt bölümlerinden oluşur...",
        min_words: 0, // Alt bölümler karakter bazlı
        max_words: 0,
      },
      {
        title: "Yöntem",
        order: 2,
        placeholder: "Araştırmada uygulanacak yöntem ve araştırma tekniklerinin, amaç ve hedeflere ulaşmaya ne düzeyde elverişli olduğu ilgili literatüre atıf yapılarak ortaya konulur. Yöntem bölümünün; araştırma tasarımı, bağımlı ve bağımsız değişkenler, istatistiksel yöntemler vb. unsurları içermesi gerekir...",
        min_words: 0,
        max_words: 0,
      },
      {
        title: "Proje Yönetimi",
        order: 3,
        placeholder: "Bu bölüm 3.1, 3.2 ve 3.3 tablolarından oluşur...",
        min_words: 0,
        max_words: 0,
      },
      {
        title: "Araştırma Önerisinin Yaygın Etkisi",
        order: 4,
        placeholder: "Bu bölüm çıktı kategorilerinden oluşur...",
        min_words: 0,
        max_words: 0,
      },
      {
        title: "Belirtmek İstediğiniz Diğer Konular",
        order: 5,
        placeholder: "Sadece araştırma önerisinin değerlendirilmesine katkı sağlayabilecek bilgi/veri eklenebilir...",
        min_words: 0,
        max_words: 0,
      },
      {
        title: "Kaynakça",
        order: 6,
        placeholder: "Araştırma önerisinde kullandığınız kaynakları yazın...",
        min_words: 0,
        max_words: 0,
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
    general_info: {
      applicant_name: "Ahmet Yılmaz",
      research_title: "Yapay Zeka ile Akademik Metin Analizi",
      advisor_name: "Prof. Dr. Ayşe Demir",
      institution: "İstanbul Teknik Üniversitesi",
    },
    keywords: "yapay zeka, akademik metin, doğal dil işleme",
    scientific_merit: {
      importance_and_quality: "Bu araştırma, yapay zeka alanında önemli bir boşluğu doldurmayı hedeflemektedir...",
      aims_and_objectives: "Bu projenin temel amacı, akademik metin analizini otomatikleştirmektir...",
    },
    project_management: {
      work_schedule: [
        {
          id: "ws-1",
          date_range: "01/09/2024 - 30/11/2024",
          activities: "Literatür taraması ve araştırma planının detaylandırılması",
          responsible: "Proje ekibi tüm üyeleri",
          success_criteria_contribution: "Kapsamlı literatür raporu hazırlanması (%15)",
        },
      ],
      risk_management: [
        {
          id: "rm-1",
          risk: "Veri toplama sürecinde katılımcı bulunamaması",
          countermeasure: "Alternatif veri kaynakları belirlenmesi ve online anket sistemleri kullanımı",
        },
      ],
      research_facilities: [
        {
          id: "rf-1",
          equipment_type_model: "Dell Precision 5820 Tower (Intel Xeon, 64GB RAM)",
          project_usage: "Veri analizi ve yapay zeka modeli eğitimi",
        },
      ],
    },
    wide_impact: [
      {
        id: "wi-1",
        category: "Bilimsel/Akademik Çıktılar",
        category_description: "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
        outputs: "",
      },
      {
        id: "wi-2",
        category: "Ekonomik/Ticari/Sosyal Çıktılar",
        category_description: "(Ürün, Prototip, Patent, Faydalı Model, Tescil, Görsel/İşitsel Arşiv, Envanter/Veri Tabanı, Çalıştay, Eğitim, Bilimsel Etkinlik vb.)",
        outputs: "",
      },
      {
        id: "wi-3",
        category: "Yeni Proje Oluşturmasına Yönelik Çıktılar",
        category_description: "(Ulusal/Uluslararası Yeni Proje vb.)",
        outputs: "",
      },
    ],
    sections: [
      {
        id: "s1",
        project_id: "1",
        title: "Projenin Özeti",
        order: 0,
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
  // Authentication
  register: async (email: string, password: string, fullName: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      user_id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
  },

  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      access_token: "mock-jwt-token-" + Date.now(),
      token_type: "bearer",
      user: {
        user_id: "user-123",
        email,
        full_name: "Mock User",
      },
    };
  },

  forgotPassword: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Mock: Her zaman başarılı döner
    return {
      success: true,
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      email,
    };
  },

  resetPassword: async (token: string, newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock: Token kontrolü yapmadan başarılı döner
    return {
      success: true,
      message: "Şifreniz başarıyla güncellendi.",
    };
  },

  verifyResetToken: async (token: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock: Her token geçerli
    return {
      valid: true,
      email: "user@example.com",
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    };
  },

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
      general_info: {
        applicant_name: "",
        research_title: "",
        advisor_name: "",
        institution: "",
      },
      keywords: "",
      scientific_merit: {
        importance_and_quality: "",
        aims_and_objectives: "",
      },
      project_management: {
        work_schedule: [
          {
            id: "ws-1",
            date_range: "",
            activities: "",
            responsible: "",
            success_criteria_contribution: "",
          },
        ],
        risk_management: [
          {
            id: "rm-1",
            risk: "",
            countermeasure: "",
          },
        ],
        research_facilities: [
          {
            id: "rf-1",
            equipment_type_model: "",
            project_usage: "",
          },
        ],
      },
      wide_impact: [
        {
          id: "wi-1",
          category: "Bilimsel/Akademik Çıktılar",
          category_description: "(Ulusal/Uluslararası Makale, Kitap Bölümü, Kitap, Bildiri vb.)",
          outputs: "",
        },
        {
          id: "wi-2",
          category: "Ekonomik/Ticari/Sosyal Çıktılar",
          category_description: "(Ürün, Prototip, Patent, Faydalı Model, Tescil, Görsel/İşitsel Arşiv, Envanter/Veri Tabanı, Çalıştay, Eğitim, Bilimsel Etkinlik vb.)",
          outputs: "",
        },
        {
          id: "wi-3",
          category: "Yeni Proje Oluşturmasına Yönelik Çıktılar",
          category_description: "(Ulusal/Uluslararası Yeni Proje vb.)",
          outputs: "",
        },
      ],
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

  // ========================================
  // PROJE GÜNCELLEME FONKSİYONLARI
  // ========================================

  // 1. Proje başlığını güncelle
  updateProject: async (projectId: string, title: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.title = title;
    project.updated_at = new Date().toISOString();
    
    return {
      id: project.id,
      title: project.title,
      updated_at: project.updated_at,
    };
  },

  // 2. Genel bilgileri güncelle (A bölümü)
  updateGeneralInfo: async (
    projectId: string,
    generalInfo: {
      applicant_name: string;
      research_title: string;
      advisor_name: string;
      institution: string;
    }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.general_info = generalInfo;
    project.updated_at = new Date().toISOString();
    
    return {
      general_info: project.general_info,
      updated_at: project.updated_at,
    };
  },

  // 3. Anahtar kelimeleri güncelle
  updateKeywords: async (projectId: string, keywords: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.keywords = keywords;
    project.updated_at = new Date().toISOString();
    
    return {
      keywords: project.keywords,
      updated_at: project.updated_at,
    };
  },

  // 4. Bilimsel niteliği güncelle (1.1 ve 1.2)
  updateScientificMerit: async (
    projectId: string,
    scientificMerit: {
      importance_and_quality: string;
      aims_and_objectives: string;
    }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.scientific_merit = scientificMerit;
    project.updated_at = new Date().toISOString();
    
    return {
      scientific_merit: project.scientific_merit,
      updated_at: project.updated_at,
    };
  },

  // 5. Proje yönetimi tablolarını güncelle (3.1, 3.2, 3.3)
  updateProjectManagement: async (
    projectId: string,
    projectManagement: {
      work_schedule: WorkScheduleRow[];
      risk_management: RiskManagementRow[];
      research_facilities: ResearchFacilityRow[];
    }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.project_management = projectManagement;
    project.updated_at = new Date().toISOString();
    
    return {
      project_management: project.project_management,
      updated_at: project.updated_at,
    };
  },

  // 6. Yaygın etki tablosunu güncelle (4. bölüm)
  updateWideImpact: async (projectId: string, wideImpact: WideImpactRow[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    project.wide_impact = wideImpact;
    project.updated_at = new Date().toISOString();
    
    return {
      wide_impact: project.wide_impact,
      updated_at: project.updated_at,
    };
  },

  // 7. Projeyi sil (soft delete)
  deleteProject: async (projectId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = mockProjects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error("Project not found");
    
    // Mock: Gerçek silme işlemi yapılabilir veya soft delete için is_deleted flag eklenebilir
    mockProjects.splice(index, 1);
    
    return { success: true };
  },

  // ========================================
  // AI FONKSİYONLARI
  // ========================================

  // 8. AI ile metin revize et
  reviseAI: async (
    currentContent: string,
    revisionPrompt: string,
    style: string
  ): Promise<AIGenerateResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock: Revizyon talebini içeriğe ekle
    const revised = `${currentContent}\n\n[Revizyon uygulandı: ${revisionPrompt}]\n\nBu metin AI tarafından revize edilmiştir. ${style} tarzında yeniden yazılmıştır.`;
    
    return {
      generated_content: revised,
    };
  },

  // ========================================
  // EXPORT FONKSİYONU
  // ========================================

  // 9. Projeyi export et (DOCX/PDF)
  exportProject: async (projectId: string, format: "docx" | "pdf") => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    
    // Mock: Boş bölüm kontrolü (gerçek implementasyonda yapılacak)
    const incompleteSections = project.sections?.filter(
      (s) => !s.final_content || !s.final_content.trim()
    );
    
    if (incompleteSections && incompleteSections.length > 0) {
      throw new Error(
        `Tüm bölümler tamamlanmalıdır. ${incompleteSections.length} bölüm eksik.`
      );
    }
    
    // Mock: Fake download URL oluştur
    const timestamp = Date.now();
    const fileUrl = `https://mock-storage.supabase.co/exports/${projectId}-${timestamp}.${format}`;
    
    return {
      file_url: fileUrl,
      expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 saat
      format: format,
      file_size_bytes: 245678,
    };
  },
};

