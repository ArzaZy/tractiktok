"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";

/** Fixed-size box → no layout shift. Falls back to a neutral glyph when the photo fails. */
export function Avatar({ src, alt, size = 112 }: { src: string; alt: string; size?: number }) {
  const [failed, setFailed] = useState(!src);
  useEffect(() => setFailed(!src), [src]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border border-[var(--glass-border)] bg-soft"
      style={{ width: size, height: size, boxShadow: "inset 0 1px 0 var(--glass-highlight), 0 12px 28px -10px var(--glass-shadow)" }}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-muted" role="img" aria-label={`${alt} (no picture available)`}>
          <User size={size * 0.42} strokeWidth={1.4} aria-hidden="true" />
        </div>
      ) : (
        // Plain <img>: avatar CDN hosts vary, and no-referrer avoids hotlink blocking.
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
