import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ERROR_MESSAGES, isValidUsername, lookupProfile, normalizeUsername } from "@/lib/tiktok";
import type { ApiErrorCode, ProfileResponse } from "@/types/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function error(status: number, code: ApiErrorCode, headers: Record<string, string> = {}) {
  const body: ProfileResponse = { ok: false, error: { code, message: ERROR_MESSAGES[code] } };
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export async function GET(req: NextRequest) {
  const limit = rateLimit(`profile:${clientIp(req)}`, 20, 60_000);
  if (!limit.ok) return error(429, "RATE_LIMITED", { "Retry-After": String(limit.retryAfter) });

  const username = normalizeUsername(req.nextUrl.searchParams.get("username") ?? "");
  if (!username) return error(400, "EMPTY_USERNAME");
  if (!isValidUsername(username)) return error(400, "INVALID_USERNAME");

  const result = await lookupProfile(username);
  return NextResponse.json(result.body, { status: result.status, headers: NO_STORE });
}
