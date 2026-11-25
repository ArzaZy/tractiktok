"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/utils";

interface Props {
  value: string;
  label: string;
  /** "icon" renders a compact icon-only button; "button" renders icon + children. */
  variant?: "icon" | "button";
  children?: React.ReactNode;
}

export function CopyButton({ value, label, variant = "icon", children }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(value);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  };

  const Icon = state === "copied" ? Check : Copy;
  const announce = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "";

  if (variant === "button") {
    return (
      <button type="button" onClick={onClick} className="glass-button" title={label}>
        <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : children}</span>
        <span className="sr-only" aria-live="polite">{announce}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-button glass-button--icon glass-button--icon-sm shrink-0"
      aria-label={label}
      title={state === "failed" ? "Copy failed" : label}
    >
      <Icon size={15} strokeWidth={1.8} aria-hidden="true" style={state === "copied" ? { color: "var(--ok)" } : undefined} />
      <span className="sr-only" aria-live="polite">{announce}</span>
    </button>
  );
}
