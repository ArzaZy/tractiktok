import type { ApiErrorCode, ProfileResponse, TikTokProfile } from "@/types/tiktok";

const UPSTREAM = "https://api.nexadev.my.id/api/tiktokstalker";
const TIMEOUT_MS = 8000;

export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  EMPTY_USERNAME: "Please enter a TikTok username.",
  INVALID_USERNAME: "Usernames can only contain letters, numbers, underscores, and periods.",
  NOT_FOUND: "Account not found. Check the username and try again.",
  UPSTREAM_ERROR: "Unable to retrieve profile information.",
  NETWORK_ERROR: "Connection failed. Please try again.",
  INVALID_RESPONSE: "Received an invalid response from the API.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
};

/** Trim whitespace and strip leading @ characters. */
export function normalizeUsername(raw: string) {
  return raw.trim().replace(/^@+/, "").trim();
}

export function isValidUsername(username: string) {
  return /^[A-Za-z0-9._]{1,24}$/.test(username);
}

type Result = { status: number; body: ProfileResponse };

const fail = (status: number, code: ApiErrorCode): Result => ({
  status,
  body: { ok: false, error: { code, message: ERROR_MESSAGES[code] } },
});

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function toCount(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
  return null;
}

function looksNotFound(json: unknown) {
  if (!isRecord(json)) return false;
  const text = [json.message, json.msg, json.error, json.data]
    .filter((x): x is string => typeof x === "string")
    .join(" ");
  return /not\s*found|tidak\s*ditemukan|doesn'?t\s*exist|does\s*not\s*exist|user.*invalid|invalid.*user/i.test(text);
}

function parseProfile(data: Record<string, unknown>): TikTokProfile | null {
  const id = typeof data.id === "string" ? data.id : typeof data.id === "number" && Number.isSafeInteger(data.id) ? String(data.id) : "";
  const posts = toCount(data.posts);
  const followers = toCount(data.followers);
  const following = toCount(data.following);
  const likes = toCount(data.likes);
  if (!id || typeof data.username !== "string" || !data.username) return null;
  if (posts === null || followers === null || following === null || likes === null) return null;
  if (typeof data.verified !== "boolean" || typeof data.private !== "boolean") return null;
  return {
    id,
    photo: typeof data.photo === "string" ? data.photo : "",
    username: data.username,
    name: typeof data.name === "string" ? data.name : "",
    posts,
    followers,
    following,
    likes,
    verified: data.verified,
    private: data.private,
    bio: typeof data.bio === "string" ? data.bio : "",
  };
}

/** Server-side lookup against NexaDev. Only the fixed upstream host is ever requested. */
export async function lookupProfile(username: string): Promise<Result> {
  const url = `${UPSTREAM}?${new URLSearchParams({ username }).toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return fail(timedOut ? 504 : 502, "NETWORK_ERROR");
  }

  let json: unknown = null;
  let parsed = true;
  try {
    json = await res.json();
  } catch {
    parsed = false;
  }

  if (res.status === 404) return fail(404, "NOT_FOUND");
  if (!res.ok) return parsed && looksNotFound(json) ? fail(404, "NOT_FOUND") : fail(502, "UPSTREAM_ERROR");
  if (!parsed || !isRecord(json) || typeof json.status !== "boolean") return fail(502, "INVALID_RESPONSE");

  if (json.status !== true) return looksNotFound(json) ? fail(404, "NOT_FOUND") : fail(502, "UPSTREAM_ERROR");
  if (json.data === null || json.data === undefined) return fail(404, "NOT_FOUND");
  if (!isRecord(json.data)) return fail(502, "INVALID_RESPONSE");

  const profile = parseProfile(json.data);
  if (!profile) return fail(502, "INVALID_RESPONSE");
  return { status: 200, body: { ok: true, data: profile } };
}
