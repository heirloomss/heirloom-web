import Link from 'next/link';
import { HeirloomLogo } from '@/components/ui/HeirloomLogo';

/** Centered paper-card backdrop for sign in / create account. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-72 max-w-2xl"
      >
        <div className="absolute left-1/2 top-2 h-56 w-[420px] max-w-[80vw] -translate-x-1/2 -rotate-2 rounded-card bg-linen/70 shadow-paper-1" />
        <div className="absolute left-1/2 top-6 h-56 w-[380px] max-w-[74vw] -translate-x-1/2 rotate-1 rounded-card bg-cotton shadow-paper-2 paper-edge" />
      </div>

      <Link href="/" className="relative z-10 mb-8 flex items-center gap-3.5">
        <HeirloomLogo size={44} className="shadow-paper-2 rounded-xl" />
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold tracking-wide text-ink">Heirloome</span>
          <span className="text-[9px] font-bold tracking-widest text-bronze uppercase">Digital Legacy</span>
        </div>
      </Link>

      <div className="relative z-10 w-full max-w-md rounded-dialog bg-cotton p-8 shadow-paper-3 paper-edge sm:p-10">
        {children}
      </div>

      <p className="relative z-10 mt-8 text-center font-display text-lg italic text-ink-faint">
        Your legacy, thoughtfully prepared.
      </p>
    </div>
  );
}
