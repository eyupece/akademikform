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
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setViewMode("side-by-side")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            viewMode === "side-by-side"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          📋 Yan Yana
        </button>
        <button
          onClick={() => setViewMode("diff")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            viewMode === "diff"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          🔍 Fark Göster
        </button>
      </div>

      {/* Content */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sol: Kullanıcı Taslağı */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                📝 Taslağınız
              </h3>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
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
          <div className="bg-white rounded-lg shadow-sm border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-900">
                🤖 AI Önerisi
              </h3>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                AI Tarafından Düzenlendi
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🔍 Değişiklikler
            </h3>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Orijinal → AI Önerisi
            </span>
          </div>
          <DiffViewer original={draft} modified={suggestion} />
        </div>
      )}
    </div>
  );
}
