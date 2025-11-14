"use client";

import { useState } from "react";

interface Column {
  key: string;
  label: string;
  placeholder?: string;
  width?: string;
}

interface DynamicTableProps {
  columns: Column[];
  data: Record<string, string>[];
  onChange: (data: Record<string, string>[]) => void;
  addButtonText?: string;
  minRows?: number;
}

export default function DynamicTable({
  columns,
  data,
  onChange,
  addButtonText = "Satır Ekle",
  minRows = 1,
}: DynamicTableProps) {
  const handleCellChange = (rowIndex: number, columnKey: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: value };
    onChange(newData);
  };

  const addRow = () => {
    const newRow: Record<string, string> = { id: `row-${Date.now()}` };
    columns.forEach((col) => {
      if (col.key !== "id") {
        newRow[col.key] = "";
      }
    });
    onChange([...data, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    if (data.length <= minRows) return;
    const newData = data.filter((_, index) => index !== rowIndex);
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-2 border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900 ${
                    col.width || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {data.length > minRows && (
                <th className="border-2 border-gray-300 px-4 py-3 w-16"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="border-2 border-gray-300 p-2">
                    <textarea
                      value={row[col.key] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      placeholder={col.placeholder || ""}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded resize-none"
                    />
                  </td>
                ))}
                {data.length > minRows && (
                  <td className="border-2 border-gray-300 p-2 text-center">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Satırı sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {addButtonText}
      </button>
    </div>
  );
}

