'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { stack } from '@/lib/motion';
import type { Beneficiary } from '@/types';

/**
 * A beneficiary as a layered invitation card — paper edge visible, sliding
 * beneath the previous one as it enters, like something filed with love.
 */
export function BeneficiaryCard({ beneficiary }: { beneficiary: Beneficiary }) {
  return (
    <motion.li variants={stack} className="list-none">
      <Link
        href={`/beneficiaries/${beneficiary.id}`}
        className="group relative block rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2"
        aria-label={`${beneficiary.name}, ${beneficiary.relationship}, ${beneficiary.allocationPercentage} percent`}
      >
        {/* visible paper edge beneath */}
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-1.5 h-3 rounded-b-card border border-t-0 border-ink/[0.06] bg-linen/70 -z-0"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar name={beneficiary.name} />
            <div>
              <p className="font-display text-xl leading-tight">{beneficiary.name}</p>
              <p className="text-sm text-ink-soft">{beneficiary.relationship}</p>
            </div>
          </div>
          <p className="font-display text-2xl text-moss-deep">{beneficiary.allocationPercentage}%</p>
        </div>
        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          {beneficiary.walletAddress ? (
            <Badge tone="moss">Account Connected</Badge>
          ) : (
            <Badge tone="neutral">Email Only</Badge>
          )}
          {beneficiary.verified ? (
            <Badge tone="success">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
              Verified
            </Badge>
          ) : (
            <Badge tone="warning">Pending</Badge>
          )}
        </div>
      </Link>
    </motion.li>
  );
}
