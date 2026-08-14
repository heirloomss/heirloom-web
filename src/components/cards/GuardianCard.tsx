'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, Wallet } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { stack } from '@/lib/motion';
import { useSignAndSubmit, signStepLabel } from '@/hooks';
import { endpoints } from '@/services/endpoints';
import { connectFreighter, WalletError } from '@/services/wallet';
import { maskAccount } from '@/utils/format';
import type { Guardian } from '@/types';

/**
 * A trusted guardian — a guardian, never an "executor".
 *
 * When a plan is Protected (Funded on-chain), each guardian confirms by signing
 * `approve_guardian` in their own Freighter wallet. Heirloom never signs for
 * them: we build the unsigned transaction, the guardian's key authorizes it, and
 * the API reconciles once it confirms. The guardian's wallet is recorded on first
 * approval so later signatures must come from the same account.
 */
export function GuardianCard({ guardian }: { guardian: Guardian }) {
  const verified = guardian.status === 'Verified';
  const sign = useSignAndSubmit();
  const [connectError, setConnectError] = useState<string | null>(null);

  const working = sign.isWorking;
  const stepLabel = signStepLabel(sign.step);

  async function approve() {
    setConnectError(null);
    let address = guardian.walletAddress;
    if (!address) {
      try {
        address = await connectFreighter();
      } catch (err) {
        setConnectError(
          err instanceof WalletError
            ? err.message
            : 'We couldn’t reach your wallet just now. Please try again.',
        );
        return;
      }
    }

    try {
      await sign.run({
        action: 'approve',
        guardianId: guardian.id,
        signerAddress: address,
        build: () => endpoints.guardians.approveBuild(guardian.id, address ?? undefined),
      });
    } catch {
      // sign.error already carries the message for the alert below.
    }
  }

  return (
    <motion.li variants={stack} className="list-none">
      <article className="rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar name={guardian.name} />
            <div>
              <p className="font-display text-xl leading-tight">{guardian.name}</p>
              <p className="text-sm text-ink-soft">{guardian.relationship}</p>
            </div>
          </div>
          <Badge tone={verified ? 'success' : 'warning'}>
            {verified ? (
              <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
            ) : (
              <ShieldQuestion className="mr-1 h-3.5 w-3.5" aria-hidden />
            )}
            {guardian.status}
          </Badge>
        </div>

        <p className="mt-4 text-sm text-ink-soft">{guardian.email}</p>

        {guardian.walletAddress ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
            <Wallet className="h-3.5 w-3.5" aria-hidden />
            <span className="mono">{maskAccount(guardian.walletAddress)}</span>
          </p>
        ) : null}

        {verified ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-moss-deep">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Confirmed on Stellar. Thank you for standing watch.
          </p>
        ) : (
          <div className="mt-5 border-t border-ink/10 pt-4">
            <p className="text-sm text-ink-soft">
              When the time comes, {guardian.name.split(' ')[0]} confirms by signing in their own
              wallet — a careful safeguard that no one can bypass.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={approve}
                disabled={working}
                aria-busy={working}
              >
                <Wallet className="h-4 w-4" aria-hidden />
                {guardian.walletAddress ? 'Confirm with wallet' : 'Connect wallet & confirm'}
              </Button>
              {working && stepLabel ? (
                <span className="text-sm text-ink-soft" role="status">
                  {stepLabel}
                </span>
              ) : null}
            </div>
            {connectError ?? sign.error ? (
              <p role="alert" className="mt-3 text-sm text-error">
                {connectError ?? sign.error}
              </p>
            ) : null}
          </div>
        )}
      </article>
    </motion.li>
  );
}
