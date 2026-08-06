/**
 * Demo mode is an explicit, opt-in reviewer convenience — NOT a production
 * default. When `NEXT_PUBLIC_DEMO_MODE=true`, pages fall back to warm sample
 * data if the API is unreachable so the full UX is explorable offline. When it
 * is unset/false (the production default), no fabricated data is ever shown:
 * the app relies entirely on the real heirloom-api.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
