import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { StatusResponse } from "@/types/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Real reachability probe of the upstream host. It does not request a profile and does
 * not prove that lookups succeed — only that the NexaDev server answers over HTTPS.
 */
const PROBE = "https://api.nexadev.my.id/";

export async function GET(req: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  if (!rateLimit(`status:${clientIp(req)}`, 12, 60_000).ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
  }

  const started = Date.now();
  let state: StatusResponse["state"] = "unreachable";
  let latencyMs: number | null = null;
  try {
    const res = await fetch(PROBE, { cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(5000) });
    latencyMs = Date.now() - started;
    state = res.status >= 500 ? "degraded" : "reachable";
  } catch {
    state = "unreachable";
  }
  const body: StatusResponse = { state, latencyMs, checkedAt: new Date().toISOString() };
  return NextResponse.json(body, { headers });
}
