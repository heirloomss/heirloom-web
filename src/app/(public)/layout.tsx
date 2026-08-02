import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/** A quiet public layout: the Heirloom wordmark and a gentle return home. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <header className="mx-auto flex max-w-content items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="font-display text-xl font-semibold tracking-wide">
          Heirloom
        </Link>
        <Link href="/dashboard" aria-label="Go to your dashboard">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      </header>
      {children}
    </div>
  );
}
