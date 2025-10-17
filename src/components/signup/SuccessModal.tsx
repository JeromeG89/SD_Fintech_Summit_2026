"use client";

import { useState, useEffect, useRef } from "react";

export function SuccessModal({
  open,
  title = "You're in! 🎉",
  message = "Thanks for signing up. Click OK to go to your dashboard.",
  onOk,
  onClose,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onOk: () => void;
  onClose?: () => void;
}) {
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => okRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-title"
      aria-describedby="success-desc"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="success-title" className="text-xl font-semibold">
          {title}
        </h2>
        <p id="success-desc" className="mt-2 text-gray-600">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Later
          </button>
          <button
            ref={okRef}
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            onClick={onOk}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}