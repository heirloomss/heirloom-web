'use client';

import { useState } from 'react';
import { Feather, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { MessageCard } from '@/components/cards/MessageCard';
import { MessageForm } from '@/components/forms/MessageForm';
import { stagger } from '@/lib/motion';
import { useBeneficiaries, useMessages } from '@/hooks';

/** The Memory Collection — letters, voice notes, videos, and photographs. */
export default function MessagesPage() {
  const [open, setOpen] = useState(false);
  const { data: messages = [], isLoading } = useMessages();
  useBeneficiaries(); // warm the cache so cards can show recipients

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Letters, voice notes, videos, and photos — words of love and guidance, kept for exactly the right moment."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Add a message
          </Button>
        }
      />

      {!isLoading && messages.length === 0 ? (
        <EmptyState
          icon={Feather}
          title="Words can become lasting gifts."
          description="A letter to your daughter. A voice note for your partner. A photograph with the story behind it. Whatever you wish them to always have."
          actionLabel="Write your first message"
          onAction={() => setOpen(true)}
        />
      ) : (
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </motion.ul>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="A memory to keep" size="lg">
        <MessageForm />
      </Dialog>
    </div>
  );
}
