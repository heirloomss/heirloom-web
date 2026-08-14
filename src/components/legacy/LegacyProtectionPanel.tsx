'use client';

import { ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLegacyOverview, useSignAndSubmit, signStepLabel } from '@/hooks';
import { endpoints } from '@/services/endpoints';
import type { LegacyPlanStatus } from '@/types';

/**
 * The owner's on-chain control surface. Walks through the self-custodial
 * lifecycle — register (create_legacy), fund (deposit), and, if ever needed,
 * cancel (which refunds any deposit) — with the owner signing each step in their
 * own Freighter wallet. Nothing here fabricates success: every action returns an
 * unsigned transaction the owner signs, then the API reconciles real on-chain
 * state.
 *
 * The user-facing words stay calm — "Protect", "Fund", "Verifying" — never
 * transaction hashes or contract ids.
 */
export function LegacyProtectionPanel() {
  const { data: overview } = useLegacyOverview();
  const sign = useSignAndSubmit();

  if (!overview) return null;

  const { plan, counts, onChainReady } = overview;
  const status = plan.status;
  const registered = plan.legacyId != null;

  // When the on-chain layer isn't configured, be honest — offer nothing to sign.
  if (!onChainReady) {
    return (
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Protect on Stellar</CardTitle>
            <CardDescription>
              On-chain protection isn’t available just yet. Everything you’ve prepared is saved
              safely, and you’ll be able to protect it on Stellar the moment it’s switched on.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const working = sign.isWorking;
  const stepLabel = signStepLabel(sign.step);

  async function runProtect() {
    await sign.run({ action: 'protect', build: () => endpoints.legacy.protectBuild() });
  }

  async function runDeposit() {
    await sign.run({ action: 'deposit', build: () => endpoints.legacy.depositBuild() });
  }

  async function runCancel() {
    await sign.run({ action: 'cancel', build: () => endpoints.legacy.cancelBuild() });
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Protect on Stellar</CardTitle>
          <CardDescription>{describe(status, registered)}</CardDescription>
        </div>
        <StatusBadge status={status} registered={registered} />
      </CardHeader>
      <CardContent>
        <div className="rounded-card bg-linen/50 p-5">
          <ul className="grid grid-cols-2 gap-3 text-sm text-ink-soft">
            <li>
              <span className="font-display text-2xl text-ink">{counts.beneficiaries}</span> loved
              ones
            </li>
            <li>
              <span className="font-display text-2xl text-ink">{counts.guardians}</span> guardians
            </li>
            <li>
              <span className="font-display text-2xl text-ink">{counts.verifiedGuardians}</span>{' '}
              confirmed
            </li>
            <li>
              <span className="font-display text-2xl text-ink">{counts.assets}</span> assets
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {status === 'DRAFT' && !registered ? (
            <Button variant="primary" onClick={runProtect} disabled={working} aria-busy={working}>
              <Sparkles className="h-4 w-4" aria-hidden />
              Protect my legacy
            </Button>
          ) : null}

          {status === 'DRAFT' && registered ? (
            <Button variant="primary" onClick={runDeposit} disabled={working} aria-busy={working}>
              <Wallet className="h-4 w-4" aria-hidden />
              Fund my legacy
            </Button>
          ) : null}

          {status === 'FUNDED' || status === 'VERIFYING' ? (
            <span className="inline-flex items-center gap-2 text-sm text-moss-deep">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {status === 'VERIFYING'
                ? 'Guardians have been asked to confirm, gently.'
                : 'Protected — waiting for your guardians to confirm.'}
            </span>
          ) : null}

          {(status === 'DRAFT' || status === 'FUNDED' || status === 'VERIFIED') && registered ? (
            <Button variant="ghost" onClick={runCancel} disabled={working} aria-busy={working}>
              Cancel & refund
            </Button>
          ) : null}
        </div>

        {working && stepLabel ? (
          <p className="mt-4 text-sm text-ink-soft" role="status">
            {stepLabel}
          </p>
        ) : null}
        {sign.error ? (
          <p role="alert" className="mt-4 text-sm text-error">
            {sign.error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function describe(status: LegacyPlanStatus, registered: boolean): string {
  switch (status) {
    case 'DRAFT':
      return registered
        ? 'Your legacy is registered on Stellar. Fund it to finish protecting it — you sign in your own wallet, and you can withdraw by cancelling at any time before it’s claimed.'
        : 'When you’re ready, protect everything you’ve prepared on Stellar. You’ll sign in your own wallet — Heirloome never holds your keys.';
    case 'FUNDED':
      return 'Everything is protected on Stellar. Your guardians simply confirm when the time comes.';
    case 'VERIFYING':
      return 'Trusted guardians have been asked to confirm. Nothing has been released.';
    case 'VERIFIED':
      return 'Your guardians have confirmed. Your legacy is ready to be released to the people you love.';
    case 'RELEASED':
      return 'Your legacy has been released. Your loved ones can now receive what you left for them.';
    case 'CANCELLED':
      return 'This plan was cancelled and any funds were refunded to you. You can protect a new legacy whenever you wish.';
    default:
      return '';
  }
}

function StatusBadge({
  status,
  registered,
}: {
  status: LegacyPlanStatus;
  registered: boolean;
}) {
  const label =
    status === 'DRAFT' ? (registered ? 'Awaiting funding' : 'Not yet protected') : friendly(status);
  const tone =
    status === 'RELEASED' || status === 'VERIFIED' || status === 'FUNDED'
      ? 'bg-moss-wash text-moss-deep'
      : status === 'CANCELLED'
        ? 'bg-linen text-ink-faint'
        : 'bg-bronze-wash text-bronze';
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tone}`}
    >
      {label}
    </span>
  );
}

function friendly(status: LegacyPlanStatus): string {
  switch (status) {
    case 'FUNDED':
      return 'Protected';
    case 'VERIFYING':
      return 'Confirming';
    case 'VERIFIED':
      return 'Verifying complete';
    case 'RELEASED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}
