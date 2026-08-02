import { initials } from '@/utils/format';
import { cn } from '@/utils/cn';

const palette = [
  'bg-moss-wash text-moss-deep',
  'bg-burgundy-wash text-burgundy',
  'bg-indigo-wash text-indigo',
  'bg-bronze-wash text-bronze',
];

/** A soft paper token with the person's initials — always legible. */
export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const tone = palette[hash % palette.length];

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-medium',
        tone,
        size === 'sm' && 'h-9 w-9 text-xs',
        size === 'md' && 'h-11 w-11 text-sm',
        size === 'lg' && 'h-14 w-14 text-base',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
