import { cn } from '@/utils/cn';

type Tone = 'moss' | 'bronze' | 'gold' | 'burgundy' | 'indigo' | 'neutral' | 'success' | 'warning' | 'error';

const tones: Record<Tone, string> = {
  moss: 'bg-moss-wash text-moss-deep',
  bronze: 'bg-bronze-wash text-[#8A5A33]',
  gold: 'bg-[#F6EEDC] text-[#8F7420]',
  burgundy: 'bg-burgundy-wash text-burgundy-deep',
  indigo: 'bg-indigo-wash text-[#4C5878]',
  neutral: 'bg-linen/70 text-ink-soft',
  success: 'bg-[#E4EFE8] text-[#3C6E50]',
  warning: 'bg-[#F6EEDC] text-[#93741F]',
  error: 'bg-[#F4E4E3] text-error',
};

/** A small, quiet label — a stamp, not a shout. */
export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
