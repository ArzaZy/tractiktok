"use client";

import { Loader2, Search } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange, onSubmit, loading, error },
  ref,
) {
  return (
    <form
      role="search"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="glass-floating flex flex-col gap-2 rounded-[24px] p-2 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="username" className="sr-only">
            TikTok username
          </label>
          <Search
            size={18}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            ref={ref}
            id="username"
            name="username"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter TikTok username..."
            disabled={loading}
            maxLength={40}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "username-error" : undefined}
            className="glass-input h-12 w-full rounded-2xl pl-11 pr-4 text-[16px] disabled:opacity-60"
          />
        </div>
        <button type="submit" disabled={loading} className="glass-button glass-button--primary h-12 rounded-2xl px-6 sm:min-w-[9.5rem]">
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Searching…
            </>
          ) : (
            "Find Profile"
          )}
        </button>
      </div>
      <p id="username-error" role="alert" className="min-h-5 px-3 pt-2 text-center text-[13px] sm:text-left" style={{ color: "var(--bad)" }}>
        {error}
      </p>
    </form>
  );
});
