import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

/** A labeled multi-line field — calm and roomy. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, optional, className, id, rows = 5, ...props },
  ref,
) {
  const autoId = useId();
  const areaId = id ?? autoId;
  const errorId = `${areaId}-error`;
  const hintId = `${areaId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={areaId} className="text-sm font-medium text-ink">
        {label}
        {optional ? <span className="ml-2 text-xs font-normal text-ink-faint">optional</span> : null}
      </label>
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          'w-full rounded-input border bg-ivory px-4 py-3 text-base leading-relaxed text-ink shadow-paper-inset transition-colors placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-0 focus-visible:border-moss',
          error ? 'border-error/60' : 'border-ink/[0.14] hover:border-ink/25',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-sm text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
