'use client';

export function LinkCardSkeleton() {
  return (
    <div className="card-hover card animate-pulse">
      <div className="w-full h-40 bg-slate-800 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-slate-800 rounded flex-1" />
          <div className="h-10 bg-slate-800 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export function LinkGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LinkCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="h-16 glass border-b border-slate-700">
      <div className="container flex items-center justify-between py-4 h-full">
        <div className="h-8 w-40 bg-slate-800 rounded" />
        <div className="hidden md:flex gap-4">
          <div className="h-8 w-20 bg-slate-800 rounded" />
          <div className="h-8 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </header>
  );
}
