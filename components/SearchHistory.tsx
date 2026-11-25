"use client";

import { History, X } from "lucide-react";

interface Props {
  items: string[];
  disabled: boolean;
  onSelect: (username: string) => void;
  onClear: () => void;
}

export function SearchHistory({ items, disabled, onSelect, onClear }: Props) {
  if (items.length === 0) return null;
  return (
    <section aria-label="Recent searches" className="mx-auto mt-1 flex max-w-xl flex-wrap items-center justify-center gap-2 sm:justify-start">
      <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
        <History size={13} strokeWidth={1.8} aria-hidden="true" />
        Recent
      </span>
      {items.map((u) => (
        <button
          key={u}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(u)}
          className="glass-surface num min-h-9 max-w-[11rem] truncate rounded-full px-3 text-[13px] transition-colors hover:bg-[var(--glass-bg-strong)] disabled:opacity-50"
        >
          @{u}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[12px] text-muted transition-colors hover:text-fg"
      >
        <X size={13} aria-hidden="true" />
        Clear history
      </button>
    </section>
  );
}
