'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { FormSubmit } from './FormSubmit';
import { guardianInviteSchema, type GuardianInviteValues } from '@/lib/validation';
import { RELATIONSHIPS, type Guardian } from '@/types';
import { endpoints } from '@/services/endpoints';

/** Invite a trusted guardian — someone who confirms your family when needed. */
export function GuardianForm() {
  const { onClose } = useDialog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuardianInviteValues>({
    resolver: zodResolver(guardianInviteSchema),
    defaultValues: { name: '', relationship: 'Friend', email: '' },
  });

  async function onSubmit(values: GuardianInviteValues) {
    try {
      await endpoints.guardians.invite({
        name: values.name,
        email: values.email,
        relationship: values.relationship as Guardian['relationship'],
      });
    } catch {
      /* gentle offline no-op */
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input label="Full name" error={errors.name?.message} autoFocus {...register('name')} />
      <Select label="Relationship" error={errors.relationship?.message} {...register('relationship')}>
        {RELATIONSHIPS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <p className="text-sm text-ink-soft">
        We’ll send a warm invitation. They only confirm that everything is as it
        should be — they can never see or move your assets.
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Not now
        </Button>
        <FormSubmit loading={isSubmitting}>Send invitation</FormSubmit>
      </div>
    </form>
  );
}
