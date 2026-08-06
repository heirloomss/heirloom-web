'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';
import { isDemoMode } from '@/lib/demo';

/**
 * Guards the authenticated app shell. Heirloom's only way in is a Freighter
 * wallet signature, so anyone without a valid session is sent to /login. Demo
 * mode (an explicit, opt-in reviewer flag) is allowed through so the full UX is
 * explorable offline. The check runs client-side because the session token
 * lives in the browser; we render nothing until it resolves to avoid a flash of
 * protected content.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isDemoMode() || isAuthenticated()) {
      setReady(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
