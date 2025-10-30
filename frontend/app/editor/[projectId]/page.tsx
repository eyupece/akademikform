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

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const projectId = params.projectId as string;
  const templateId = searchParams.get("template");

  const [project, setProject] = useState<Project | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [draft, setDraft] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [styleInput, setStyleInput] = useState("Akademik, bilimsel ve profesyonel");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");

  // Inline editing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // Toast states - stack için array
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Proje yükleme
  useEffect(() => {
    if (projectId === "new" && templateId) {
      // Yeni proje oluştur - default "Yeni Proje" ismiyle
      const newProject = mockApi.createProject(templateId, "Yeni Proje");
      setProject(newProject);
      if (newProject.sections && newProject.sections.length > 0) {
        setCurrentSection(newProject.sections[0]);
        setDraft(newProject.sections[0].draft_content);
      }
    } else {
      // Mevcut projeyi yükle
      const existingProject = mockApi.getProject(projectId);
      if (existingProject) {
        setProject(existingProject);
        if (existingProject.sections && existingProject.sections.length > 0) {
          setCurrentSection(existingProject.sections[0]);
          setDraft(existingProject.sections[0].draft_content);
        }
      }
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

  // Bölüm değiştir
  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    setDraft(section.draft_content);
    setAiSuggestion("");
    setViewMode("single");
  };

  // AI önerisi al
  const handleGenerateAI = async () => {
    if (!draft.trim()) {
      showToast("Lütfen önce taslak metin girin!", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await mockApi.generateAI(draft, styleInput);
      setAiSuggestion(response.generated_content);
      setViewMode("split");
    } catch (error) {
      console.error("AI generation error:", error);
      showToast("AI önerisi alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    } finally {
      setLoading(false);
    }
  };

  // AI önerisini kabul et
  const handleAccept = () => {
    if (!currentSection || !aiSuggestion) return;

    const updatedSection = mockApi.acceptRevision(currentSection.id, aiSuggestion);
    setCurrentSection(updatedSection);
    setDraft(aiSuggestion);
    setAiSuggestion("");
    setViewMode("single");
    showToast("Revizyon başarıyla kaydedildi!", "success");
  };

  // AI önerisini reddet
  const handleReject = () => {
    setAiSuggestion("");
    setViewMode("single");
  };

  // Revizyonu tekrar iste
  const handleRevise = async (customPrompt: string) => {
    setLoading(true);
    try {
      const response = await mockApi.generateAI(
        draft + "\n\n[Revizyon talebi: " + customPrompt + "]",
        styleInput
      );
      setAiSuggestion(response.generated_content);
    } catch (error) {
      console.error("AI revision error:", error);
      showToast("Revizyon alınırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Export
  const handleExport = (format: "docx" | "pdf") => {
    showToast(`${format.toUpperCase()} export özelliği yakında eklenecek!`, "info");
  };

  if (!project || !currentSection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Proje yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-600 hover:text-gray-900 mb-1"
              >
                ← Dashboard'a Dön
              </button>
              
              {/* Editable Title */}
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={handleTitleKeyPress}
                      onBlur={handleSaveTitle}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-600 focus:outline-none bg-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="text-green-600 hover:text-green-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancelEditTitle}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                    <button
                      onClick={handleStartEditingTitle}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-900 hover:text-indigo-600"
                      title="Başlığı düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600">{project.template_name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("docx")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Export DOCX
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar - Bölüm Listesi */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <SectionList
            sections={project.sections || []}
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
          />
        </aside>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Section Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentSection.title}
              </h2>
              
              {/* Style Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yazım Tarzı:
                </label>
                <input
                  type="text"
                  value={styleInput}
                  onChange={(e) => setStyleInput(e.target.value)}
                  placeholder="Örn: Akademik, bilimsel ve profesyonel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  İstediğiniz yazım tarzını detaylı yazın (örn: "Resmi ve bilimsel, pasif cümleler kullan")
                </p>
              </div>

              {/* Generate AI Button */}
              <button
                onClick={handleGenerateAI}
                disabled={loading || !draft.trim()}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    AI çalışıyor...
                  </span>
                ) : (
                  "🤖 AI Önerisi Al"
                )}
              </button>
            </div>

            {/* Editor Content */}
            {viewMode === "single" ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EditorComponent
                  content={draft}
                  onChange={setDraft}
                  placeholder={`${currentSection.title} için taslak yazın...`}
                />
              </div>
            ) : (
              <SplitView
                draft={draft}
                suggestion={aiSuggestion}
                onDraftChange={setDraft}
              />
            )}
          </div>
        </main>
      </div>

      {/* AI Action Popup - Sağ Alt */}
      {aiSuggestion && viewMode === "split" && (
        <AIActionPopup
          onAccept={handleAccept}
          onReject={handleReject}
          onRevise={handleRevise}
          loading={loading}
        />
      )}

      {/* Toast Notifications - Sol Alt */}
      <ToastContainer toasts={toasts} onRemove={removeToast} duration={3000} />
    </div>
  );
}
