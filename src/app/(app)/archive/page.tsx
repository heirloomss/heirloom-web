'use client';

import { useState } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { DocumentCard } from '@/components/cards/DocumentCard';
import { DocumentUploadForm } from '@/components/forms/DocumentUploadForm';
import { stagger } from '@/lib/motion';
import { useDocuments } from '@/hooks';

/** The Digital Archive — every important document, sealed safely. */
export default function ArchivePage() {
  const [open, setOpen] = useState(false);
  const { data: documents = [], isLoading } = useDocuments();

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Deeds, passports, insurance — every important record, encrypted and kept safe until it is needed."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            File a document
          </Button>
        }
      />

      {!isLoading && documents.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Important memories deserve a safe place."
          description="House deeds, insurance, certificates, and more — upload your first document and it will be encrypted before it's stored."
          actionLabel="Upload your first document"
          onAction={() => setOpen(true)}
        />
      ) : (
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </motion.ul>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="File a document"
        description="Everything you add is encrypted before it ever leaves your device. Only the people you choose can ever open it."
      >
        <DocumentUploadForm />
      </Dialog>
    </div>
  );
}
