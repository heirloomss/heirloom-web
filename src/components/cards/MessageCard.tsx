'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Feather, Mic, Video, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { stack } from '@/lib/motion';
import { formatDate } from '@/utils/format';
import { beneficiaryName } from '@/lib/demo-data';
import type { Message, MessageType } from '@/types';

const ICONS: Record<MessageType, LucideIcon> = {
  Letter: Feather,
  Voice: Mic,
  Video: Video,
  Photo: Camera,
};

/** A message in the Memory Collection — warm, personal, never clinical. */
export function MessageCard({ message }: { message: Message }) {
  const Icon = ICONS[message.type];
  const recipient = beneficiaryName(message.recipientId);
  return (
    <motion.li variants={stack} className="list-none">
      <Link
        href={`/messages/${message.id}`}
        className="block rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-burgundy-wash text-burgundy">
            <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </span>
          <Badge tone="burgundy">{message.releaseRule}</Badge>
        </div>
        <h3 className="mt-4 font-display text-xl leading-tight">{message.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {message.type}
          {recipient ? ` · For ${recipient}` : ''}
          {message.durationLabel ? ` · ${message.durationLabel}` : ''}
        </p>
        <p className="mt-4 text-xs text-ink-faint">Written {formatDate(message.createdAt)}</p>
      </Link>
    </motion.li>
  );
}
