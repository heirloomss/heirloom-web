import { AppShell } from '@/components/shared/AppShell';

/** All authenticated product screens share the calm left-nav shell. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
