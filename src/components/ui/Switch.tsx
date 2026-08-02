'use client';

import { cn } from '@/utils/cn';

/** A calm toggle — large hit target, clear states, keyboard friendly. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border px-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss',
        checked ? 'border-moss bg-moss' : 'border-ink/20 bg-linen',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'h-5 w-5 rounded-full bg-cotton shadow-paper-1 transition-transform duration-300',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}
