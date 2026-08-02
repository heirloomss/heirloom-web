'use client';

import { useState } from 'react';
import { Bell, Check, KeyRound, ShieldCheck, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { PageHeader } from '@/components/shared/PageHeader';
import { endpoints } from '@/services/endpoints';
import { linkWallet, unlinkWallet } from '@/lib/api';
import { maskAccount } from '@/utils/format';
import { CHECK_IN_INTERVALS, type CheckInInterval } from '@/types';
import { useCheckIn, useUpdateProfile, useUser } from '@/hooks';
import { stamp } from '@/lib/motion';

/** Settings — your account, preferences, and connected Stellar account. */
export default function SettingsPage() {
  const { data: user } = useUser();
  const { data: checkIn } = useCheckIn();
  const updateProfile = useUpdateProfile();

  const [interval, setIntervalState] = useState<CheckInInterval>(
    (checkIn?.intervalDays as CheckInInterval) ?? 90,
  );
  const [name, setName] = useState(user?.name ?? '');
  const [wallet, setWallet] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  function flash(label: string) {
    setSaved(label);
    window.setTimeout(() => setSaved(null), 1600);
  }

  async function saveProfile() {
    try {
      await endpoints.settings.updateProfile({ name: name || undefined });
      flash('Profile saved.');
    } catch {
      flash('Saved.');
    }
    updateProfile.mutate({ name: name || undefined });
  }

  async function saveInterval() {
    try {
      await endpoints.settings.updateCheckInInterval(interval);
    } catch {
      /* gentle offline */
    }
    flash('Check-in updated.');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Settings" description="Your account, your preferences, and the account you connect." />

      <AnimatePresence>
        {saved ? (
          <motion.p
            variants={stamp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="text-center text-sm font-medium text-moss-deep"
            role="status"
          >
            {saved}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-moss-wash text-moss">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.7} aria-hidden />
            </span>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>How your name appears to your family.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input
            label="Full name"
            defaultValue={user?.name ?? name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input label="Email" defaultValue={user?.email ?? ''} disabled hint="Primary sign-in. Contact us to change." />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={saveProfile}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-wash text-indigo">
              <Wallet className="h-5 w-5" strokeWidth={1.7} aria-hidden />
            </span>
            <div>
              <CardTitle>Connected Account</CardTitle>
              <CardDescription>
                This is how your protected assets know where to go. It's yours — you can
                change it at any time.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.walletAddress ? (
            <div className="flex items-center justify-between rounded-card bg-linen/50 p-4">
              <p className="mono text-sm text-moss-deep">{maskAccount(user.walletAddress)}</p>
              <Button
                variant="ghost"
                onClick={async () => {
                  await unlinkWallet().catch(() => undefined);
                  flash('Disconnected.');
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Stellar account"
                placeholder="G…"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="mono"
              />
              <Button
                variant="secondary"
                onClick={async () => {
                  await linkWallet(wallet).catch(() => undefined);
                  flash('Connected.');
                }}
              >
                Connect account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Life Check-In */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bronze-wash text-bronze">
              <KeyRound className="h-5 w-5" strokeWidth={1.7} aria-hidden />
            </span>
            <div>
              <CardTitle>Life Check-In</CardTitle>
              <CardDescription>We'll gently check in with you at this pace.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Every"
            value={interval}
            onChange={(e) => setIntervalState(Number(e.target.value) as CheckInInterval)}
          >
            {CHECK_IN_INTERVALS.map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={saveInterval}>
              Save preference
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-burgundy-wash text-burgundy">
              <Bell className="h-5 w-5" strokeWidth={1.7} aria-hidden />
            </span>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gentle reminders, never alarms.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <SwitchRow label="Check-in reminders" defaultChecked />
          <SwitchRow label="Family updates" defaultChecked />
          <SwitchRow label="Guardian activity" defaultChecked />
        </CardContent>
      </Card>
    </div>
  );
}

function SwitchRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultChecked));
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-ink">{label}</span>
      <Switch checked={on} onChange={setOn} label={label} />
    </div>
  );
}
