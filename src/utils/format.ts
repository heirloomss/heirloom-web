/** Formatting helpers — calm, human, uncluttered. */

/** USD with no cents for uncluttered totals. */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** An asset amount with its code, e.g. "5,000 USDC". */
export function formatAsset(amount: number, code: string): string {
  return `${new Intl.NumberFormat('en-US').format(amount)} ${code}`;
}

/** Short, elegant date — "12 Mar 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Time-of-day greeting for the dashboard hero. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Good Evening';
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/** Human, warm relative time — "Today", "Yesterday", "12 days ago". */
export function relativeDays(days: number): string {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

/** Mask an account id for the "Connected Account" display. */
export function maskAccount(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

/** Deterministic initials for avatars. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
