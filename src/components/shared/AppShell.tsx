'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Clock,
  Feather,
  FolderOpen,
  HeartHandshake,
  LayoutGrid,
  MoreHorizontal,
  Settings,
  Shield,
  Vault,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { maskAccount } from '@/utils/format';
import { useUser } from '@/hooks';
import { HeirloomLogo } from '@/components/ui/HeirloomLogo';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/beneficiaries', label: 'Beneficiaries', icon: HeartHandshake },
  { href: '/assets', label: 'Assets', icon: Vault },
  { href: '/archive', label: 'Documents', icon: FolderOpen },
  { href: '/messages', label: 'Messages', icon: Feather },
  { href: '/guardians', label: 'Guardians', icon: Shield },
  { href: '/activity', label: 'Activity', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/**
 * The application shell — a calm left navigation beside layered paper content.
 * Reads like a premium journal on mobile, a 3D paper diorama workspace on desktop.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useUser();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryNav = NAV.slice(0, 4);
  const secondaryNav = NAV.slice(4);
  const secondaryActive = secondaryNav.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-content">
      {/* Left navigation sidebar with 3D paper texture */}
      <aside
        aria-label="Primary"
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-ivory/80 px-5 py-8 md:flex shadow-paper-2 z-20"
      >
        <Link href="/dashboard" className="mb-8 flex items-center gap-3.5 px-2">
          <HeirloomLogo size={38} className="shadow-paper-2 rounded-xl" />
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-wide text-ink">Heirloom</span>
            <span className="text-[9px] font-bold tracking-widest text-bronze uppercase">Digital Legacy</span>
          </div>
        </Link>

        <nav className="flex-1">
          <ul className="space-y-1.5">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex min-h-[44px] items-center gap-3 rounded-button px-4 text-sm font-medium transition-all duration-300',
                      active
                        ? 'bg-moss text-cotton shadow-paper-2 font-semibold'
                        : 'text-ink-soft hover:bg-linen/70 hover:text-ink',
                    )}
                  >
                    <item.icon
                      aria-hidden
                      strokeWidth={1.8}
                      className={cn(
                        'h-[18px] w-[18px] transition-colors',
                        active ? 'text-cotton' : 'text-moss group-hover:text-ink',
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto rounded-card border border-moss/15 bg-cotton p-4 shadow-paper-1 paper-stack-deck">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
            Connected Vault
          </p>
          {user?.walletAddress ? (
            <p className="mono mt-1 text-xs font-bold text-moss">{maskAccount(user.walletAddress)}</p>
          ) : (
            <Link
              href="/settings"
              className="mt-1 block text-xs text-bronze font-medium underline-offset-4 hover:underline"
            >
              Connect your wallet
            </Link>
          )}
        </div>
      </aside>

      {/* Main content viewport */}
      <main id="main" className="min-w-0 flex-1 px-5 py-6 pb-28 md:px-10 md:py-10 md:pb-12">
        {children}
      </main>

      {/* Mobile "More" sheet */}
      {moreOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="More navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm animate-fade-in"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-dialog border-t border-ink/10 bg-cotton px-5 pb-8 pt-5 shadow-paper-3">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/10" aria-hidden />
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">More Options</p>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-linen/60"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {secondaryNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[56px] items-center gap-3 rounded-card px-4 text-sm font-medium transition-colors',
                        active ? 'bg-moss text-cotton' : 'bg-ivory text-ink-soft paper-edge',
                      )}
                    >
                      <item.icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cotton/95 backdrop-blur md:hidden shadow-paper-3"
      >
        <ul className="grid grid-cols-5">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-medium',
                    active ? 'text-moss font-bold' : 'text-ink-soft',
                  )}
                >
                  <item.icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-haspopup="dialog"
              className={cn(
                'flex min-h-[56px] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium',
                secondaryActive ? 'text-moss font-bold' : 'text-ink-soft',
              )}
            >
              <MoreHorizontal aria-hidden className="h-5 w-5" strokeWidth={1.8} />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
