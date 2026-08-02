import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

/** A labeled text input — generous, high-contrast, screen-reader friendly. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, optional, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
        {optional ? <span className="ml-2 text-xs font-normal text-ink-faint">optional</span> : null}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          'min-h-[48px] w-full rounded-input border bg-ivory px-4 text-base text-ink shadow-paper-inset transition-colors placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-0 focus-visible:border-moss',
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
