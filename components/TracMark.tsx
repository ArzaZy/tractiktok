/**
 * PLACEHOLDER mark. No official TracLabs logo asset was supplied, so this is a simple
 * geometric monogram. Replace the SVG body with the real brand asset when available.
 */
export function TracMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path d="M9 11h14M16 11v11" stroke="var(--accent-fg)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="22.5" cy="22" r="1.9" fill="var(--accent-fg)" />
    </svg>
  );
}
