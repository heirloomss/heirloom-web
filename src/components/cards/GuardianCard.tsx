'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { stack } from '@/lib/motion';
import type { Guardian } from '@/types';

/** A trusted guardian — a guardian, never an "executor". */
export function GuardianCard({ guardian }: { guardian: Guardian }) {
  const verified = guardian.status === 'Verified';
  return (
    <motion.li variants={stack} className="list-none">
      <article className="rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar name={guardian.name} />
            <div>
              <p className="font-display text-xl leading-tight">{guardian.name}</p>
              <p className="text-sm text-ink-soft">{guardian.relationship}</p>
            </div>
          </div>
          <Badge tone={verified ? 'success' : 'warning'}>
            {verified ? (
              <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
            ) : (
              <ShieldQuestion className="mr-1 h-3.5 w-3.5" aria-hidden />
            )}
            {guardian.status}
          </Badge>
        </div>
        <p className="mt-4 text-sm text-ink-soft">{guardian.email}</p>
      </article>
    </motion.li>
  );
}
