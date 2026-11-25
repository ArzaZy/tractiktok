/** Profile exactly as provided by the NexaDev API (`data` object), normalised for types only. */
export interface TikTokProfile {
  id: string;
  photo: string;
  username: string;
  name: string;
  posts: number;
  followers: number;
  following: number;
  likes: number;
  verified: boolean;
  private: boolean;
  bio: string;
}

export type ApiErrorCode =
  | "EMPTY_USERNAME"
  | "INVALID_USERNAME"
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "RATE_LIMITED";

export type ProfileResponse =
  | { ok: true; data: TikTokProfile }
  | { ok: false; error: { code: ApiErrorCode; message: string } };

export type ApiHealth = "checking" | "reachable" | "degraded" | "unreachable";

export interface StatusResponse {
  state: Exclude<ApiHealth, "checking">;
  latencyMs: number | null;
  checkedAt: string;
}
