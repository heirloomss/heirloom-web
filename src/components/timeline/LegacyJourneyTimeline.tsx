'use client';

import { motion } from 'framer-motion';
import { FileText, Heart, Vault, type LucideIcon } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';
import { useLegacyJourney } from '@/hooks';
import type { JourneyEvent } from '@/types';

const KIND_ICON: Record<JourneyEvent['kind'], LucideIcon> = {
  asset: Vault,
  document: FileText,
  message: Heart,
};

/**
 * The Legacy Journey — the signature screen. An ordered release of assets,
 * documents, letters and memories at the moments you choose.
 */
export function LegacyJourneyTimeline() {
  const { data } = useLegacyJourney();
  const journey = data ?? [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <ol className="relative space-y-6">
        {journey.map((stop, i) => {
          const Icon = KIND_ICON[stop.kind] ?? Heart;
          return (
            <motion.li key={stop.id} variants={fadeUp} className="relative flex gap-5">
              {i < journey.length - 1 ? (
                <span
                  aria-hidden
                  className="thread-stitch absolute left-[22px] top-12 h-[calc(100%-2.5rem)] w-px"
                />
              ) : null}
              <span
                aria-hidden
                className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-paper bg-ivory text-bronze shadow-paper-1"
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="flex-1 rounded-card bg-cotton p-5 paper-edge">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">
                  {stop.moment}
                </p>
                <h3 className="mt-1 font-display text-xl">{stop.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{stop.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}
