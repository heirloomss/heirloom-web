import { cn } from '@/utils/cn';

/**
 * PaperLayer — a plain server-safe card shell. Layered archival paper:
 * hairline edge, soft shadow, quiet hover lift.
 */
export function PaperLayer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-card border border-ink/[0.07] bg-cotton shadow-paper-1 transition-[box-shadow,transform] duration-500 hover:shadow-paper-2',
        className,
      )}
    >
      {children}
    </div>
  );
}
