import { cn } from '@/utils/cn';

/** Semantic card primitives built on the paper surface. */

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={cn('rounded-card bg-cotton p-6 paper-edge sm:p-7', className)}>
      {children}
    </article>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <header className={cn('mb-5 flex items-start justify-between gap-4', className)}>{children}</header>;
}

export function CardTitle({
  children,
  className,
  as: Tag = 'h3',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}) {
  return <Tag className={cn('font-display text-2xl', className)}>{children}</Tag>;
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn('mt-1 text-sm leading-relaxed text-ink-soft', className)}>{children}</p>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}
