'use client';

import { motion } from 'framer-motion';
import { FileText, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { stack } from '@/lib/motion';
import { formatDate } from '@/utils/format';
import { archiveDownloadUrl, fetchAuthedBlob } from '@/lib/api';
import type { ArchiveDocument } from '@/types';

/** A filed document in the Digital Archive. */
export function DocumentCard({ document }: { document: ArchiveDocument }) {
  async function download() {
    const blob = await fetchAuthedBlob(archiveDownloadUrl(document.id));
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.title;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.li variants={stack} className="list-none">
      <article className="rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-wash text-indigo">
            <FileText className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </span>
          {document.encrypted ? (
            <Badge tone="indigo">
              <Lock className="mr-1 h-3.5 w-3.5" aria-hidden />
              Encrypted
            </Badge>
          ) : (
            <Badge tone="neutral">Stored</Badge>
          )}
        </div>
        <h3 className="mt-4 font-display text-xl leading-tight">{document.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">{document.category}</p>
        <p className="mt-4 text-xs text-ink-faint">
          {document.sizeLabel} · Filed {formatDate(document.createdAt)}
        </p>
        <button
          type="button"
          onClick={() => void download()}
          className="mt-3 text-sm font-medium text-moss-deep"
        >
          Download
        </button>
      </article>
    </motion.li>
  );
}
