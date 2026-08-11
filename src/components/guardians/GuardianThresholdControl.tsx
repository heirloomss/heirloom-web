'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useGuardianSettings, useGuardians, useSetThreshold } from '@/hooks';

/**
 * Choose how many guardians must confirm before anything is shared.
 * Plain language — no multisig jargon.
 *
 * The chosen value is persisted to the API (PATCH /legacy/threshold) when the
 * slider settles, so protecting the legacy uses the same number the owner sees.
 * The threshold is locked once the plan is registered on-chain.
 */
export function GuardianThresholdControl() {
  const { data: settings } = useGuardianSettings();
  const { data: guardians = [] } = useGuardians();
  const setThreshold = useSetThreshold();

  const total = guardians.length || settings?.guardianCount || 3;
  const max = Math.max(1, total);

  const persisted = settings?.requiredApprovals && settings.requiredApprovals > 0
    ? settings.requiredApprovals
    : Math.min(2, max);
  const [required, setRequired] = useState(persisted);

  // Keep the slider in step with the server value unless the user is mid-drag.
  useEffect(() => {
    if (!setThreshold.isPending) setRequired(persisted);
  }, [persisted, setThreshold.isPending]);

  function commit(value: number) {
    if (value === persisted) return;
    setThreshold.mutate(value);
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Approval threshold</CardTitle>
          <CardDescription>
            How many guardians must say yes before your legacy is shared.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-card bg-linen/50 p-5 text-center">
          <p className="font-display text-3xl">
            {required}
            <span className="text-ink-faint"> of </span>
            {total}
          </p>
          <p className="mt-1 text-sm text-ink-soft">must confirm</p>
        </div>
        <div className="mt-6">
          <Slider
            label="How many must confirm?"
            min={1}
            max={max}
            value={required}
            onChange={(e) => setRequired(Number(e.target.value))}
            onPointerUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
            onKeyUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
            aria-valuetext={`${required} of ${total} guardians must confirm`}
          />
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          We recommend at least two. This keeps everything safe even if one
          guardian is unreachable.
        </p>
        {setThreshold.isError ? (
          <p role="alert" className="mt-3 text-sm text-error">
            {setThreshold.error instanceof Error
              ? setThreshold.error.message
              : 'We couldn’t save that just now. Please try again in a moment.'}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
