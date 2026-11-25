export function LoadingSkeleton() {
  return (
    <div className="glass-panel rounded-[28px] p-5 sm:p-8" role="status" aria-label="Loading profile">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        <div className="glass-skeleton h-28 w-28 shrink-0 rounded-full" />
        <div className="flex w-full flex-1 flex-col items-center gap-3 sm:items-start">
          <div className="glass-skeleton h-7 w-48 max-w-full rounded-xl" />
          <div className="glass-skeleton h-4 w-32 rounded-lg" />
        </div>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-skeleton h-[88px] rounded-2xl" />
        ))}
      </div>
      <div className="glass-divider my-7" />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass-skeleton h-12 rounded-xl" />
        <div className="glass-skeleton h-12 rounded-xl" />
        <div className="glass-skeleton h-20 rounded-xl md:col-span-2" />
      </div>
      <span className="sr-only">Loading profile…</span>
    </div>
  );
}
