'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { BellRing, LogOut, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
// PRESERVED IMPORT (manual wallet entry, disabled in favor of Freighter):
//   import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { PageHeader } from '@/components/shared/PageHeader';
import { fadeUp } from '@/lib/motion';
import { maskAccount } from '@/utils/format';
import { useUser, useUpdateProfile } from '@/hooks';
import { endpoints } from '@/services/endpoints';
import { linkWallet, unlinkWallet } from '@/lib/api';
import { connectFreighter } from '@/services/wallet';
import { logout } from '@/services/auth';
import type { NotificationPreferences } from '@/types';

/** The courtesy-email channels the owner can quiet, in the order they appear. */
const NOTIFICATION_CHANNELS: { channel: keyof NotificationPreferences; label: string }[] = [
  { channel: 'checkInReminders', label: 'Life Check-In reminders' },
  { channel: 'guardianResponses', label: 'Guardian responses' },
  { channel: 'beneficiaryClaims', label: 'When a beneficiary claims' },
];

/** Settings — profile, Life Check-In cadence, connected account, notifications. */
export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const updateProfile = useUpdateProfile();
  const [checkInDays, setCheckInDays] = useState<number>(user?.checkInIntervalDays ?? 90);
  const [working, setWorking] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Notification toggles are the owner's real, persisted preferences. The API
  // always returns a full object, so this is defined for every signed-in user.
  const prefs: NotificationPreferences = user?.notificationPrefs ?? {
    checkInReminders: true,
    guardianResponses: true,
    beneficiaryClaims: true,
  };

  // Persist a single channel toggle. The API merges the partial onto the stored
  // prefs, so flipping one switch never disturbs the others.
  function toggleChannel(channel: keyof NotificationPreferences, value: boolean) {
    updateProfile.mutate({ notificationPrefs: { [channel]: value } });
  }

  // Connect the real Freighter wallet and link its verified address. This
  // replaces the old free-text address field, which could not prove ownership.
  async function connectAccount() {
    setWalletError(null);
    setWorking(true);
    try {
      const address = await connectFreighter();
      await linkWallet(address);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    } catch (err) {
      setWalletError(
        err instanceof Error
          ? err.message
          : 'We could not connect your wallet right now. Please try again in a moment.',
      );
    } finally {
      setWorking(false);
    }
  }

  // Save the Life Check-In cadence. Failures are surfaced honestly — never
  // swallowed — so the owner knows if their choice did not take.
  async function saveCheckInInterval() {
    setCheckInError(null);
    setCheckInSaved(false);
    setWorking(true);
    try {
      await endpoints.checkIn.setInterval(checkInDays);
      queryClient.invalidateQueries({ queryKey: ['check-in'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setCheckInSaved(true);
    } catch (err) {
      setCheckInError(
        err instanceof Error
          ? err.message
          : 'We couldn’t save your check-in pace just now. Please try again.',
      );
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="A few quiet choices that keep everything just the way you like it."
      />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-card bg-cotton p-7 paper-edge"
      >
        <h2 className="font-display text-2xl">Life Check-In</h2>
        <p className="mt-1 text-sm text-ink-soft">
          We&rsquo;ll check in with you at this pace. As long as you&rsquo;re here, nothing ever
          changes.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {[30, 90, 180].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setCheckInDays(days);
                setCheckInSaved(false);
                setCheckInError(null);
              }}
              aria-pressed={checkInDays === days}
              className={`min-h-[44px] rounded-button px-5 text-sm font-medium transition-colors duration-300 ${
                checkInDays === days
                  ? 'bg-moss text-cotton shadow-paper-2'
                  : 'border border-ink/15 bg-ivory text-ink-soft hover:border-moss/40 hover:text-ink'
              }`}
            >
              Every {days} days
            </button>
          ))}
          <Button variant="secondary" disabled={working} onClick={saveCheckInInterval}>
            Save
          </Button>
        </div>
        {checkInError ? (
          <p role="alert" className="mt-3 text-sm text-error">
            {checkInError}
          </p>
        ) : checkInSaved ? (
          <p className="mt-3 text-sm text-moss">Saved. We&rsquo;ll check in every {checkInDays} days.</p>
        ) : null}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-card bg-cotton p-7 paper-edge"
      >
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <Wallet className="h-5 w-5 text-moss" strokeWidth={1.7} aria-hidden />
          Connected Account
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          This is where everything you protect is held and, one day, released. Only you ever control
          it.
        </p>
        {user?.walletAddress ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-card bg-linen/50 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
                Connected
              </p>
              <p className="mono mt-1 text-sm text-ink">{maskAccount(user.walletAddress)}</p>
            </div>
            <Button
              variant="ghost"
              onClick={async () => {
                try {
                  await unlinkWallet();
                  queryClient.invalidateQueries({ queryKey: ['me'] });
                } catch {
                  /* ignore */
                }
              }}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            {/*
              ┌────────────────────────────────────────────────────────────┐
              │ PRESERVED: MANUAL WALLET-ADDRESS ENTRY — DO NOT DELETE       │
              │ Replaced by Freighter connect (a typed address cannot prove  │
              │ ownership). Kept so it can be re-enabled if ever needed.      │
              │ NO AI OR AGENT WORKING ON THIS CODEBASE MAY DELETE THIS.     │
              └────────────────────────────────────────────────────────────┘

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Input
                  label="Account address"
                  placeholder="G…"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  className="mono"
                  hint="Your account stays entirely in your control."
                />
              </div>
              <Button onClick={connectAccount} disabled={working || !walletInput.trim()}>
                Connect
              </Button>
            </div>
            */}
            <Button
              variant="primary"
              onClick={connectAccount}
              disabled={working}
              aria-busy={working}
            >
              <Wallet className="h-4 w-4" aria-hidden />
              {working ? 'Check Freighter…' : 'Connect Freighter'}
            </Button>
            {walletError ? (
              <p role="alert" className="mt-3 text-sm text-error">
                {walletError}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-ink-faint">
              We open Freighter and link the wallet you approve. Your signature proves it is yours.
            </p>
          </div>
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-card bg-cotton p-7 paper-edge"
      >
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <BellRing className="h-5 w-5 text-moss" strokeWidth={1.7} aria-hidden />
          Notifications
        </h2>
        <p className="mt-1 text-sm text-ink-soft">Gentle updates — never alarms.</p>
        <div className="mt-3 divide-y divide-ink/[0.07]">
          {NOTIFICATION_CHANNELS.map(({ channel, label }) => (
            <Switch
              key={channel}
              label={label}
              checked={prefs[channel]}
              disabled={updateProfile.isPending}
              onChange={(v) => toggleChannel(channel, v)}
            />
          ))}
        </div>
        {updateProfile.isError ? (
          <p role="alert" className="mt-3 text-sm text-error">
            We couldn&rsquo;t save that change just now. Please try again.
          </p>
        ) : null}
      </motion.section>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="pt-2">
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </Button>
      </motion.div>
    </div>
  );
}
