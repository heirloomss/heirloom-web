'use client';

import { useState } from 'react';
import { Shield, UserPlus } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { GuardianCard } from '@/components/cards/GuardianCard';
import { GuardianThresholdControl } from '@/components/guardians/GuardianThresholdControl';
import { GuardianForm } from '@/components/forms/GuardianForm';
import { motion } from 'framer-motion';
import { stagger } from '@/lib/motion';
import { useGuardians } from '@/hooks';

/** Trusted Guardians — a small circle of people who confirm, never control. */
export default function GuardiansPage() {
  const [open, setOpen] = useState(false);
  const { data: guardians = [], isLoading } = useGuardians();

  return (
    <div>
      <PageHeader
        title="Guardians"
        description="People you trust completely. They simply confirm everything is as it should be — they can never see or move your assets."
        action={
          <Button onClick={() => setOpen(true)}>
            <UserPlus className="h-4 w-4" aria-hidden />
            Invite a guardian
          </Button>
        }
      />

      {!isLoading && guardians.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Choose the people you'll always trust."
          description="A brother, a lawyer, a lifelong friend. Your guardians confirm before anything is ever shared — a careful safeguard for your family."
          actionLabel="Invite your first guardian"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {guardians.map((g) => (
              <GuardianCard key={g.id} guardian={g} />
            ))}
          </motion.ul>
          <GuardianThresholdControl />
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a guardian"
        description="They'll receive a kind invitation to stand watch with you."
      >
        <GuardianForm />
      </Dialog>
    </div>
  );
}
