import { CopyButton } from "@/components/CopyButton";
import type { TikTokProfile } from "@/types/tiktok";

function Row({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`min-w-0 ${wide ? "md:col-span-2" : ""}`}>
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] leading-relaxed">{children}</dd>
    </div>
  );
}

export function ProfileDetails({ profile }: { profile: TikTokProfile }) {
  return (
    <section aria-labelledby="profile-info">
      <h3 id="profile-info" className="mb-4 text-[13px] font-medium uppercase tracking-[0.12em] text-muted">
        Profile information
      </h3>
      <dl className="grid gap-x-10 gap-y-5 md:grid-cols-2">
        <Row label="User ID">
          <span className="flex items-center gap-2">
            <span className="num min-w-0 break-all">{profile.id}</span>
            <CopyButton value={profile.id} label="Copy user ID" />
          </span>
        </Row>
        <Row label="Account type">{profile.private ? "Private account" : "Public account"}</Row>
        <Row label="Verification">{profile.verified ? "Verified" : "Not verified"}</Row>
        <Row label="Username">@{profile.username}</Row>
        <Row label="Biography" wide>
          {profile.bio.trim() ? (
            <span className="block whitespace-pre-wrap break-words">{profile.bio}</span>
          ) : (
            <span className="text-muted">No bio available</span>
          )}
        </Row>
      </dl>
    </section>
  );
}
