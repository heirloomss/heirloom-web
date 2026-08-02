'use client';

import { useState } from 'react';
import { HeartHandshake, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { BeneficiaryCard } from '@/components/cards/BeneficiaryCard';
import { BeneficiaryForm } from '@/components/forms/BeneficiaryForm';
import { stagger } from '@/lib/motion';
import { useBeneficiaries } from '@/hooks';

/** The heart of the application — the people who matter most. */
export default function BeneficiariesPage() {
  const [open, setOpen] = useState(false);
  const { data: beneficiaries = [], isLoading } = useBeneficiaries();

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        description="The people and causes you love, gathered in one place. Choose who receives what — gently, clearly."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Add someone
          </Button>
        }
      />

      {!isLoading && beneficiaries.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="Every legacy begins with someone you care about."
          description="Choose the people who matter most. You can add to this at any time — there is no rush to decide everything today."
          actionLabel="Add your first beneficiary"
          onAction={() => setOpen(true)}
        />
      ) : (
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {beneficiaries.map((b) => (
            <BeneficiaryCard key={b.id} beneficiary={b} />
          ))}
        </motion.ul>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add someone to your legacy"
        description="A beneficiary is someone who will receive part of what you have prepared. You can always change this."
      >
        <BeneficiaryForm />
      </Dialog>
    </div>
  );
}
