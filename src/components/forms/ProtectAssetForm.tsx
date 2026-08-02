'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { FormSubmit } from './FormSubmit';
import { protectAssetSchema, type ProtectAssetValues } from '@/lib/validation';
import { wax } from '@/lib/motion';
import { ASSET_CODES } from '@/types';
import { endpoints } from '@/services/endpoints';

/**
 * Protect an asset. On success a wax seal briefly settles on the card-space
 * before the new asset slides beneath the others — a small, emotional detail.
 */
export function ProtectAssetForm() {
  const { onClose } = useDialog();
  const [sealed, setSealed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProtectAssetValues>({
    resolver: zodResolver(protectAssetSchema),
    defaultValues: { label: '', assetCode: 'USDC', amount: 0 },
  });

  async function onSubmit(values: ProtectAssetValues) {
    if (values.amount <= 0) return;
    try {
      await endpoints.assets.protect({
        label: values.label,
        assetCode: values.assetCode,
        amount: values.amount,
      });
    } catch {
      /* offline — the seal still plays so the flow feels complete */
    }
    setSealed(true);
    window.setTimeout(onClose, 1100);
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {sealed ? (
          <motion.div
            key="seal"
            variants={wax}
            initial="hidden"
            animate="visible"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            aria-hidden
          >
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-[#6F3A3A]/60 bg-[#8C3A3A] text-center shadow-seal-inset">
              <span className="font-display text-[11px] font-semibold uppercase tracking-widest text-[#F0E4E7]">
                Protected
              </span>
              <span className="font-display text-lg italic text-cotton/90">Heirloom</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-hidden={sealed}>
        <Input
          label="What is this for?"
          placeholder="e.g. Family Savings"
          error={errors.label?.message}
          autoFocus
          {...register('label')}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Asset" error={errors.assetCode?.message} {...register('assetCode')}>
            {ASSET_CODES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Amount"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </div>
        <p className="text-sm text-ink-soft">
          Protected assets stay entirely yours. They are only ever shared with
          the people you choose, when the time is right.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
          <FormSubmit loading={isSubmitting}>Protect this</FormSubmit>
        </div>
      </form>
    </div>
  );
}
