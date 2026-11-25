import Link from "next/link";
import { ApiStatus } from "@/components/ApiStatus";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TracMark } from "@/components/TracMark";
import { SITE } from "@/lib/site";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <nav
        aria-label="Primary"
        className="glass-floating mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full pl-3 pr-2 sm:pl-4"
      >
        <Link href="/" className="flex items-center gap-2.5 rounded-full" aria-label={`${SITE.name} home`}>
          <TracMark />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">{SITE.name}</span>
            <span className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:block">{SITE.brand}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-current="page"
            className="hidden min-h-9 items-center rounded-full px-3 text-[13px] font-medium sm:inline-flex"
          >
            Home
          </Link>
          <div className="hidden sm:block">
            <ApiStatus />
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
