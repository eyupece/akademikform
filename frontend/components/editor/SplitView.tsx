"use client";

import { useState } from "react";
import EditorComponent from "./EditorComponent";
import DiffViewer from "./DiffViewer";

interface SplitViewProps {
  draft: string;
  suggestion: string;
  onDraftChange: (content: string) => void;
}

export default function SplitView({
  draft,
  suggestion,
  onDraftChange,
}: SplitViewProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "diff">("side-by-side");

  return (
    <div>
      {/* View Mode Toggle - Modern */}
      <div className="flex justify-end mb-6 gap-3">
        <button
          onClick={() => setViewMode("side-by-side")}
          className={`group flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            viewMode === "side-by-side"
              ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30 scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Yan Yana
        </button>
        <button
          onClick={() => setViewMode("diff")}
          className={`group flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            viewMode === "diff"
              ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30 scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Fark Göster
        </button>
      </div>

      {/* Content */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sol: Kullanıcı Taslağı */}
          <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Taslağınız
                </h3>
              </div>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                Orijinal
              </span>
            </div>
            <EditorComponent
              content={draft}
              onChange={onDraftChange}
              placeholder="Taslak metniniz..."
            />
          </div>

          {/* Sağ: AI Önerisi */}
          <div className="bg-white rounded-2xl shadow-card border-2 border-brand-primary/20 p-8 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  AI Önerisi
                </h3>
              </div>
              <span className="px-3 py-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs font-semibold rounded-lg border border-brand-primary/20">
                AI Düzenlemesi
              </span>
            </div>
            <EditorComponent
              content={suggestion}
              onChange={() => {}}
              placeholder="AI önerisi burada görünecek..."
              readOnly={true}
            />
          </div>
        </div>
      ) : (
        /* Diff View */
        <div className="bg-white rounded-2xl shadow-card border-2 border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Değişiklikler
              </h3>
            </div>
            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
              Orijinal → AI
            </span>
          </div>
          <DiffViewer original={draft} modified={suggestion} />
        </div>
      )}
    </div>
  );
}
