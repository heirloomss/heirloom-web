import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution.
 *
 * Formatting helpers (formatUsd, formatDate, greeting, …) intentionally live
 * only in `@/utils/format` — keeping a single source avoids the two copies
 * drifting apart (the former copy here silently rendered "Invalid Date").
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
