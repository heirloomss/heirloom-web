'use client';

import { motion } from 'framer-motion';
import { Clock, Stamp } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { LifeCheckInCard } from '@/components/dashboard/LifeCheckInCard';
import { FamilyTimeline } from '@/components/timeline/FamilyTimeline';
import { LegacyJourneyTimeline } from '@/components/timeline/LegacyJourneyTimeline';
import { useCheckIn } from '@/hooks';
import { stamp } from '@/lib/motion';

/** Activity — your Family Timeline, Life Check-In, and Legacy Journey. */
export default function ActivityPage() {
  const { data: checkIn } = useCheckIn();

  return (
    <div className="space-y-12">
      <PageHeader
        title="Activity"
        description="The family journal of your legacy plan — always up to date, always reassuring."
      />

      {/* Current Life Check-In status */}
      <section aria-labelledby="checkin-hero" className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <LifeCheckInCard />
        <motion.div
          variants={stamp}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center justify-center rounded-card bg-linen/60 p-8 text-center paper-edge"
        >
          <Stamp className="h-7 w-7 text-bronze" strokeWidth={1.6} aria-hidden />
          <p className="mt-4 font-display text-2xl">
            You’re exactly on time.
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Every check-in keeps your family’s plan quietly current. There’s
            nothing to remember — just let us know you’re here, and we’ll take
            care of the rest.
          </p>
          <p className="mono mt-4 text-sm text-ink-soft">
            Next check-in in {checkIn?.daysRemaining ?? '—'} days
          </p>
        </motion.div>
      </section>

      {/* Legacy Journey — the signature timeline */}
      <motion.section aria-labelledby="journey-heading" className="rounded-card bg-cotton p-7 shadow-paper-2 paper-edge md:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
            The Legacy Journey
          </p>
          <h2 id="journey-heading" className="mt-2 font-display text-4xl">
            Delivered at exactly the right moment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
            Some things arrive right away; others wait for a graduation, a
            wedding, a quiet birthday. You choose each moment — Heirloome keeps
            your timing perfectly.
          </p>
        </div>
        <LegacyJourneyTimeline />
      </motion.section>

      {/* Family Timeline */}
      <section aria-labelledby="timeline-heading" className="rounded-card bg-linen/50 p-7 paper-edge md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <Clock className="h-5 w-5 text-moss" aria-hidden />
          <h2 id="timeline-heading" className="font-display text-3xl">
            Family Timeline
          </h2>
        </div>
        <FamilyTimeline />
      </section>
    </div>
  );
}
