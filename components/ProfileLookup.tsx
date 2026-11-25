"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ProfileCard } from "@/components/ProfileCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchHistory } from "@/components/SearchHistory";
import { SITE } from "@/lib/site";
import { loadHistory, pushHistory, saveHistory } from "@/lib/history";
import { ERROR_MESSAGES, isValidUsername, normalizeUsername } from "@/lib/tiktok";
import type { ApiErrorCode, ProfileResponse, TikTokProfile } from "@/types/tiktok";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; profile: TikTokProfile }
  | { status: "error"; message: string; query: string };

export function ProfileLookup() {
  const [input, setInput] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
    return () => abortRef.current?.abort();
  }, []);

  const search = useCallback(async (raw: string) => {
    const username = normalizeUsername(raw);
    if (!username) return setFieldError(ERROR_MESSAGES.EMPTY_USERNAME);
    if (!isValidUsername(username)) return setFieldError(ERROR_MESSAGES.INVALID_USERNAME);

    setFieldError(null);
    setInput(username);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading" });

    const fail = (code: ApiErrorCode) => setState({ status: "error", message: ERROR_MESSAGES[code], query: username });

    try {
      const qs = new URLSearchParams({ username });
      const res = await fetch(`/api/tiktokstalker?${qs.toString()}`, { signal: controller.signal, cache: "no-store" });
      let body: ProfileResponse | null = null;
      try {
        body = (await res.json()) as ProfileResponse;
      } catch {
        return fail("INVALID_RESPONSE");
      }
      if (body && body.ok === true && body.data) {
        setState({ status: "success", profile: body.data });
        setHistory((prev) => {
          const next = pushHistory(prev, body.data.username);
          saveHistory(next);
          return next;
        });
      } else if (body && body.ok === false && body.error && body.error.code in ERROR_MESSAGES) {
        fail(body.error.code);
      } else {
        fail("INVALID_RESPONSE");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      fail("NETWORK_ERROR");
    }
  }, []);

  const searchAgain = () => {
    abortRef.current?.abort();
    setState({ status: "idle" });
    setInput("");
    setFieldError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const loading = state.status === "loading";

  return (
    <MotionConfig reducedMotion="user">
      <section className="text-center" aria-labelledby="hero-title">
        <h1 id="hero-title" className="text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          {SITE.tagline}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-[15px] leading-relaxed text-muted sm:text-base">
          Discover public profile information with just a username.
        </p>
      </section>

      <div className="mt-8 space-y-3 sm:mt-10">
        <SearchBar
          ref={inputRef}
          value={input}
          onChange={(v) => {
            setInput(v);
            if (fieldError) setFieldError(null);
          }}
          onSubmit={() => void search(input)}
          loading={loading}
          error={fieldError}
        />
        <SearchHistory items={history} disabled={loading} onSelect={(u) => void search(u)} onClear={clearHistory} />
      </div>

      <div className="mt-8 sm:mt-10" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {state.status === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <LoadingSkeleton />
            </motion.div>
          )}
          {state.status === "success" && (
            <motion.div
              key={`profile-${state.profile.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProfileCard profile={state.profile} onSearchAgain={searchAgain} />
            </motion.div>
          )}
          {state.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              role="alert"
              className="glass-panel mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[24px] p-6 text-center sm:flex-row sm:text-left"
            >
              <AlertCircle size={22} strokeWidth={1.7} style={{ color: "var(--bad)" }} className="shrink-0" aria-hidden="true" />
              <p className="flex-1 text-[15px]">{state.message}</p>
              <button type="button" onClick={() => void search(state.query)} className="glass-button">
                <RotateCw size={15} strokeWidth={1.8} aria-hidden="true" />
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
