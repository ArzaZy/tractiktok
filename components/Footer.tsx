"use client";

import { useState } from "react";
import { InfoDialog } from "@/components/InfoDialog";
import { SITE } from "@/lib/site";

type Panel = "privacy" | "about" | null;

const linkCls = "min-h-9 rounded-md px-1 text-[13px] text-muted transition-colors hover:text-fg";

export function Footer() {
  const [panel, setPanel] = useState<Panel>(null);

  return (
    <footer className="mx-auto w-full max-w-content px-4 pb-10 sm:px-6">
      <div className="glass-divider mb-8" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-1 text-[13px] text-muted">Part of the TracLabs ecosystem.</p>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-4">
          {SITE.tracLabsUrl ? (
            <a href={SITE.tracLabsUrl} className={`${linkCls} inline-flex items-center`}>
              TracLabs
            </a>
          ) : (
            <span className="inline-flex min-h-9 items-center px-1 text-[13px] text-muted">TracLabs</span>
          )}
          <button type="button" onClick={() => setPanel("privacy")} className={linkCls}>
            Privacy
          </button>
          <button type="button" onClick={() => setPanel("about")} className={linkCls}>
            About
          </button>
        </nav>
      </div>
      <p className="mt-8 text-[12px] text-muted">© 2026 TracLabs. All rights reserved.</p>
      <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-muted">
        TracTikTok is an independent third-party profile lookup tool and is not affiliated with, endorsed by, or sponsored by TikTok.
      </p>

      <InfoDialog open={panel === "privacy"} title="Privacy" onClose={() => setPanel(null)}>
        <p>
          TracTikTok does not store profile data. The username you enter is sent to our server, which forwards it to the NexaDev API to
          retrieve public profile information, then returns the result to your browser.
        </p>
        <p>
          Your last five successful searches are kept only in your browser&apos;s local storage (usernames only) and can be removed with
          “Clear history”. Your theme choice is stored the same way.
        </p>
        <p>
          We never ask for TikTok passwords, cookies, or sessions. Your IP address is used briefly in server memory to limit abusive request
          rates. Your hosting and network providers may keep standard access logs.
        </p>
      </InfoDialog>

      <InfoDialog open={panel === "about"} title="About" onClose={() => setPanel(null)}>
        <p>TracTikTok is a TracLabs tool for looking up public TikTok profile information by username.</p>
        <p>
          Profile data is provided by the third-party NexaDev API and displayed as received. Availability and accuracy depend on that
          service.
        </p>
        <p>TracTikTok is independent and is not affiliated with, endorsed by, or sponsored by TikTok.</p>
      </InfoDialog>
    </footer>
  );
}
