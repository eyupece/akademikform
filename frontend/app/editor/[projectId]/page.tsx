"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { mockApi } from "@/lib/mockApi";
import type { Project, Section } from "@/types";
import EditorComponent from "@/components/editor/EditorComponent";
import SplitView from "@/components/editor/SplitView";
import SectionList from "@/components/editor/SectionList";
import AIActionPopup from "@/components/editor/AIActionPopup";
import ToastContainer, { type ToastItem } from "@/components/shared/ToastContainer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { calculateProgress, getSectionStatus, getStatusBadgeProps } from "@/lib/sectionHelpers";

// Bölüm bazlı state yönetimi için tip
type SectionState = {
  draft: string;
  aiSuggestion: string;
  viewMode: "single" | "split";
  loading: boolean;
  styleInput: string;
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
      
      // Tüm bölümler için initial state oluştur
      const initialStates: Record<string, SectionState> = {};
      loadedProject.sections?.forEach((section) => {
        initialStates[section.id] = {
          draft: section.draft_content,
          aiSuggestion: "",
          viewMode: "single",
          loading: false,
          styleInput: "Akademik, bilimsel ve profesyonel",
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
    });
  };

  // Revizyonu tekrar iste (bölüm bazlı)
  const handleRevise = async (sectionId: string, customPrompt: string) => {
    const sectionState = sectionStates[sectionId];
    if (!sectionState) return;

    updateSectionState(sectionId, { loading: true });
    try {
      const response = await mockApi.generateAI(
        sectionState.draft + "\n\n[Revizyon talebi: " + customPrompt + "]",
        sectionState.styleInput
      );
      updateSectionState(sectionId, {
        aiSuggestion: response.generated_content,
        loading: false,
      });
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
    <div className="min-h-screen bg-shade-light">
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
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                BÖLÜMLER
              </h3>
            </div>
            <div className="space-y-2">
              {project.sections?.map((section) => {
                const sectionState = sectionStates[section.id];
                const status = getSectionStatus(section, sectionState?.aiSuggestion);
                const badgeInfo = getStatusBadgeProps(status);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group w-full text-left text-sm text-gray-700 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-brand-primary/20"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        {section.order}
                      </span>
                      <span className="flex-1 leading-tight font-medium group-hover:text-brand-primary transition-colors">
                        {section.title}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="ml-10">
                      <Badge variant={badgeInfo.variant} className="text-xs px-2 py-0.5">
                        {badgeInfo.icon} {badgeInfo.label}
                      </Badge>
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
            {/* Her bölüm için render */}
            {project.sections?.map((section, index) => {
              const sectionState = sectionStates[section.id];
              if (!sectionState) return null;

              return (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  className="scroll-mt-6"
                >
                  {/* Bölüm Ayırıcı (ilk bölüm hariç) */}
                  {index > 0 && (
                    <div className="mb-8 border-t-2 border-gray-200 pt-8">
                      <div className="text-center text-sm text-gray-400 -mt-4 mb-4">
                        <span className="bg-shade-light px-4">• • •</span>
                      </div>
                    </div>
                  )}
                  {/* Section Header & Controls */}
                  <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 mb-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{section.order}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {section.title}
                        </h2>
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
                    
                    {/* Style Input */}
                    <div className="mb-6">
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
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-primary text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>İstediğiniz yazım tarzını detaylı yazın (örn: "Resmi ve bilimsel, pasif cümleler kullan")</span>
                      </p>
                    </div>

                    {/* Generate AI Button */}
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

                  {/* Editor Content */}
                  {sectionState.viewMode === "single" ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <EditorComponent
                        content={sectionState.draft}
                        onChange={(content) => updateSectionState(section.id, { draft: content })}
                        placeholder={`${section.title} için taslak yazın...`}
                      />
                    </div>
                  ) : (
                    <SplitView
                      draft={sectionState.draft}
                      suggestion={sectionState.aiSuggestion}
                      onDraftChange={(content) => updateSectionState(section.id, { draft: content })}
                    />
                  )}

                  {/* AI Action Popup - Her bölüm için */}
                  {sectionState.aiSuggestion && sectionState.viewMode === "split" && (
                    <AIActionPopup
                      onAccept={() => handleAccept(section.id)}
                      onReject={() => handleReject(section.id)}
                      onRevise={(prompt) => handleRevise(section.id, prompt)}
                      loading={sectionState.loading}
                    />
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
