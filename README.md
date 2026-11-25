# TracTikTok

Public TikTok profile lookup by username — part of the TracLabs ecosystem.
Next.js (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Deploy to Vercel
Import the repo; the Next.js preset works with no required environment variables.
Optional: `NEXT_PUBLIC_TRACLABS_URL` turns the footer "TracLabs" text into a link.

## Routes
| Route | Purpose |
|---|---|
| `GET /api/tiktokstalker?username=` | Server proxy to NexaDev. Validates input, 8 s timeout, validates JSON shape, returns `{ ok, data }` or `{ ok:false, error:{code,message} }`. |
| `GET /api/avatar?url=&name=` | Download proxy for profile pictures. HTTPS + TikTok CDN allow-list, no redirects, images only, 5 MB cap. |
| `GET /api/status` | Real reachability probe of the NexaDev host (not a lookup test). |

## Notes
- Rate limiting is in-memory per instance (best-effort). Use Vercel Firewall or a shared store for hard limits.
- If avatars are served from a CDN not in `ALLOWED_SUFFIXES` (`app/api/avatar/route.ts`), the Download button will report a failure until the host is added.
- Not-found detection depends on how NexaDev reports missing users (HTTP 404, or `status:false` with a "not found"-style message). Adjust `looksNotFound` in `lib/tiktok.ts` after observing a real response.
- `components/TracMark.tsx` and `app/icon.svg` are placeholder marks — swap in the official TracLabs logo.
