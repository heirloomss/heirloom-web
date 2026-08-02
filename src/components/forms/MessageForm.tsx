'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { FormSubmit } from './FormSubmit';
import { messageSchema, type MessageValues } from '@/lib/validation';
import { MESSAGE_TYPES, RELEASE_RULES, type Message } from '@/types';
import { useBeneficiaries } from '@/hooks';
import { endpoints } from '@/services/endpoints';

/** Compose a letter, or schedule a voice/video/photo for someone you love. */
export function MessageForm({ initial }: { initial?: Partial<MessageValues> }) {
  const { onClose } = useDialog();
  const { data: beneficiaries = [] } = useBeneficiaries();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MessageValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: initial?.title ?? '',
      type: (initial?.type as MessageValues['type']) ?? 'Letter',
      recipientId: initial?.recipientId ?? '',
      releaseRule: (initial?.releaseRule as MessageValues['releaseRule']) ?? 'Immediately',
      body: initial?.body ?? '',
    },
  });

  async function onSubmit(values: MessageValues) {
    const payload: Partial<Message> = {
      title: values.title,
      type: values.type as Message['type'],
      recipientId: values.recipientId || null,
      releaseRule: values.releaseRule as Message['releaseRule'],
      body: values.body || undefined,
    };
    try {
      await endpoints.messages.create(payload);
    } catch {
      /* offline — demo data keeps the moment */
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input
        label="Title"
        placeholder="To my daughter…"
        error={errors.title?.message}
        autoFocus
        {...register('title')}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Kind of memory" error={errors.type?.message} {...register('type')}>
          {MESSAGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select label="For" error={errors.recipientId?.message} {...register('recipientId')}>
          <option value="">Anyone I love</option>
          {beneficiaries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>
      <Select
        label="When should they receive this?"
        error={errors.releaseRule?.message}
        {...register('releaseRule')}
      >
        {RELEASE_RULES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>
      <Textarea
        label="Your words"
        rows={7}
        placeholder="Take your time. There is no wrong way to say what matters."
        error={errors.body?.message}
        {...register('body')}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Keep for later
        </Button>
        <FormSubmit loading={isSubmitting}>Save this memory</FormSubmit>
      </div>
    </form>
  );
}
