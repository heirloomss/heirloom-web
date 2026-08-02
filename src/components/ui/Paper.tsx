import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'cotton' | 'ivory' | 'linen';
  padding?: boolean;
}

/** A single sheet of paper — the base surface of every card and panel. */
export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { className, tone = 'cotton', padding = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-card paper-edge',
        tone === 'cotton' && 'bg-cotton',
        tone === 'ivory' && 'bg-ivory',
        tone === 'linen' && 'bg-linen',
        padding && 'p-6 sm:p-8',
        className,
      )}
      {...props}
    />
  );
});
