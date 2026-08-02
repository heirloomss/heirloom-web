'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Feather,
  FileText,
  HeartHandshake,
  Shield,
  Sparkles,
  Vault,
  type LucideIcon,
} from 'lucide-react';
import { fadeUp } from '@/lib/motion';
import { formatDate } from '@/utils/format';
import type { ActivityEvent, ActivityKind } from '@/types';

const ICONS: Record<ActivityKind, LucideIcon> = {
  beneficiary_added: HeartHandshake,
  document_uploaded: FileText,
  asset_protected: Vault,
  message_recorded: Feather,
  guardian_accepted: Shield,
  legacy_updated: Sparkles,
  check_in: CheckCircle2,
};

const ACCENT: Partial<Record<ActivityKind, string>> = {
  beneficiary_added: 'bg-burgundy-wash text-burgundy',
  message_recorded: 'bg-burgundy-wash text-burgundy',
  document_uploaded: 'bg-indigo-wash text-indigo',
  asset_protected: 'bg-moss-wash text-moss',
  guardian_accepted: 'bg-moss-wash text-moss',
  check_in: 'bg-bronze-wash text-bronze',
  legacy_updated: 'bg-bronze-wash text-bronze',
};

/** One paper strip on the Family Timeline, stitched to the next. */
export function TimelineItem({ event, isLast }: { event: ActivityEvent; isLast?: boolean }) {
  const Icon = ICONS[event.kind] ?? Sparkles;
  const accent = ACCENT[event.kind] ?? 'bg-linen text-ink-soft';
  return (
    <motion.li variants={fadeUp} className="relative flex gap-5">
      {/* stitched thread seam */}
      {!isLast ? (
        <span
          aria-hidden
          className="thread-stitch absolute left-[22px] top-12 h-[calc(100%-2.5rem)] w-px"
        />
      ) : null}
      <span
        aria-hidden
        className={`z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-paper shadow-paper-1 ${accent}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div className="flex-1 rounded-card bg-cotton p-5 paper-edge">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl">{event.title}</h3>
          <time dateTime={event.createdAt} className="text-xs text-ink-faint">
            {formatDate(event.createdAt)}
          </time>
        </div>
        {event.detail ? <p className="mt-1 text-sm text-ink-soft">{event.detail}</p> : null}
      </div>
    </motion.li>
  );
}
