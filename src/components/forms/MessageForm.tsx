'use client';

import { useRef, useState } from 'react';
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
import { createMessage } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

/** Compose a letter, or attach a voice/video/photo for someone you love. */
export function MessageForm({ initial }: { initial?: Partial<MessageValues> }) {
  const { onClose } = useDialog();
  const { data: beneficiaries = [] } = useBeneficiaries();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
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

  const kind = watch('type');
  const needsFile = kind === 'Voice' || kind === 'Video' || kind === 'Photo';

  async function onSubmit(values: MessageValues) {
    setError(null);
    if (needsFile && !file) {
      setError('Please attach the recording or photograph.');
      return;
    }
    try {
      await createMessage({
        title: values.title,
        type: values.type as Message['type'],
        recipientId: values.recipientId || undefined,
        releaseRule: values.releaseRule as Message['releaseRule'],
        body: values.body || undefined,
        file: file ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      await queryClient.invalidateQueries({ queryKey: ['legacy', 'journey'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We couldn’t save that just now.');
    }
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
      {kind === 'Letter' ? (
        <Textarea
          label="Your words"
          rows={7}
          placeholder="Take your time. There is no wrong way to say what matters."
          error={errors.body?.message}
          {...register('body')}
        />
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            accept={kind === 'Photo' ? 'image/*' : kind === 'Voice' ? 'audio/*' : 'video/*'}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            aria-label="Attach a recording or photograph"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center rounded-card border border-dashed border-ink/20 bg-ivory px-6 py-8 text-center transition-colors hover:border-moss/40"
          >
            <span className="text-sm font-medium text-ink">
              {file ? file.name : `Attach a ${kind.toLowerCase()}`}
            </span>
            <span className="mt-1 text-xs text-ink-faint">
              Encrypted the moment it arrives. Up to 50 MB.
            </span>
          </button>
        </div>
      )}
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Keep for later
        </Button>
        <FormSubmit loading={isSubmitting}>Save this memory</FormSubmit>
      </div>
    </form>
  );
}
