"use client";

import { BadgeCheck, Download, ExternalLink, Lock, Search } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { CopyButton } from "@/components/CopyButton";
import { ProfileDetails } from "@/components/ProfileDetails";
import { ProfileStats } from "@/components/ProfileStats";
import { profileUrl } from "@/lib/utils";
import type { TikTokProfile } from "@/types/tiktok";

export function ProfileCard({ profile, onSearchAgain }: { profile: TikTokProfile; onSearchAgain: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const link = profileUrl(profile.username);
  const displayName = profile.name.trim() || profile.username;

  const downloadPicture = async () => {
    setDownloading(true);
    setDownloadError(false);
    try {
      const qs = new URLSearchParams({ url: profile.photo, name: profile.username });
      const res = await fetch(`/api/avatar?${qs.toString()}`);
      if (!res.ok) throw new Error("download");
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
      a.href = href;
      a.download = `${profile.username}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="glass-panel rounded-[28px] p-5 sm:p-8" aria-label={`Profile of ${displayName}`}>
      {/* Header */}
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
        <Avatar src={profile.photo} alt={`${displayName} profile picture`} />
        <div className="min-w-0 flex-1">
          <h2 className="flex flex-wrap items-center justify-center gap-2 text-[26px] font-semibold leading-tight tracking-tight sm:justify-start sm:text-3xl">
            <span className="min-w-0 break-words">{displayName}</span>
            {profile.verified && (
              <BadgeCheck size={24} strokeWidth={1.8} style={{ color: "var(--verified)" }} aria-label="Verified account" role="img" />
            )}
          </h2>
          <div className="mt-1 flex items-center justify-center gap-1 sm:justify-start">
            <p className="num min-w-0 break-all text-[15px] text-muted">@{profile.username}</p>
            <CopyButton value={profile.username} label="Copy username" />
          </div>
          {profile.private && (
            <p className="glass-surface mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium">
              <Lock size={12} strokeWidth={2} aria-hidden="true" />
              Private account
            </p>
          )}
        </div>
      </header>

      <div className="mt-7">
        <ProfileStats profile={profile} />
      </div>

      <div className="glass-divider my-7" role="separator" />

      <ProfileDetails profile={profile} />

      <div className="glass-divider my-7" role="separator" />

      {/* Actions */}
      <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap">
        <CopyButton value={link} label="Copy profile link" variant="button">
          Copy profile link
        </CopyButton>
        <a href={link} target="_blank" rel="noopener noreferrer" className="glass-button">
          <ExternalLink size={16} strokeWidth={1.8} aria-hidden="true" />
          Open on TikTok
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        {profile.photo && (
          <button type="button" onClick={downloadPicture} disabled={downloading} className="glass-button">
            <Download size={16} strokeWidth={1.8} aria-hidden="true" />
            {downloading ? "Downloading…" : "Download picture"}
          </button>
        )}
        <button type="button" onClick={onSearchAgain} className="glass-button sm:ml-auto">
          <Search size={16} strokeWidth={1.8} aria-hidden="true" />
          Search again
        </button>
      </div>
      {downloadError && (
        <p role="alert" className="mt-3 text-[13px]" style={{ color: "var(--bad)" }}>
          Unable to download the profile picture.
        </p>
      )}
    </article>
  );
}
