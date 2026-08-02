'use client';

import { motion } from 'framer-motion';
import { stagger } from '@/lib/motion';
import { useActivityTimeline } from '@/hooks';
import { TimelineItem } from './TimelineItem';

/**
 * The Family Timeline — everything done to prepare for the future, connected
 * by a stitched thread like reading a family journal.
 */
export function FamilyTimeline({ limit }: { limit?: number }) {
  const { data } = useActivityTimeline();
  const events = (data ?? []).slice(0, limit);

  if (events.length === 0) {
    return (
      <p className="rounded-card bg-cotton/60 p-8 text-center text-ink-soft paper-edge">
        Your story here will begin gently — every addition, document, and memory
        will appear in order.
      </p>
    );
  }

  return (
    <motion.ol variants={stagger} initial="hidden" animate="visible" className="space-y-5">
      {events.map((event, i) => (
        <TimelineItem key={event.id} event={event} isLast={i === events.length - 1} />
      ))}
    </motion.ol>
  );
}
