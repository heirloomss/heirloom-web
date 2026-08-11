'use client';

import { useState } from 'react';
import { Plus, Vault } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { AssetCard } from '@/components/cards/AssetCard';
import { ProtectAssetForm } from '@/components/forms/ProtectAssetForm';
import { LegacyProtectionPanel } from '@/components/legacy/LegacyProtectionPanel';
import { stagger } from '@/lib/motion';
import { formatUsd } from '@/utils/format';
import { useAssets } from '@/hooks';

/** Protected Assets — calm amounts, never a trading screen. */
export default function AssetsPage() {
  const [open, setOpen] = useState(false);
  const { data: assets = [], isLoading } = useAssets();
  const totalUsd = assets.reduce((sum, a) => sum + a.usdValue, 0);

  return (
    <div>
      <PageHeader
        title="Protected Assets"
        description="What you set aside stays entirely yours — shared only with the people you choose, when the time is right."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Protect an asset
          </Button>
        }
      />

      {!isLoading && assets.length === 0 ? (
        <EmptyState
          icon={Vault}
          title="Whatever you set aside is protected with care."
          description="Savings, tokens, and other Stellar assets — safely held and gently passed on exactly as you wish."
          actionLabel="Protect your first asset"
          onAction={() => setOpen(true)}
        />
      ) : (
        <>
          <div className="mb-8 rounded-card bg-linen/50 p-6 text-center paper-edge">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-faint">Total protected</p>
            <p className="mono mt-2 text-4xl font-medium tabular-nums">{formatUsd(totalUsd)}</p>
          </div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </motion.ul>

          <div className="mt-10">
            <LegacyProtectionPanel />
          </div>
        </>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Protect an asset"
        description="Set something aside for the people you love. You stay in complete control."
      >
        <ProtectAssetForm />
      </Dialog>
    </div>
  );
}
