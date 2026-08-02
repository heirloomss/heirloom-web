import { cn } from '@/utils/cn';

/** Soft paper shimmer while content loads. */
export function PaperSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden rounded-card bg-linen/70', className)}
    >
      <div className="absolute inset-0 -translate-x-full animate-paper-shimmer bg-gradient-to-r from-transparent via-cotton/70 to-transparent" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div aria-hidden className="rounded-card border border-ink/[0.06] bg-cotton p-7 shadow-paper-1">
      <PaperSkeleton className="h-5 w-1/3 rounded-full" />
      <PaperSkeleton className="mt-4 h-3.5 w-2/3 rounded-full" />
      <PaperSkeleton className="mt-2 h-3.5 w-1/2 rounded-full" />
      <PaperSkeleton className="mt-8 h-10 w-28 rounded-button" />
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
