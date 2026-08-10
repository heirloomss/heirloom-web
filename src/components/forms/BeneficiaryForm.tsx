'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { FormSubmit } from './FormSubmit';
import { beneficiarySchema, type BeneficiaryValues } from '@/lib/validation';
import { RELATIONSHIPS, type Beneficiary } from '@/types';
import { useBeneficiaries, useSaveBeneficiary } from '@/hooks';

/**
 * Add / edit a beneficiary. Validation is gentle; the allocation is kept
 * within the remaining share so totals never exceed 100%. Saving surfaces real
 * errors and refreshes the list — nothing is silently discarded.
 */
export function BeneficiaryForm({
  initial,
  beneficiaryId,
}: {
  initial?: Partial<BeneficiaryValues>;
  beneficiaryId?: string;
}) {
  const { onClose } = useDialog();
  const { data: all = [] } = useBeneficiaries();
  const saveBeneficiary = useSaveBeneficiary(beneficiaryId);

  const othersTotal = all
    .filter((b) => b.id !== beneficiaryId)
    .reduce((sum, b) => sum + b.allocationPercentage, 0);
  const remaining = Math.max(0, 100 - othersTotal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<BeneficiaryValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: initial?.name ?? '',
      relationship: (initial?.relationship as BeneficiaryValues['relationship']) ?? 'Daughter',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      walletAddress: initial?.walletAddress ?? '',
      allocationPercentage: initial?.allocationPercentage ?? 0,
    },
  });

  async function onSubmit(values: BeneficiaryValues) {
    if (values.allocationPercentage > remaining) {
      setError('allocationPercentage', {
        type: 'validate',
        message: `Only ${remaining}% of your legacy is still unallocated. Adjust this share to fit within it.`,
      });
      return;
    }
    const payload: Partial<Beneficiary> = {
      name: values.name,
      relationship: values.relationship as Beneficiary['relationship'],
      email: values.email,
      phone: values.phone || undefined,
      walletAddress: values.walletAddress || null,
      allocationPercentage: values.allocationPercentage,
    };
    await saveBeneficiary.mutateAsync(payload);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input label="Full name" error={errors.name?.message} autoFocus {...register('name')} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Relationship" error={errors.relationship?.message} {...register('relationship')}>
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <Input
          label="Share of your legacy"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          hint={`${remaining}% remains unallocated.`}
          error={errors.allocationPercentage?.message}
          {...register('allocationPercentage')}
        />
      </div>
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Phone" optional error={errors.phone?.message} {...register('phone')} />
      <Input
        label="Stellar account"
        optional
        placeholder="G…"
        hint="Optional now — but their legacy can only be released to a connected account, so they’ll need one before claiming."
        error={errors.walletAddress?.message}
        className="mono"
        {...register('walletAddress')}
      />
      {saveBeneficiary.isError ? (
        <p role="alert" className="text-sm text-error">
          {saveBeneficiary.error instanceof Error
            ? saveBeneficiary.error.message
            : 'We couldn’t save this just now. Please try again in a moment.'}
        </p>
      ) : null}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Not now
        </Button>
        <FormSubmit loading={isSubmitting || saveBeneficiary.isPending}>
          {beneficiaryId ? 'Save changes' : 'Add to my legacy'}
        </FormSubmit>
      </div>
    </form>
  );
}
