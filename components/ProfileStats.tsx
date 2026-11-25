"use client";

import { Heart, UserCheck, Users, Video, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { TikTokProfile } from "@/types/tiktok";
import { formatCompact, formatFull } from "@/lib/utils";

const ITEMS: Array<{ key: "posts" | "followers" | "following" | "likes"; label: string; Icon: LucideIcon }> = [
  { key: "posts", label: "Posts", Icon: Video },
  { key: "followers", label: "Followers", Icon: Users },
  { key: "following", label: "Following", Icon: UserCheck },
  { key: "likes", label: "Total Likes", Icon: Heart },
];

function Stat({ label, value, Icon }: { label: string; value: number; Icon: LucideIcon }) {
  const [showFull, setShowFull] = useState(false);
  const short = formatCompact(value);
  const full = formatFull(value);
  const expandable = short !== full;

  const body = (
    <>
      <span className="flex items-center gap-1.5 text-[12px] text-muted">
        <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
        {label}
      </span>
      <span className={`num mt-1.5 block font-semibold tracking-tight ${showFull ? "text-[17px] leading-8" : "text-[26px] leading-8"}`}>
        {showFull ? full : short}
      </span>
    </>
  );

  const cls = "glass-surface block w-full rounded-2xl p-4 text-left";
  if (!expandable) return <div className={cls}>{body}</div>;
  return (
    <button
      type="button"
      onClick={() => setShowFull((v) => !v)}
      aria-pressed={showFull}
      aria-label={`${label}: ${full}. Tap to toggle full value.`}
      title={full}
      className={`${cls} transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.985]`}
    >
      {body}
    </button>
  );
}

export function ProfileStats({ profile }: { profile: TikTokProfile }) {
  return (
    <div role="group" aria-label="Profile statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ITEMS.map(({ key, label, Icon }) => (
        <Stat key={key} label={label} value={profile[key]} Icon={Icon} />
      ))}
    </div>
  );
}
