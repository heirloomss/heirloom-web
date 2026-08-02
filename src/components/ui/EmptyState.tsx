import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

/** Gentle invitation displayed when a collection is still empty. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-ink/15 bg-cotton/60 px-6 py-16 text-center">
      <span
        aria-hidden
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linen text-ink-soft"
      >
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 font-display text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-reading text-pretty text-ink-soft">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-7" size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
