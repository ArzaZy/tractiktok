"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Native <dialog>: gives focus trapping, Esc to close, and inert background for free. */
export function InfoDialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="info-dialog-title"
      className="glass-dialog m-auto w-[calc(100%-2rem)] max-w-md bg-transparent p-0 text-fg"
    >
      <div className="glass-overlay rounded-[24px] p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 id="info-dialog-title" className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="glass-button glass-button--icon !rounded-full" aria-label="Close">
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-3 text-[14px] leading-relaxed text-muted">{children}</div>
      </div>
    </dialog>
  );
}
