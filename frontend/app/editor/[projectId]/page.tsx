"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { mockApi } from "@/lib/mockApi";
import type { Project, Section } from "@/types";
import EditorComponent from "@/components/editor/EditorComponent";
import SplitView from "@/components/editor/SplitView";
import ToastContainer, { type ToastItem } from "@/components/shared/ToastContainer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import DynamicTable from "@/components/ui/DynamicTable";
import { calculateProgress, getSectionStatus, getStatusBadgeProps } from "@/lib/sectionHelpers";
import type { WorkScheduleRow, RiskManagementRow, ResearchFacilityRow, WideImpactRow } from "@/types";

// Bölüm bazlı state yönetimi için tip
type SectionState = {
  draft: string;
  aiSuggestion: string;
  viewMode: "single" | "split";
  loading: boolean;
  styleInput: string;
  revisionPrompt: string;
  showRevisionInput: boolean;
};

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const projectId = params.projectId as string;
  const templateId = searchParams.get("template");

  const [project, setProject] = useState<Project | null>(null);
  // Her bölüm için ayrı state (sectionId -> state)
  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>({});

  // Inline editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // General info state
  const [generalInfo, setGeneralInfo] = useState({
    applicant_name: "",
    research_title: "",
    advisor_name: "",
    institution: "",
  });

  // Keywords state
  const [keywords, setKeywords] = useState("");

  // Scientific Merit state (1.1 ve 1.2)
  const [scientificMerit, setScientificMerit] = useState({
    importance_and_quality: "",
    aims_and_objectives: "",
  });

  // Scientific Merit AI states
  const [scientificMeritAI, setScientificMeritAI] = useState({
    importance_ai: "",
    aims_ai: "",
    importance_loading: false,
    aims_loading: false,
    importance_view: "single" as "single" | "split",
    aims_view: "single" as "single" | "split",
    importance_revision_prompt: "",
    aims_revision_prompt: "",
    importance_show_revision: false,
    aims_show_revision: false,
  });

  // Project Management state (3. Bölüm - Tablolar)
  const [projectManagement, setProjectManagement] = useState<{
    work_schedule: WorkScheduleRow[];
    risk_management: RiskManagementRow[];
    research_facilities: ResearchFacilityRow[];
  }>({
    work_schedule: [],
    risk_management: [],
    research_facilities: [],
  });

  // Wide Impact state (4. Bölüm - Tablo + AI)
  const [wideImpact, setWideImpact] = useState<WideImpactRow[]>([]);
  
  // Wide Impact AI states (her satır için ayrı)
  const [wideImpactAI, setWideImpactAI] = useState<Record<string, {
    suggestion: string;
    loading: boolean;
    viewMode: "single" | "split";
    revisionPrompt: string;
    showRevisionInput: boolean;
  }>>({});

  // Toast states - stack için array
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Proje yükleme
  useEffect(() => {
    let loadedProject: Project | null = null;

    if (projectId === "new" && templateId) {
      // Yeni proje oluştur - default "Yeni Proje" ismiyle
      loadedProject = mockApi.createProject(templateId, "Yeni Proje");
    } else {
      // Mevcut projeyi yükle
      loadedProject = mockApi.getProject(projectId) || null;
    }

    if (loadedProject) {
      setProject(loadedProject);
      
      // General info'yu yükle
      if (loadedProject.general_info) {
        setGeneralInfo(loadedProject.general_info);
      }

      // Keywords'ü yükle
      if (loadedProject.keywords) {
        setKeywords(loadedProject.keywords);
      }

      // Scientific merit'i yükle
      if (loadedProject.scientific_merit) {
        setScientificMerit(loadedProject.scientific_merit);
      }

      // Project management'i yükle
      if (loadedProject.project_management) {
        setProjectManagement(loadedProject.project_management);
      }

      // Wide impact'i yükle
      if (loadedProject.wide_impact) {
        setWideImpact(loadedProject.wide_impact);
        // Her satır için AI state'ini initialize et
        const initialAIStates: Record<string, { suggestion: string; loading: boolean; viewMode: "single" | "split"; revisionPrompt: string; showRevisionInput: boolean }> = {};
        loadedProject.wide_impact.forEach((row) => {
          initialAIStates[row.id] = {
            suggestion: "",
            loading: false,
            viewMode: "single",
            revisionPrompt: "",
            showRevisionInput: false,
          };
        });
        setWideImpactAI(initialAIStates);
      }
      
      // Tüm bölümler için initial state oluştur
      const initialStates: Record<string, SectionState> = {};
      loadedProject.sections?.forEach((section) => {
        initialStates[section.id] = {
          draft: section.draft_content,
          aiSuggestion: "",
          viewMode: "single",
          loading: false,
          styleInput: "Akademik, bilimsel ve profesyonel",
          revisionPrompt: "",
          showRevisionInput: false,
        };
      });
      setSectionStates(initialStates);
    }
  }, [projectId, templateId]);

  // Proje başlığını düzenle
  const handleStartEditingTitle = () => {
    if (project) {
      setTempTitle(project.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = () => {
    if (project && tempTitle.trim()) {
      // Mock API'de güncelleme yok, sadece state'i güncelle
      setProject({ ...project, title: tempTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEditTitle();
    }
  };

  const showToast = (
    message: string,
    type: "info" | "success" | "error" | "warning" = "info"
  ) => {
    const newToast: ToastItem = {
      id: Date.now().toString(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Bölüm state'ini güncelle
  const updateSectionState = (sectionId: string, updates: Partial<SectionState>) => {
    setSectionStates((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        ...updates,
      },
    }));
  };

  // AI önerisi al (bölüm bazlı)
  const handleGenerateAI = async (sectionId: string) => {
    const sectionState = sectionStates[sectionId];
    if (!sectionState || !sectionState.draft.trim()) {
      showToast("Lütfen önce taslak metin girin!", "warning");
      return;
    }

    updateSectionState(sectionId, { loading: true });
    try {
      const response = await mockApi.generateAI(sectionState.draft, sectionState.styleInput);
      updateSectionState(sectionId, {
        aiSuggestion: response.generated_content,
        viewMode: "split",
        loading: false,
      });
    } catch (error) {
      console.error("AI generation error:", error);
      showToast("AI önerisi alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
      updateSectionState(sectionId, { loading: false });
    }
  };

  // AI önerisini kabul et (bölüm bazlı)
  const handleAccept = (sectionId: string) => {
    const sectionState = sectionStates[sectionId];
    if (!sectionState || !sectionState.aiSuggestion) return;

    mockApi.acceptRevision(sectionId, sectionState.aiSuggestion);
    updateSectionState(sectionId, {
      draft: sectionState.aiSuggestion,
      aiSuggestion: "",
      viewMode: "single",
    });
    showToast("Revizyon başarıyla kaydedildi!", "success");
  };

  // AI önerisini reddet (bölüm bazlı)
  const handleReject = (sectionId: string) => {
    updateSectionState(sectionId, {
      aiSuggestion: "",
      viewMode: "single",
      revisionPrompt: "",
      showRevisionInput: false,
    });
  };

  // Revizyonu tekrar iste (bölüm bazlı)
  const handleRevise = async (sectionId: string, customPrompt: string) => {
    const sectionState = sectionStates[sectionId];
    if (!sectionState) return;

    updateSectionState(sectionId, { 
      loading: true,
      showRevisionInput: false,
    });
    try {
      const response = await mockApi.generateAI(
        sectionState.draft + "\n\n[Revizyon talebi: " + customPrompt + "]",
        sectionState.styleInput
      );
      updateSectionState(sectionId, {
        aiSuggestion: response.generated_content,
        loading: false,
        revisionPrompt: "",
      });
      showToast("Revizyon tamamlandı!", "success");
    } catch (error) {
      console.error("AI revision error:", error);
      showToast("Revizyon alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
      updateSectionState(sectionId, { loading: false });
    }
  };

  // Bölüme scroll et
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // General info güncelle
  const updateGeneralInfo = (field: string, value: string) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
    if (project) {
      setProject({
        ...project,
        general_info: { ...generalInfo, [field]: value },
      });
    }
  };

  // Keywords güncelle
  const updateKeywords = (value: string) => {
    setKeywords(value);
    if (project) {
      setProject({
        ...project,
        keywords: value,
      });
    }
  };

  // Scientific merit güncelle
  const updateScientificMerit = (field: string, value: string) => {
    setScientificMerit((prev) => ({ ...prev, [field]: value }));
    if (project) {
      setProject({
        ...project,
        scientific_merit: { ...scientificMerit, [field]: value },
      });
    }
  };

  // Scientific Merit AI işlemleri
  const handleGenerateScientificMeritAI = async (field: "importance" | "aims") => {
    const content = field === "importance" 
      ? scientificMerit.importance_and_quality 
      : scientificMerit.aims_and_objectives;

    if (!content.trim()) {
      showToast("Lütfen önce taslak metin girin!", "warning");
      return;
    }

    const loadingKey = field === "importance" ? "importance_loading" : "aims_loading";
    setScientificMeritAI((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await mockApi.generateAI(content, "Akademik, bilimsel ve profesyonel");
      const aiKey = field === "importance" ? "importance_ai" : "aims_ai";
      const viewKey = field === "importance" ? "importance_view" : "aims_view";
      
      setScientificMeritAI((prev) => ({
        ...prev,
        [aiKey]: response.generated_content,
        [viewKey]: "split",
        [loadingKey]: false,
      }));
    } catch (error) {
      console.error("AI generation error:", error);
      showToast("AI önerisi alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
      setScientificMeritAI((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleAcceptScientificMeritAI = (field: "importance" | "aims") => {
    const aiContent = field === "importance" 
      ? scientificMeritAI.importance_ai 
      : scientificMeritAI.aims_ai;
    
    const fieldName = field === "importance" ? "importance_and_quality" : "aims_and_objectives";
    updateScientificMerit(fieldName, aiContent);
    
    const aiKey = field === "importance" ? "importance_ai" : "aims_ai";
    const viewKey = field === "importance" ? "importance_view" : "aims_view";
    
    setScientificMeritAI((prev) => ({
      ...prev,
      [aiKey]: "",
      [viewKey]: "single",
    }));
    
    showToast("Revizyon başarıyla kaydedildi!", "success");
  };

  const handleRejectScientificMeritAI = (field: "importance" | "aims") => {
    const aiKey = field === "importance" ? "importance_ai" : "aims_ai";
    const viewKey = field === "importance" ? "importance_view" : "aims_view";
    const revisionPromptKey = field === "importance" ? "importance_revision_prompt" : "aims_revision_prompt";
    const showRevisionKey = field === "importance" ? "importance_show_revision" : "aims_show_revision";
    
    setScientificMeritAI((prev) => ({
      ...prev,
      [aiKey]: "",
      [viewKey]: "single",
      [revisionPromptKey]: "",
      [showRevisionKey]: false,
    }));
  };

  const handleReviseScientificMeritAI = async (field: "importance" | "aims", revisionPrompt: string) => {
    const loadingKey = field === "importance" ? "importance_loading" : "aims_loading";
    const aiKey = field === "importance" ? "importance_ai" : "aims_ai";
    const content = field === "importance" ? scientificMerit.importance_and_quality : scientificMerit.aims_and_objectives;
    const revisionPromptKey = field === "importance" ? "importance_revision_prompt" : "aims_revision_prompt";
    const showRevisionKey = field === "importance" ? "importance_show_revision" : "aims_show_revision";

    setScientificMeritAI((prev) => ({ 
      ...prev, 
      [loadingKey]: true,
      [showRevisionKey]: false,
    }));

    try {
      const response = await mockApi.generateAI(
        content + "\n\n[Revizyon talebi: " + revisionPrompt + "]",
        "Akademik, bilimsel ve profesyonel"
      );
      setScientificMeritAI((prev) => ({
        ...prev,
        [aiKey]: response.generated_content,
        [loadingKey]: false,
        [revisionPromptKey]: "",
      }));
      showToast("Revizyon tamamlandı!", "success");
    } catch (error) {
      console.error("AI revision error:", error);
      showToast("Revizyon alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
      setScientificMeritAI((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Project Management tablo güncellemeleri
  const updateWorkSchedule = (data: WorkScheduleRow[]) => {
    setProjectManagement((prev) => ({ ...prev, work_schedule: data }));
    if (project) {
      setProject({
        ...project,
        project_management: { ...projectManagement, work_schedule: data },
      });
    }
  };

  const updateRiskManagement = (data: RiskManagementRow[]) => {
    setProjectManagement((prev) => ({ ...prev, risk_management: data }));
    if (project) {
      setProject({
        ...project,
        project_management: { ...projectManagement, risk_management: data },
      });
    }
  };

  const updateResearchFacilities = (data: ResearchFacilityRow[]) => {
    setProjectManagement((prev) => ({ ...prev, research_facilities: data }));
    if (project) {
      setProject({
        ...project,
        project_management: { ...projectManagement, research_facilities: data },
      });
    }
  };

  // Wide Impact güncelleme
  const updateWideImpactRow = (rowId: string, outputs: string) => {
    setWideImpact((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, outputs } : row))
    );
    if (project) {
      const updatedWideImpact = wideImpact.map((row) =>
        row.id === rowId ? { ...row, outputs } : row
      );
      setProject({
        ...project,
        wide_impact: updatedWideImpact,
      });
    }
  };

  // Wide Impact AI önerisi al
  const handleGenerateWideImpactAI = async (rowId: string, category: string, userInput: string) => {
      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: { 
          ...prev[rowId], 
          loading: true,
          suggestion: prev[rowId]?.suggestion || "",
          viewMode: prev[rowId]?.viewMode || "single",
          revisionPrompt: prev[rowId]?.revisionPrompt || "",
          showRevisionInput: prev[rowId]?.showRevisionInput || false,
        },
      }));

    try {
      const response = await mockApi.generateAI(
        `Kategori: ${category}\n\nMevcut içerik:\n${userInput || "(Boş)"}\n\n[TÜBİTAK 2209-A projesinin 'Yaygın Etki' bölümü için öneriler oluşturun.]`,
        "Akademik, bilimsel ve profesyonel"
      );

      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: {
          suggestion: response.generated_content,
          loading: false,
          viewMode: "split",
          revisionPrompt: "",
          showRevisionInput: false,
        },
      }));
    } catch (error) {
      console.error("AI önerisi alınamadı:", error);
      showToast("AI önerisi alınamadı", "error");
      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: { ...prev[rowId], loading: false },
      }));
    }
  };

  // Wide Impact AI önerisi kabul et
  const handleAcceptWideImpactAI = (rowId: string) => {
    const aiState = wideImpactAI[rowId];
    if (aiState?.suggestion) {
      updateWideImpactRow(rowId, aiState.suggestion);
      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: { 
          suggestion: "", 
          loading: false, 
          viewMode: "single",
          revisionPrompt: "",
          showRevisionInput: false,
        },
      }));
      showToast("AI önerisi uygulandı!", "success");
    }
  };

  // Wide Impact AI önerisi reddet
  const handleRejectWideImpactAI = (rowId: string) => {
    setWideImpactAI((prev) => ({
      ...prev,
      [rowId]: { 
        suggestion: "", 
        loading: false, 
        viewMode: "single",
        revisionPrompt: "",
        showRevisionInput: false,
      },
    }));
  };

  // Wide Impact AI revize et
  const handleReviseWideImpactAI = async (rowId: string, revisionPrompt: string) => {
    const row = wideImpact.find((r) => r.id === rowId);
    if (!row) return;

    setWideImpactAI((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], loading: true, showRevisionInput: false },
    }));

    try {
      const response = await mockApi.generateAI(
        `Kategori: ${row.category}\n\nMevcut içerik:\n${row.outputs || "(Boş)"}\n\n[Revizyon talebi: ${revisionPrompt}]`,
        "Akademik, bilimsel ve profesyonel"
      );

      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: {
          suggestion: response.generated_content,
          loading: false,
          viewMode: "split",
          revisionPrompt: "",
          showRevisionInput: false,
        },
      }));
      showToast("Revizyon tamamlandı!", "success");
    } catch (error) {
      console.error("AI revision error:", error);
      showToast("Revizyon alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
      setWideImpactAI((prev) => ({
        ...prev,
        [rowId]: { ...prev[rowId], loading: false },
      }));
    }
  };

  // Export
  const handleExport = (format: "docx" | "pdf") => {
    showToast(`${format.toUpperCase()} export özelliği yakında eklenecek!`, "info");
  };

  // Loading check
  if (!project || Object.keys(sectionStates).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-shade-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-para-base text-gray-600">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-shade-light">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary shadow-lg relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-10 right-40 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-5 left-60 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Dashboard'a Dön
              </button>
              
              {/* Editable Title */}
              <div className="flex items-center gap-3">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={handleTitleKeyPress}
                      onBlur={handleSaveTitle}
                      className="text-3xl font-bold text-white border-b-2 border-white/50 focus:outline-none bg-transparent focus:border-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEditTitle}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group">
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {project.title}
                    </h1>
                    <button
                      onClick={handleStartEditingTitle}
                      className="p-2 bg-white/0 rounded-lg hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                      title="Başlığı düzenle"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-white/80 text-sm mt-1">{project.template_name}</p>
              
              {/* Progress Indicator */}
              <div className="mt-4 max-w-md">
                <ProgressBar
                  value={calculateProgress(project).completed}
                  max={calculateProgress(project).total}
                  showLabel={true}
                  size="sm"
                  variant={calculateProgress(project).percentage === 100 ? "success" : "primary"}
                  className="[&_span]:text-white/90 [&_span:last-child]:text-white [&_div:first-child]:bg-white/20"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport("docx")}
                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-200 border border-white/30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export DOCX
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="px-5 py-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 border border-red-400/30 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar - Bölüm Listesi (scroll navigation) */}
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                BÖLÜMLER
              </h3>
            </div>
            <div className="space-y-1.5">
              {/* A. GENEL BİLGİLER Navigation */}
              <button
                onClick={() => {
                  const element = document.getElementById('general-info-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="group w-full text-left text-sm text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-brand-primary/20"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    A
                  </span>
                  <span className="flex-1 leading-tight font-medium group-hover:text-brand-primary transition-colors">
                    Genel Bilgiler
                  </span>
                </div>
              </button>

              {/* Sections Navigation */}
              {project.sections?.map((section) => {
                const sectionState = sectionStates[section.id];
                const status = getSectionStatus(section, sectionState?.aiSuggestion);
                const badgeInfo = getStatusBadgeProps(status);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group w-full text-left text-sm text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-brand-primary/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        {section.order === 0 ? '📄' : section.order}
                      </span>
                      <div className="flex-1">
                        <span className="leading-tight font-medium group-hover:text-brand-primary transition-colors block mb-1.5">
                          {section.title}
                        </span>
                        {/* Status Badge - Başlığın hemen altında */}
                        <Badge variant={badgeInfo.variant} className="text-xs px-2 py-0.5 inline-block">
                          {badgeInfo.icon} {badgeInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Editor Area - Tüm bölümler alt alta */}
        <main className="flex-1 overflow-y-auto bg-shade-light">
          <div className="max-w-7xl mx-auto p-6 space-y-16">
            {/* A. GENEL BİLGİLER */}
            <section id="general-info-section" className="scroll-mt-6 bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  GENEL BİLGİLER
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Başvuru Sahibinin Adı Soyadı
                  </label>
                  <input
                    type="text"
                    value={generalInfo.applicant_name}
                    onChange={(e) => updateGeneralInfo("applicant_name", e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Araştırma Önerisinin Başlığı
                  </label>
                  <input
                    type="text"
                    value={generalInfo.research_title}
                    onChange={(e) => updateGeneralInfo("research_title", e.target.value)}
                    placeholder="Araştırma başlığınız"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Danışmanın Adı Soyadı
                  </label>
                  <input
                    type="text"
                    value={generalInfo.advisor_name}
                    onChange={(e) => updateGeneralInfo("advisor_name", e.target.value)}
                    placeholder="Danışman adı soyadı"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Araştırmanın Yürütüleceği Kurum/Kuruluş
                  </label>
                  <input
                    type="text"
                    value={generalInfo.institution}
                    onChange={(e) => updateGeneralInfo("institution", e.target.value)}
                    placeholder="Üniversite veya kurum adı"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  />
                </div>
              </div>
            </section>

            {/* Her bölüm için render */}
            {project.sections?.map((section, index) => {
              const sectionState = sectionStates[section.id];
              if (!sectionState) return null;

              // Özet bölümü mü kontrol et (order = 0)
              const isOzetSection = section.order === 0;
              
              // Bilimsel Nitelik bölümü mü? (order = 1)
              const isScientificMeritSection = section.order === 1;
              
              // Yöntem bölümü mü? (order = 2) - Min 350 karakter uyarısı için
              const isYontemSection = section.order === 2;
              
              // Proje Yönetimi bölümü mü? (order = 3)
              const isProjectManagementSection = section.order === 3;
              
              // Yaygın Etki bölümü mü? (order = 4)
              const isWideImpactSection = section.order === 4;
              
              // Diğer Konular bölümü mü? (order = 5)
              const isOtherTopicsSection = section.order === 5;
              
              // Kaynakça bölümü mü? (order = 6) - AI önerisi yok
              const isReferencesSection = section.order === 6;
              
              // İlk numaralı bölüm mü? (order >= 1 olan ilk bölüm)
              const isFirstNumberedSection = section.order === 1;

              return (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  className="scroll-mt-6"
                >
                  {/* Ayırıcı: A ve Özet arasında + Özet ve numaralı bölümler arasında */}
                  {(index === 0 || isFirstNumberedSection) && (
                    <div className="mb-8 border-t-2 border-gray-200 pt-8">
                      <div className="text-center text-sm text-gray-400 -mt-4 mb-4">
                        <span className="bg-shade-light px-4">• • •</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Bilimsel Nitelik bölümü için özel render */}
                  {isScientificMeritSection ? (
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{section.order}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {section.title}
                          </h2>
                        </div>

                        {/* 1.1. Alt Bölüm */}
                        <div className="mb-8 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                          <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-brand-primary">1.1.</span>
                            Konunun Önemi ve Araştırma Önerisinin Bilimsel Niteliği
                          </label>
                          <p className="text-xs text-gray-500 mb-3">
                            💡 Minimum 350 karakter
                          </p>
                          
                          {scientificMeritAI.importance_view === "single" ? (
                            <>
                              <textarea
                                value={scientificMerit.importance_and_quality}
                                onChange={(e) => updateScientificMerit("importance_and_quality", e.target.value)}
                                placeholder="Araştırma önerisinde ele alınan konunun kapsamı, sınırları ve önemi ortaya konulur. Araştırma önerisi kapsamında yapılacak çalışmalarla literatürdeki hangi eksikliğin nasıl giderileceği veya hangi soruna nasıl bir çözüm getirileceği ilgili literatüre atıfla açıklanarak araştırma önerisinin bilimsel niteliği ortaya konulur..."
                                rows={8}
                                className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl text-sm focus:outline-none focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none"
                              />
                              <div className="flex items-center justify-between mt-2 mb-4">
                                <p className={`text-xs font-medium ${scientificMerit.importance_and_quality.length >= 350 ? 'text-brand-success' : 'text-gray-400'}`}>
                                  {scientificMerit.importance_and_quality.length} / 350+ karakter
                                </p>
                              </div>
                              <button
                                onClick={() => handleGenerateScientificMeritAI("importance")}
                                disabled={scientificMeritAI.importance_loading || !scientificMerit.importance_and_quality.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-sm shadow-md flex items-center justify-center gap-2"
                              >
                                {scientificMeritAI.importance_loading ? (
                                  <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>AI Çalışıyor...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>AI Önerisi Al (1.1)</span>
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <SplitView
                                draft={scientificMerit.importance_and_quality}
                                suggestion={scientificMeritAI.importance_ai}
                                onDraftChange={(content) => updateScientificMerit("importance_and_quality", content)}
                              />
                              
                              {/* Inline Action Buttons */}
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAcceptScientificMeritAI("importance")}
                                    className="flex-1 px-4 py-2 bg-brand-success text-white text-sm font-semibold rounded-lg hover:bg-brand-success/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Kabul Et</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectScientificMeritAI("importance")}
                                    className="flex-1 px-4 py-2 bg-brand-danger text-white text-sm font-semibold rounded-lg hover:bg-brand-danger/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Reddet</span>
                                  </button>
                                  <button
                                    onClick={() => setScientificMeritAI((prev) => ({
                                      ...prev,
                                      importance_show_revision: !prev.importance_show_revision,
                                    }))}
                                    className="flex-1 px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Revize Et</span>
                                  </button>
                                </div>
                                
                                {/* Revizyon Input Alanı */}
                                {scientificMeritAI.importance_show_revision && (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={scientificMeritAI.importance_revision_prompt}
                                      onChange={(e) => setScientificMeritAI((prev) => ({
                                        ...prev,
                                        importance_revision_prompt: e.target.value,
                                      }))}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter' && scientificMeritAI.importance_revision_prompt.trim()) {
                                          handleReviseScientificMeritAI("importance", scientificMeritAI.importance_revision_prompt);
                                        }
                                      }}
                                      placeholder="Revizyon talebinizi yazın... (Enter ile gönder)"
                                      className="flex-1 px-3 py-2 bg-white border-2 border-brand-warning rounded-lg text-sm focus:outline-none focus:border-brand-warning text-gray-900 placeholder:text-gray-400"
                                    />
                                    <button
                                      onClick={() => {
                                        if (scientificMeritAI.importance_revision_prompt.trim()) {
                                          handleReviseScientificMeritAI("importance", scientificMeritAI.importance_revision_prompt);
                                        }
                                      }}
                                      disabled={!scientificMeritAI.importance_revision_prompt.trim() || scientificMeritAI.importance_loading}
                                      className="px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {scientificMeritAI.importance_loading ? (
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                      ) : (
                                        "Gönder"
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 1.2. Alt Bölüm */}
                        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                          <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-brand-primary">1.2.</span>
                            Amaç ve Hedefler
                          </label>
                          <p className="text-xs text-gray-500 mb-3">
                            💡 Minimum 350 karakter
                          </p>
                          
                          {scientificMeritAI.aims_view === "single" ? (
                            <>
                              <textarea
                                value={scientificMerit.aims_and_objectives}
                                onChange={(e) => updateScientificMerit("aims_and_objectives", e.target.value)}
                                placeholder="Araştırma önerisinin amacı ve hedefleri açık, ölçülebilir, gerçekçi ve ulaşılabilir nitelikte olacak şekilde yazılır."
                                rows={6}
                                className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl text-sm focus:outline-none focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none"
                              />
                              <div className="flex items-center justify-between mt-2 mb-4">
                                <p className={`text-xs font-medium ${scientificMerit.aims_and_objectives.length >= 350 ? 'text-brand-success' : 'text-gray-400'}`}>
                                  {scientificMerit.aims_and_objectives.length} / 350+ karakter
                                </p>
                              </div>
                              <button
                                onClick={() => handleGenerateScientificMeritAI("aims")}
                                disabled={scientificMeritAI.aims_loading || !scientificMerit.aims_and_objectives.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-sm shadow-md flex items-center justify-center gap-2"
                              >
                                {scientificMeritAI.aims_loading ? (
                                  <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>AI Çalışıyor...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>AI Önerisi Al (1.2)</span>
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <SplitView
                                draft={scientificMerit.aims_and_objectives}
                                suggestion={scientificMeritAI.aims_ai}
                                onDraftChange={(content) => updateScientificMerit("aims_and_objectives", content)}
                              />
                              
                              {/* Inline Action Buttons */}
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAcceptScientificMeritAI("aims")}
                                    className="flex-1 px-4 py-2 bg-brand-success text-white text-sm font-semibold rounded-lg hover:bg-brand-success/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Kabul Et</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectScientificMeritAI("aims")}
                                    className="flex-1 px-4 py-2 bg-brand-danger text-white text-sm font-semibold rounded-lg hover:bg-brand-danger/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Reddet</span>
                                  </button>
                                  <button
                                    onClick={() => setScientificMeritAI((prev) => ({
                                      ...prev,
                                      aims_show_revision: !prev.aims_show_revision,
                                    }))}
                                    className="flex-1 px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Revize Et</span>
                                  </button>
                                </div>
                                
                                {/* Revizyon Input Alanı */}
                                {scientificMeritAI.aims_show_revision && (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={scientificMeritAI.aims_revision_prompt}
                                      onChange={(e) => setScientificMeritAI((prev) => ({
                                        ...prev,
                                        aims_revision_prompt: e.target.value,
                                      }))}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter' && scientificMeritAI.aims_revision_prompt.trim()) {
                                          handleReviseScientificMeritAI("aims", scientificMeritAI.aims_revision_prompt);
                                        }
                                      }}
                                      placeholder="Revizyon talebinizi yazın... (Enter ile gönder)"
                                      className="flex-1 px-3 py-2 bg-white border-2 border-brand-warning rounded-lg text-sm focus:outline-none focus:border-brand-warning text-gray-900 placeholder:text-gray-400"
                                    />
                                    <button
                                      onClick={() => {
                                        if (scientificMeritAI.aims_revision_prompt.trim()) {
                                          handleReviseScientificMeritAI("aims", scientificMeritAI.aims_revision_prompt);
                                        }
                                      }}
                                      disabled={!scientificMeritAI.aims_revision_prompt.trim() || scientificMeritAI.aims_loading}
                                      className="px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {scientificMeritAI.aims_loading ? (
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                      ) : (
                                        "Gönder"
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : isProjectManagementSection ? (
                    // 3. Proje Yönetimi bölümü için özel render (Tablolar)
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{section.order}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {section.title}
                        </h2>
                      </div>

                      {/* 3.1. Çalışma Takvimi */}
                      <div className="mb-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-brand-primary">3.1.</span>
                          Çalışma Takvimi
                        </h3>
                        <DynamicTable
                          columns={[
                            { key: "date_range", label: "Tarih Aralığı", placeholder: "../../20__ - ../../20__", width: "w-36" },
                            { key: "activities", label: "Faaliyetler**", placeholder: "Faaliyet açıklaması..." },
                            { key: "responsible", label: "Kimli(ler) Tarafından Gerçekleştirileceği", placeholder: "Sorumlu kişi(ler)..." },
                            { key: "success_criteria_contribution", label: "Başarı Ölçütü ve Araştırmanın Başarısına Katkısı***", placeholder: "Başarı ölçütü ve katkı oranı..." },
                          ]}
                          data={projectManagement.work_schedule.map((row) => ({ ...row }))}
                          onChange={(data) => updateWorkSchedule(data as unknown as WorkScheduleRow[])}
                          addButtonText="Faaliyet Ekle"
                        />
                        <div className="mt-4 text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg">
                          <p>(*) Çizelgedeki satırlar ve sütunlar gerektiği kadar genişletilebilir ve çoğaltılabilir.</p>
                          <p>(**) Literatür taraması, sonuç raporu hazırlama aşamaları, araştırma sonuçlarının paylaşımı, ve malzeme alımı ayrı birer iş adımı olarak gösterilmemelidir.</p>
                          <p>(***) Başarı ölçütü, ölçülebilir ve izlenebilir nitelikte olacak şekilde nicel veya nitel ölçütlerle (ifade, sayı, yüzde, vb.) belirtilir. Bu sütundaki değerlerin toplamı 100 olmalıdır.</p>
                        </div>
                      </div>

                      {/* 3.2. Risk Yönetimi */}
                      <div className="mb-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-brand-primary">3.2.</span>
                          Risk Yönetimi
                        </h3>
                        <DynamicTable
                          columns={[
                            { key: "risk", label: "En Önemli Riskler", placeholder: "Risk açıklaması..." },
                            { key: "countermeasure", label: "Alınacak Tedbirler (B Planı)", placeholder: "Tedbir ve B planı..." },
                          ]}
                          data={projectManagement.risk_management.map((row) => ({ ...row }))}
                          onChange={(data) => updateRiskManagement(data as unknown as RiskManagementRow[])}
                          addButtonText="Risk Ekle"
                        />
                        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
                          <p>(*) Tablodaki satırlar gerektiği kadar genişletilebilir ve çoğaltılabilir.</p>
                        </div>
                      </div>

                      {/* 3.3. Araştırma Olanakları */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-brand-primary">3.3.</span>
                          Araştırma Olanakları
                        </h3>
                        <DynamicTable
                          columns={[
                            { key: "equipment_type_model", label: "Kuruluşta Bulunan Altyapı/Ekipman Türü, Modeli\n(Laboratuvar, Araç, Makine-Teçhizat, vb.)", placeholder: "Ekipman türü ve modeli..." },
                            { key: "project_usage", label: "Projede Kullanım Amacı", placeholder: "Kullanım amacı..." },
                          ]}
                          data={projectManagement.research_facilities.map((row) => ({ ...row }))}
                          onChange={(data) => updateResearchFacilities(data as unknown as ResearchFacilityRow[])}
                          addButtonText="Ekipman Ekle"
                        />
                        <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg">
                          <p>(*) Tablodaki satırlar gerektiği kadar genişletilebilir ve çoğaltılabilir.</p>
                        </div>
                      </div>
                    </div>
                  ) : isWideImpactSection ? (
                    // 4. Yaygın Etki bölümü için özel tablo render
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{section.order}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {section.title}
                        </h2>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">
                        Araştırma önerisi kapsamındaki çalışmadan elde edilmesi öngörülen çıktılar amaçlarına göre belirlenen kategorilere ayrılarak belirtilir; ölçülebilir ve gerçekçi hedeflere dayandırılır.
                      </p>

                      {/* Wide Impact Tablo */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-2 border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold w-1/3">Kategori</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Öngörülen Çıktılar</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold w-20">AI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wideImpact.map((row, rowIndex) => {
                              const aiState = wideImpactAI[row.id] || { 
                                suggestion: "", 
                                loading: false, 
                                viewMode: "single",
                                revisionPrompt: "",
                                showRevisionInput: false,
                              };
                              const isInAIMode = aiState.viewMode === "split" && aiState.suggestion;
                              
                              return (
                                <tr key={row.id} className={`border-t-2 border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                  {/* Kategori Sütunu */}
                                  <td className="px-4 py-3 align-top">
                                    <div className="text-sm font-bold text-gray-900 mb-1">
                                      {row.category}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {row.category_description}
                                    </div>
                                  </td>
                                  
                                  {/* Çıktılar Sütunu (Split view veya Normal) */}
                                  <td className="px-4 py-3 align-top">
                                    {isInAIMode ? (
                                      <div className="space-y-4">
                                        {/* Split View */}
                                        <div className="grid grid-cols-2 gap-4">
                                          {/* Sol: Mevcut İçerik */}
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                              Mevcut İçerik
                                            </div>
                                            <textarea
                                              value={row.outputs}
                                              onChange={(e) => updateWideImpactRow(row.id, e.target.value)}
                                              rows={6}
                                              className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-xs focus:outline-none focus:border-brand-primary text-gray-900 resize-none"
                                            />
                                          </div>
                                          
                                          {/* Sağ: AI Önerisi */}
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                              </svg>
                                              AI Önerisi
                                            </div>
                                            <div className="w-full px-3 py-2 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-2 border-brand-primary rounded-lg text-xs text-gray-900 whitespace-pre-wrap h-[168px] overflow-y-auto">
                                              {aiState.suggestion}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* AI Action Buttons */}
                                        <div className="space-y-3">
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleAcceptWideImpactAI(row.id)}
                                              className="flex-1 px-4 py-2 bg-brand-success text-white text-xs font-semibold rounded-lg hover:bg-brand-success/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                              <span>Kabul Et</span>
                                            </button>
                                            <button
                                              onClick={() => handleRejectWideImpactAI(row.id)}
                                              className="flex-1 px-4 py-2 bg-brand-danger text-white text-xs font-semibold rounded-lg hover:bg-brand-danger/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                              <span>Reddet</span>
                                            </button>
                                            <button
                                              onClick={() => setWideImpactAI((prev) => ({
                                                ...prev,
                                                [row.id]: { ...prev[row.id], showRevisionInput: !prev[row.id]?.showRevisionInput },
                                              }))}
                                              className="flex-1 px-4 py-2 bg-brand-warning text-white text-xs font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                              </svg>
                                              <span>Revize Et</span>
                                            </button>
                                          </div>
                                          
                                          {/* Revizyon Input Alanı */}
                                          {aiState.showRevisionInput && (
                                            <div className="flex gap-2">
                                              <input
                                                type="text"
                                                value={aiState.revisionPrompt || ""}
                                                onChange={(e) => setWideImpactAI((prev) => ({
                                                  ...prev,
                                                  [row.id]: { ...prev[row.id], revisionPrompt: e.target.value },
                                                }))}
                                                onKeyPress={(e) => {
                                                  if (e.key === 'Enter' && aiState.revisionPrompt?.trim()) {
                                                    handleReviseWideImpactAI(row.id, aiState.revisionPrompt);
                                                  }
                                                }}
                                                placeholder="Revizyon talebinizi yazın... (Enter ile gönder)"
                                                className="flex-1 px-3 py-2 bg-white border-2 border-brand-warning rounded-lg text-xs focus:outline-none focus:border-brand-warning text-gray-900 placeholder:text-gray-400"
                                              />
                                              <button
                                                onClick={() => {
                                                  if (aiState.revisionPrompt?.trim()) {
                                                    handleReviseWideImpactAI(row.id, aiState.revisionPrompt);
                                                  }
                                                }}
                                                disabled={!aiState.revisionPrompt?.trim()}
                                                className="px-4 py-2 bg-brand-warning text-white text-xs font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                Gönder
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      /* Normal Textarea */
                                      <textarea
                                        value={row.outputs}
                                        onChange={(e) => updateWideImpactRow(row.id, e.target.value)}
                                        placeholder="Öngörülen çıktıları buraya yazın..."
                                        rows={4}
                                        className="w-full px-3 py-2 bg-white border-2 border-transparent rounded-lg text-sm focus:outline-none focus:border-brand-primary text-gray-900 placeholder:text-gray-400 resize-none transition-all duration-200"
                                      />
                                    )}
                                  </td>
                                  
                                  {/* AI Butonu */}
                                  <td className="px-4 py-3 align-top text-center">
                                    {!isInAIMode && (
                                      <button
                                        onClick={() => handleGenerateWideImpactAI(row.id, row.category, row.outputs)}
                                        disabled={aiState.loading}
                                        className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        title="AI Önerisi Al"
                                      >
                                        {aiState.loading ? (
                                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                        ) : (
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                          </svg>
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : isReferencesSection ? (
                    // Kaynakça bölümü için özel render (AI yok)
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                      {/* Başlık */}
                      <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{section.order}</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {section.title}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                              💡 Araştırma önerisinde kullandığınız kaynakları APA, MLA veya tercih ettiğiniz formatta yazın.
                            </p>
                          </div>
                        </div>
                        {/* Kelime ve Karakter Sayacı */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
                            <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium text-gray-700">
                              {sectionState.draft.trim().split(/\s+/).filter(Boolean).length} kelime
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
                            <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span className="font-medium text-gray-700">
                              {sectionState.draft.length} karakter
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Editor - Yazım Tarzı ve AI yok */}
                      <EditorComponent
                        content={sectionState.draft}
                        onChange={(content) => updateSectionState(section.id, { draft: content })}
                        placeholder={`${section.title} için kaynakları yazın...`}
                      />
                    </div>
                  ) : (
                    // Diğer bölümler için tek büyük card
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                      {/* Başlık ve Sayaçlar - Her zaman görünür */}
                      <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                          {section.order === 0 ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-xl">📄</span>
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">{section.order}</span>
                            </div>
                          )}
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {section.title}
                            </h2>
                            {isOzetSection && (
                              <p className="text-xs text-gray-500 mt-1">
                                💡 Bilimsel nitelik, yöntem, proje yönetimi ve yaygın etki hakkında bilgi verin. (25-450 kelime)
                              </p>
                            )}
                            {isYontemSection && (
                              <p className="text-xs text-gray-500 mt-1">
                                💡 Minimum 350 karakter
                              </p>
                            )}
                            {isOtherTopicsSection && (
                              <p className="text-xs text-gray-500 mt-1">
                                💡 Sadece araştırma önerisinin değerlendirilmesine katkı sağlayabilecek bilgi/veri eklenebilir. (Opsiyonel)
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Kelime ve Karakter Sayacı */}
                        <div className="flex items-center gap-4 text-sm">
                          {isYontemSection ? (
                            // Yöntem bölümü için sadece karakter sayacı (vurgulu)
                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
                              <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              <span className={`font-bold ${sectionState.draft.length >= 350 ? 'text-brand-success' : 'text-gray-700'}`}>
                                {sectionState.draft.length} / 350+ karakter
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
                                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                  {sectionState.draft.trim().split(/\s+/).filter(Boolean).length} kelime
                                </span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
                                <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="font-medium text-gray-700">
                                  {sectionState.draft.length} karakter
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Yazım Tarzı - Her zaman görünür */}
                      <div className="mb-6 pb-6 border-b-2 border-gray-100">
                        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          Yazım Tarzı
                        </label>
                        <input
                          type="text"
                          value={sectionState.styleInput}
                          onChange={(e) => updateSectionState(section.id, { styleInput: e.target.value })}
                          placeholder="Örn: Akademik, bilimsel ve profesyonel"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>İstediğiniz yazım tarzını detaylı yazın (örn: "Resmi ve bilimsel, pasif cümleler kullan")</span>
                        </p>
                      </div>

                      {/* İçerik - Mode'a göre değişir */}
                      {sectionState.viewMode === "single" ? (
                        <>
                          {/* Editor */}
                          <EditorComponent
                            content={sectionState.draft}
                            onChange={(content) => updateSectionState(section.id, { draft: content })}
                            placeholder={`${section.title} için taslak yazın...`}
                          />
                          
                          {/* AI Önerisi Al Butonu */}
                          <div className="mt-6 pt-6 border-t-2 border-gray-100">
                            <button
                              onClick={() => handleGenerateAI(section.id)}
                              disabled={sectionState.loading || !sectionState.draft.trim()}
                              className="w-full px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-base shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2"
                            >
                              {sectionState.loading ? (
                                <>
                                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  <span>AI Çalışıyor...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span>AI Önerisi Al</span>
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <SplitView
                            draft={sectionState.draft}
                            suggestion={sectionState.aiSuggestion}
                            onDraftChange={(content) => updateSectionState(section.id, { draft: content })}
                          />
                          
                          {/* Inline Action Buttons */}
                          <div className="space-y-3">
                            <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(section.id)}
                              className="flex-1 px-4 py-2 bg-brand-success text-white text-sm font-semibold rounded-lg hover:bg-brand-success/90 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Kabul Et</span>
                            </button>
                            <button
                              onClick={() => handleReject(section.id)}
                              className="flex-1 px-4 py-2 bg-brand-danger text-white text-sm font-semibold rounded-lg hover:bg-brand-danger/90 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Reddet</span>
                            </button>
                            <button
                              onClick={() => updateSectionState(section.id, {
                                showRevisionInput: !sectionState.showRevisionInput,
                              })}
                              className="flex-1 px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Revize Et</span>
                            </button>
                          </div>
                          
                          {/* Revizyon Input Alanı */}
                          {sectionState.showRevisionInput && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={sectionState.revisionPrompt}
                                onChange={(e) => updateSectionState(section.id, {
                                  revisionPrompt: e.target.value,
                                })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && sectionState.revisionPrompt.trim()) {
                                    handleRevise(section.id, sectionState.revisionPrompt);
                                  }
                                }}
                                placeholder="Revizyon talebinizi yazın... (Enter ile gönder)"
                                className="flex-1 px-3 py-2 bg-white border-2 border-brand-warning rounded-lg text-sm focus:outline-none focus:border-brand-warning text-gray-900 placeholder:text-gray-400"
                              />
                              <button
                                onClick={() => {
                                  if (sectionState.revisionPrompt.trim()) {
                                    handleRevise(section.id, sectionState.revisionPrompt);
                                  }
                                }}
                                disabled={!sectionState.revisionPrompt.trim() || sectionState.loading}
                                className="px-4 py-2 bg-brand-warning text-white text-sm font-semibold rounded-lg hover:bg-brand-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {sectionState.loading ? (
                                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  "Gönder"
                                )}
                              </button>
                            </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Anahtar Kelimeler (sadece Özet bölümünde) - Dışarıda olmalı */}
                  {isOzetSection && (
                    <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-6 mt-6">
                      <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Anahtar Kelimeler
                      </label>
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => updateKeywords(e.target.value)}
                        placeholder="Örn: yapay zeka, akademik metin, doğal dil işleme (virgülle ayırın)"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Projenizi tanımlayan 3-5 anahtar kelimeyi virgülle ayırarak yazın.</span>
                        </p>
                      </div>
                    )}
                </section>
              );
            })}
          </div>
        </main>
      </div>

      {/* Toast Notifications - Sol Alt */}
      <ToastContainer toasts={toasts} onRemove={removeToast} duration={3000} />
    </div>
  );
}
