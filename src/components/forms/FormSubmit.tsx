'use client';

import { Button, type ButtonProps } from '@/components/ui/Button';

/** A primary submit button for forms — busy-aware with warm copy. */
export function FormSubmit({
  children,
  loading,
  ...props
}: ButtonProps & { loading?: boolean }) {
  return (
    <Button type="submit" variant="primary" disabled={loading} aria-busy={loading} {...props}>
      {loading ? 'One moment…' : children}
    </Button>
  );
}
