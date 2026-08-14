import Link from 'next/link';
import { HeirloomLogo } from '@/components/ui/HeirloomLogo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <HeirloomLogo size={56} className="mb-4 shadow-paper-2 rounded-xl" />
      <h1 className="font-display text-4xl font-bold text-ink">404 — Page Not Found</h1>
      <p className="mt-2 text-sm text-ink-soft max-w-md">
        The document or vault path you requested could not be located in your Heirloome directory.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-button bg-moss px-6 text-sm font-semibold text-cotton shadow-paper-2 transition-transform hover:-translate-y-0.5"
      >
        Return to Home
      </Link>
    </div>
  );
}
