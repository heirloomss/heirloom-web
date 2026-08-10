'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/services/endpoints';
import { connectFreighter, signTransaction } from '@/services/wallet';
import type { LegacyAction, SubmitResult, UnsignedTransaction } from '@/types';

/**
 * The shared self-custody handshake used everywhere a state change touches the
 * chain: request an unsigned transaction from the API → sign it in Freighter →
 * relay the signed XDR to POST /legacy/submit → invalidate the affected React
 * Query caches so the UI reflects the new on-chain truth.
 *
 * The API never holds a signing key. The owner / guardian / beneficiary always
 * signs with their own wallet, which is why every build step is paired with a
 * `signTransaction` and a submit here rather than a single server call.
 */

export type SignStep = 'idle' | 'building' | 'signing' | 'submitting' | 'done';

interface RunOptions {
  /** Which lifecycle action this signature carries — tells the API how to reconcile. */
  action: LegacyAction;
  /** Fetch the unsigned transaction for this step. */
  build: () => Promise<UnsignedTransaction>;
  /** Scope for reconciliation (approve → guardianId, claim → beneficiaryId). */
  guardianId?: string;
  beneficiaryId?: string;
  /**
   * The account expected to sign. If omitted we connect Freighter and use the
   * account the user approves — correct for owner-signed steps. Guardian and
   * beneficiary flows pass the address they connected explicitly.
   */
  signerAddress?: string;
}

/** Query keys refreshed after any successful on-chain submit. */
const AFFECTED_KEYS = [
  ['me'],
  ['legacy', 'journey'],
  ['legacy', 'overview'],
  ['assets'],
  ['guardians'],
  ['guardians', 'settings'],
  ['check-in'],
  ['activity', 'timeline'],
  ['dashboard'],
] as const;

export function useSignAndSubmit() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<SignStep>('idle');
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
  }, []);

  const run = useCallback(
    async (options: RunOptions): Promise<SubmitResult> => {
      setError(null);
      try {
        setStep('building');
        const unsigned = await options.build();

        setStep('signing');
        const signerAddress = options.signerAddress ?? (await connectFreighter());
        const signedXdr = await signTransaction(unsigned.xdr, {
          networkPassphrase: unsigned.networkPassphrase,
          address: signerAddress,
        });

        setStep('submitting');
        const result = await endpoints.legacy.submit({
          action: options.action,
          signedXdr,
          guardianId: options.guardianId,
          beneficiaryId: options.beneficiaryId,
        });

        await Promise.all(
          AFFECTED_KEYS.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
        );

        setStep('done');
        return result;
      } catch (err) {
        setStep('idle');
        const message =
          err instanceof Error
            ? err.message
            : 'We couldn’t complete that just now. Please try again in a moment.';
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      }
    },
    [queryClient],
  );

  return { run, reset, step, error, isWorking: step !== 'idle' && step !== 'done' };
}

/** Human-friendly label for the current signing step. */
export function signStepLabel(step: SignStep): string {
  switch (step) {
    case 'building':
      return 'Preparing…';
    case 'signing':
      return 'Waiting for your signature…';
    case 'submitting':
      return 'Finishing up…';
    case 'done':
      return 'Done';
    default:
      return '';
  }
}
