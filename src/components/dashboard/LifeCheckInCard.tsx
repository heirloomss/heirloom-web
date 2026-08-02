'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { stamp } from '@/lib/motion';
import { relativeDays } from '@/utils/format';
import { useCheckIn, useConfirmCheckIn } from '@/hooks';

/**
 * The Life Check-In — a single gentle "I'm Here". On confirm, a small paper
 * stamp settles with the word "Confirmed" and fades naturally.
 */
export function LifeCheckInCard() {
  const { data } = useCheckIn();
  const confirm = useConfirmCheckIn();
  const [confirmed, setConfirmed] = useState(false);
  const reduceMotion = useReducedMotion();

  const daysSince = data?.lastCheckIn
    ? Math.max(0, Math.round((Date.now() - new Date(data.lastCheckIn).getTime()) / 86_400_000))
    : 0;

  function handleConfirm() {
    setConfirmed(true);
    confirm.mutate();
  }

  return (
    <section
      aria-labelledby="checkin-heading"
      className="relative overflow-hidden rounded-card bg-cotton p-8 text-center paper-edge"
    >
      <h2 id="checkin-heading" className="font-display text-2xl">
        Your next Life Check-In
      </h2>
      <p className="mt-2 text-ink-soft">
        {confirmed ? (
          'Thank you for letting us know. Everything stays just as it is.'
        ) : (
          <>
            <span className="font-medium text-ink">{data?.daysRemaining ?? 0} days</span> remaining
            {data?.lastCheckIn ? ` · last confirmed ${relativeDays(daysSince)}` : ''}
          </>
        )}
      </p>

      <div className="relative mt-6 flex justify-center">
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="stamp"
              variants={stamp}
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
              className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-moss/50 bg-moss-wash text-moss-deep shadow-paper-1"
              role="status"
            >
              <span className="font-display text-sm font-semibold uppercase tracking-widest">
                Confirmed
              </span>
            </motion.div>
          ) : (
            <motion.div key="button" exit={{ opacity: 0, y: 8 }}>
              <Button
                size="lg"
                onClick={handleConfirm}
                aria-label="Confirm that you are here"
                disabled={confirm.isPending}
              >
                I&rsquo;m Here
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-5 text-xs text-ink-faint">
        One click, that&rsquo;s all. We&rsquo;ll quietly check in again in {data?.intervalDays ?? 90}{' '}
        days.
      </p>
    </section>
  );
}
