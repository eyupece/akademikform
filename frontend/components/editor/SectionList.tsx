import type { Section } from "@/types";

interface SectionListProps {
  sections: Section[];
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function SectionList({
  sections,
  currentSection,
  onSectionChange,
}: SectionListProps) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
        Bölümler
      </h3>
      <nav className="space-y-1">
        {sections.map((section, index) => {
          const isActive = section.id === currentSection.id;
          const hasContent = section.draft_content.trim().length > 0;
          const isCompleted = section.final_content !== null;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{index + 1}.</span>
                  <span className="truncate">{section.title}</span>
                </span>
                {isCompleted && (
                  <span className="text-green-600 text-xs">✓</span>
                )}
                {!isCompleted && hasContent && (
                  <span className="text-yellow-600 text-xs">●</span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 mb-2">İlerleme</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                (sections.filter((s) => s.final_content !== null).length /
                  sections.length) *
                100
              }%`,
            }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {sections.filter((s) => s.final_content !== null).length} / {sections.length} bölüm tamamlandı
        </div>
      </div>
    </div>
  );
}




