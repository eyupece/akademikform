"use client";

import { useEffect, useState } from "react";
// @ts-ignore
import * as diff_match_patch from "diff-match-patch";

interface DiffViewerProps {
  original: string;
  modified: string;
}

type DiffType = -1 | 0 | 1; // -1: deletion, 0: equal, 1: insertion

interface DiffPart {
  type: DiffType;
  text: string;
}

export default function DiffViewer({ original, modified }: DiffViewerProps) {
  const [diffs, setDiffs] = useState<DiffPart[]>([]);

  useEffect(() => {
    const dmp = new diff_match_patch.diff_match_patch();
    const differences = dmp.diff_main(original, modified);
    dmp.diff_cleanupSemantic(differences);
    
    const diffParts: DiffPart[] = differences.map(([type, text]: [DiffType, string]) => ({
      type,
      text,
    }));
    
    setDiffs(diffParts);
  }, [original, modified]);

  const renderDiffLine = (part: DiffPart, index: number) => {
    const lines = part.text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line === '' && lineIndex === lines.length - 1) return null;
      
      const key = `${index}-${lineIndex}`;
      
      // Deletion (kırmızı)
      if (part.type === -1) {
        return (
          <div key={key} className="flex">
            <div className="w-8 flex-shrink-0 bg-red-100 text-red-600 text-xs text-center py-0.5 border-r border-red-200">
              -
            </div>
            <div className="flex-1 bg-red-50 px-3 py-0.5 font-mono text-sm">
              <span className="bg-red-200 text-red-900">{line || ' '}</span>
            </div>
          </div>
        );
      }
      
      // Insertion (yeşil)
      if (part.type === 1) {
        return (
          <div key={key} className="flex">
            <div className="w-8 flex-shrink-0 bg-green-100 text-green-600 text-xs text-center py-0.5 border-r border-green-200">
              +
            </div>
            <div className="flex-1 bg-green-50 px-3 py-0.5 font-mono text-sm">
              <span className="bg-green-200 text-green-900">{line || ' '}</span>
            </div>
          </div>
        );
      }
      
      // Equal (normal)
      return (
        <div key={key} className="flex">
          <div className="w-8 flex-shrink-0 bg-gray-50 text-gray-400 text-xs text-center py-0.5 border-r border-gray-200">
            {' '}
          </div>
          <div className="flex-1 bg-white px-3 py-0.5 font-mono text-sm text-gray-700">
            {line || ' '}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-200 rounded"></span>
            <span className="text-gray-700">Silinen</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-200 rounded"></span>
            <span className="text-gray-700">Eklenen</span>
          </span>
        </div>
      </div>
      
      {/* Diff Content */}
      <div className="max-h-[500px] overflow-y-auto bg-white">
        {diffs.map((part, index) => renderDiffLine(part, index))}
      </div>
    </div>
  );
}


