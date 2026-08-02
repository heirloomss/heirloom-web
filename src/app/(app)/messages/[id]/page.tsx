'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Camera, Clock, Feather, Mic, Video, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { letterLine } from '@/lib/motion';
import { formatDate } from '@/utils/format';
import { beneficiaryName } from '@/lib/demo-data';
import { useMessage } from '@/hooks';
import type { MessageType } from '@/types';

const ICONS: Record<MessageType, LucideIcon> = {
  Letter: Feather,
  Voice: Mic,
  Video: Video,
  Photo: Camera,
};

/** A message opens like a handwritten letter — its text fades in line by line. */
export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: message } = useMessage(params.id);

  if (!message) return null;

  const Icon = ICONS[message.type];
  const recipient = beneficiaryName(message.recipientId);
  const isLetter = message.type === 'Letter' && Boolean(message.body);
  const lines = message.body ? message.body.split('\n').filter((l) => l.trim() !== '') : [];

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/messages"
        className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All messages
      </Link>

      <article className="mt-6 rounded-card bg-cotton p-8 shadow-paper-2 paper-edge md:p-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">{message.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-burgundy" strokeWidth={1.7} aria-hidden />
                {message.type}
              </span>
              {message.durationLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-ink-faint" aria-hidden />
                  {message.durationLabel}
                </span>
              ) : null}
              <span className="text-ink-faint">{formatDate(message.createdAt)}</span>
            </div>
          </div>
          <Badge tone="neutral">{message.releaseRule}</Badge>
        </div>

        {recipient ? (
          <p className="mb-8 text-sm italic text-ink-soft">
            For <span className="font-medium not-italic text-ink">{recipient}</span>
          </p>
        ) : null}

        {isLetter ? (
          <div className="space-y-5 font-display text-lg leading-relaxed text-ink">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={letterLine}
                initial="hidden"
                animate="visible"
              >
                {line}
              </motion.p>
            ))}
            <div aria-hidden className="paper-divider my-8" />
            <p className="text-base italic text-ink-soft">Written with love, always.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-image border-4 border-linen bg-linen/60 shadow-paper-1">
            <div className="relative aspect-video w-full">
              <Image
                src="/paper-texture.svg"
                alt=""
                fill
                unoptimized
                className="object-cover opacity-70"
                aria-hidden
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <Icon className="h-12 w-12 text-bronze" strokeWidth={1.3} />
              </span>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
