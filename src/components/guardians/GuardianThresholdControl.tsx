'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useGuardianSettings, useGuardians } from '@/hooks';

/**
 * Choose how many guardians must confirm before anything is shared.
 * Plain language — no multisig jargon.
 */
export function GuardianThresholdControl() {
  const { data: settings } = useGuardianSettings();
  const { data: guardians = [] } = useGuardians();
  const [required, setRequired] = useState(settings?.requiredApprovals ?? 2);

  const total = guardians.length || settings?.guardianCount || 3;
  const max = Math.max(1, total);

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
            aria-valuetext={`${required} of ${total} guardians must confirm`}
          />
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          We recommend at least two. This keeps everything safe even if one
          guardian is unreachable.
        </p>
      </CardContent>
    </Card>
  );
}
