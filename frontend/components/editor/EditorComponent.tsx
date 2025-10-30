"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface EditorComponentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function EditorComponent({
  content,
  onChange,
  placeholder = "Metninizi buraya yazın...",
  readOnly = false,
}: EditorComponentProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none prose-slate prose-p:text-gray-900 prose-headings:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const text = editor.getText();
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Toolbar */}
      {!readOnly && (
        <div className="border-b border-gray-200 p-2 flex gap-1 flex-wrap bg-gray-50">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-semibold ${
              editor.isActive("bold") ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
            }`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive("italic") ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
            }`}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive("heading", { level: 2 })
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive("heading", { level: 3 })
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive("bulletList")
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            • Liste
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive("orderedList")
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            1. Liste
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>

      {/* Stats: Word Count & Character Count */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600 flex gap-4">
        <span>{wordCount} kelime</span>
        <span>•</span>
        <span>{charCount} karakter</span>
      </div>
    </div>
  );
}
