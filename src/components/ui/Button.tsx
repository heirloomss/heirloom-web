import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'bronze' | 'danger' | 'stellar';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-300 focus-visible:outline-none min-h-[44px] disabled:cursor-not-allowed disabled:opacity-55 active:translate-y-0 hover:-translate-y-px';

const variants: Record<Variant, string> = {
  primary: 'bg-moss text-cotton shadow-paper-2 hover:bg-moss-deep',
  bronze: 'bg-bronze text-cotton shadow-paper-2 hover:bg-[#96633A]',
  secondary:
    'border border-ink/15 bg-cotton/80 text-ink shadow-paper-1 hover:border-ink/25 hover:bg-cotton',
  ghost: 'text-ink-soft hover:bg-linen/60 hover:text-ink',
  danger: 'border border-error/30 bg-[#F9EFEE] text-error hover:bg-[#F4E4E3]',
  stellar: 'border border-indigo/30 bg-indigo-wash/50 text-indigo hover:bg-indigo hover:text-cotton shadow-paper-1',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base min-h-[52px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
