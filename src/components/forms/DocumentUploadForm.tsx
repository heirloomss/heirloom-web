'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { FormSubmit } from './FormSubmit';
import { documentUploadSchema, type DocumentUploadValues } from '@/lib/validation';
import { DOCUMENT_CATEGORIES } from '@/types';
import { useUploadDocument } from '@/hooks';

/**
 * Upload a document to the Digital Archive. The chosen file slides gently
 * into an archival folder — no plain progress bar.
 *
 * The file is sent to the API over HTTPS and encrypted there with
 * AES-256-GCM before it is ever written to storage; only ciphertext is
 * persisted. Saving surfaces real errors and refreshes the archive — nothing
 * is silently discarded.
 */
export function DocumentUploadForm() {
  const { onClose } = useDialog();
  const [file, setFile] = useState<File | null>(null);
  const [settled, setSettled] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadDoc = useUploadDocument();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: { title: '', category: 'Other' },
  });

  async function onSubmit(values: DocumentUploadValues) {
    if (!file) return;
    await uploadDoc.mutateAsync({ title: values.title, category: values.category, file });
    setSettled(true);
    window.setTimeout(onClose, 1000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        aria-label="Choose a document"
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative flex w-full flex-col items-center rounded-card border border-dashed border-ink/20 bg-ivory px-6 py-9 text-center transition-colors hover:border-moss/40 hover:bg-moss-wash/30"
      >
        <AnimatePresence mode="wait">
          {settled ? (
            <motion.span
              key="settled"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 26 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex flex-col items-center"
              aria-hidden
            >
              <span className="flex h-14 w-10 items-center justify-center rounded-md bg-indigo-wash text-indigo shadow-paper-1">
                <UploadCloud className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-medium text-moss-deep">Filed safely</span>
            </motion.span>
          ) : (
            <motion.span key="empty" exit={{ opacity: 0 }} className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linen text-ink-soft">
                <UploadCloud className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <span className="mt-3 text-sm font-medium text-ink">
                {file ? file.name : 'Choose a document to file away'}
              </span>
              <span className="mt-1 text-xs text-ink-faint">
                It’s encrypted with AES-256 the moment it arrives, and stored that way.
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <Input
        label="What is it?"
        placeholder="e.g. Family House Deed"
        error={errors.title?.message}
        {...register('title')}
      />
      <Select label="Category" error={errors.category?.message} {...register('category')}>
        {DOCUMENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      {uploadDoc.isError ? (
        <p role="alert" className="text-sm text-error">
          {uploadDoc.error instanceof Error
            ? uploadDoc.error.message
            : 'We couldn’t file this just now. Please try again in a moment.'}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Not now
        </Button>
        <FormSubmit loading={isSubmitting || uploadDoc.isPending} disabled={!file || isSubmitting || uploadDoc.isPending}>
          File it safely
        </FormSubmit>
      </div>
    </form>
  );
}
