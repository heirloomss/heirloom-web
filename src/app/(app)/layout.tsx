import { AppShell } from '@/components/shared/AppShell';
import { AuthGuard } from '@/components/shared/AuthGuard';

/**
 * All authenticated product screens share the calm left-nav shell, behind an
 * AuthGuard so only a signed-in (Freighter) session — or explicit demo mode —
 * can reach them.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
