'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { stack } from '@/lib/motion';
import { formatAsset, formatUsd } from '@/utils/format';
import { beneficiaryName } from '@/lib/demo-data';
import type { Asset } from '@/types';

/** A protected asset — calm, sealed, and clearly destined for someone. */
export function AssetCard({ asset }: { asset: Asset }) {
  const recipient = beneficiaryName(asset.recipientId);
  return (
    <motion.li variants={stack} className="list-none">
      <article className="relative rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl leading-tight">{asset.label}</p>
            <p className="mono mt-1 text-sm text-ink-soft">
              {formatAsset(asset.amount, asset.assetCode)}
            </p>
          </div>
          <Badge tone={asset.status === 'Protected' ? 'moss' : 'indigo'}>
            <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
            {asset.status}
          </Badge>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <p className="text-sm text-ink-soft">
            {recipient ? (
              <>
                For <span className="font-medium text-ink">{recipient}</span>
              </>
            ) : (
              'Shared among everyone'
            )}
          </p>
          <p className="font-display text-lg text-ink">{formatUsd(asset.usdValue)}</p>
        </div>
      </article>
    </motion.li>
  );
}
