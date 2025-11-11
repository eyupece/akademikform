"use client";

import { useState } from "react";

interface AIActionPopupProps {
  onAccept: () => void;
  onReject: () => void;
  onRevise: (prompt: string) => void;
  loading?: boolean;
}

export default function AIActionPopup({
  onAccept,
  onReject,
  onRevise,
  loading = false,
}: AIActionPopupProps) {
  const [showReviseInput, setShowReviseInput] = useState(false);
  const [revisePrompt, setRevisePrompt] = useState("");

  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisePrompt.trim()) {
      onRevise(revisePrompt);
      setRevisePrompt("");
      setShowReviseInput(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 min-w-[320px]">
        {/* Main Actions */}
        {!showReviseInput ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onAccept}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-success text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Kabul Et
            </button>
            
            <button
              onClick={onReject}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-danger text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reddet
            </button>
            
            <button
              onClick={() => setShowReviseInput(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-warning text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Revize Et
            </button>
          </div>
        ) : (
          /* Revise Input */
          <form onSubmit={handleReviseSubmit} className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Revizyon İsteği</span>
              <button
                type="button"
                onClick={() => setShowReviseInput(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={revisePrompt}
              onChange={(e) => setRevisePrompt(e.target.value)}
              placeholder="Örn: Daha basit yaz, Daha teknik yap"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-gray-900 placeholder-gray-400"
              autoFocus
              disabled={loading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !revisePrompt.trim()}
                className="flex-1 px-3 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? "Revize ediliyor..." : "Revize Et"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviseInput(false)}
                disabled={loading}
                className="px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

