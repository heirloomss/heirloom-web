import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  deck?: boolean;
  dogear?: boolean;
}

export function Card({
  children,
  className,
  deck = false,
  dogear = false,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        'rounded-card bg-cotton p-6 paper-edge transition-all duration-300 shadow-paper-2 hover:shadow-paper-3 hover:-translate-y-0.5 sm:p-7',
        deck && 'paper-stack-deck',
        dogear && 'paper-dogear',
        className
      )}
      {...props}
    >
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
  return <Tag className={cn('font-display text-2xl font-semibold text-ink', className)}>{children}</Tag>;
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
