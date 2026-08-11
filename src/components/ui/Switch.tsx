'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
  disabled?: boolean;
}

/** A gentle on/off control — a small paper toggle with clear labeling. */
export function Switch({ label, description, checked, onChange, className, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn('flex items-center justify-between gap-6 py-2', className)}>
      <div>
        <label htmlFor={id} className="text-base font-medium text-ink">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-sm text-ink-soft">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss disabled:cursor-not-allowed disabled:opacity-60',
          checked ? 'border-moss bg-moss' : 'border-ink/15 bg-linen',
        )}
      >
        <motion.span
          aria-hidden
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          className={cn('block h-6 w-6 rounded-full bg-cotton shadow-paper-1', checked ? 'ml-auto' : '')}
        />
      </button>
    </div>
  );
}
