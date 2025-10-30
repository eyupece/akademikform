"use client";

import { useEffect, useState } from "react";

export interface ToastItem {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  duration?: number;
}

function SingleToast({
  toast,
  onClose,
  duration = 3000,
  index,
}: {
  toast: ToastItem;
  onClose: () => void;
  duration?: number;
  index: number;
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    info: {
      bg: "bg-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    success: {
      bg: "bg-green-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: "bg-yellow-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  };

  const currentStyle = styles[toast.type];

  return (
    <div
      className="animate-in slide-in-from-bottom-5 duration-300 mb-2"
      style={{ marginBottom: index > 0 ? "8px" : "0" }}
    >
      <div className={`${currentStyle.bg} text-white rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md flex items-center gap-3`}>
        {/* Icon */}
        <div className="flex-shrink-0">{currentStyle.icon}</div>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">{toast.message}</p>

        {/* Close Button */}
        <button onClick={onClose} className="flex-shrink-0 text-white/80 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove, duration = 3000 }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse">
      {toasts.map((toast, index) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onClose={() => onRemove(toast.id)}
          duration={duration}
          index={index}
        />
      ))}
    </div>
  );
}

