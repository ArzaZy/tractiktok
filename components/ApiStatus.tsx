"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ApiHealth, StatusResponse } from "@/types/tiktok";

const LABEL: Record<ApiHealth, string> = {
  checking: "Checking…",
  reachable: "API reachable",
  degraded: "API degraded",
  unreachable: "API unreachable",
};
const COLOR: Record<ApiHealth, string> = {
  checking: "var(--fg-muted)",
  reachable: "var(--ok)",
  degraded: "var(--warn)",
  unreachable: "var(--bad)",
};

/** Shows the result of a real server-side reachability probe — never an assumed state. */
export function ApiStatus() {
  const [state, setState] = useState<ApiHealth>("checking");
  const [info, setInfo] = useState<StatusResponse | null>(null);

  const check = useCallback(async () => {
    setState("checking");
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error("status");
      const data = (await res.json()) as StatusResponse;
      setInfo(data);
      setState(data.state);
    } catch {
      setInfo(null);
      setState("unreachable");
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  const detail =
    info?.latencyMs != null
      ? `Last checked ${new Date(info.checkedAt).toLocaleTimeString()} · ${info.latencyMs} ms · reachability only`
      : "Server-side reachability check";

  return (
    <button
      type="button"
      onClick={() => void check()}
      disabled={state === "checking"}
      className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-[13px] text-muted transition-colors hover:text-fg disabled:cursor-default"
      title={`${detail}. Click to re-check.`}
      aria-label={`${LABEL[state]}. Click to re-check.`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: COLOR[state], boxShadow: state === "checking" ? "none" : `0 0 8px ${COLOR[state]}` }}
        aria-hidden="true"
      />
      <span aria-live="polite">{LABEL[state]}</span>
      {state === "checking" && <RefreshCw size={12} className="animate-spin" aria-hidden="true" />}
    </button>
  );
}
