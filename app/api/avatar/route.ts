import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isValidUsername } from "@/lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Download proxy for profile pictures. To prevent arbitrary URL fetching (SSRF) it only
 * accepts https URLs on known TikTok CDN domains, never follows redirects, and only
 * returns raster image content under a size cap. Extend the list if the API serves
 * avatars from a CDN that is not covered here.
 */
const ALLOWED_SUFFIXES = [
  ".tiktokcdn.com",
  ".tiktokcdn-us.com",
  ".tiktokcdn-eu.com",
  ".ibyteimg.com",
  ".byteimg.com",
  ".ibytedtos.com",
  ".muscdn.com",
];
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

function allowed(url: URL) {
  if (url.protocol !== "https:" || url.port || url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (host.includes(":") || /^[\d.]+$/.test(host)) return false;
  return ALLOWED_SUFFIXES.some((s) => host.endsWith(s));
}

const bad = (status: number) => new NextResponse(null, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(req: NextRequest) {
  if (!rateLimit(`avatar:${clientIp(req)}`, 10, 60_000).ok) return bad(429);

  const params = req.nextUrl.searchParams;
  let target: URL;
  try {
    target = new URL(params.get("url") ?? "");
  } catch {
    return bad(400);
  }
  if (!allowed(target)) return bad(400);

  let upstream: Response;
  try {
    upstream = await fetch(target, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    return bad(502);
  }
  if (!upstream.ok) return bad(502);

  const type = (upstream.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = EXT[type];
  if (!ext) return bad(415);
  const declared = Number(upstream.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return bad(413);

  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) return bad(413);

  const name = params.get("name") ?? "";
  const base = isValidUsername(name) ? name : "avatar";
  return new NextResponse(buf, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${base}.${ext}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
