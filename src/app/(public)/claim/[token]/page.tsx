'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCapsule } from '@/hooks';
import { formatUsd } from '@/utils/format';
import { stamp, unfold } from '@/lib/motion';

/**
 * The Legacy Capsule — a beneficiary's guided, respectful reveal.
 * No blockchain jargon, no transaction hashes. Just warmth and clarity.
 */
export default function ClaimCapsulePage() {
  const params = useParams<{ token: string }>();
  const { data: capsule } = useCapsule(params.token ?? 'demo');
  const [opened, setOpened] = useState<string | null>(null);

  if (!capsule) return null;

  return (
    <div className="mx-auto max-w-reading px-6 py-20 text-center">
      <motion.div
        variants={unfold}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-sm rounded-card bg-linen/70 p-10 paper-edge"
      >
        <HeartHandshake className="mx-auto h-8 w-8 text-bronze" strokeWidth={1.5} aria-hidden />
        <p className="mt-6 font-display text-4xl leading-tight">
          A gift has been prepared for you.
        </p>
        <p className="mt-3 text-sm italic text-ink-soft">From {capsule.fromName}, with love.</p>
        <p className="mt-6 text-ink-soft">{capsule.message}</p>
      </motion.div>

      <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
        {[
          { key: 'assets' as const, count: capsule.assets.length, label: 'Protected Assets' },
          { key: 'documents' as const, count: capsule.documents.length, label: 'Documents' },
          { key: 'messages' as const, count: capsule.messages.length, label: 'Messages' },
        ].map((section) => (
          <Card
            key={section.key}
            className="cursor-pointer transition-shadow duration-500 hover:shadow-paper-2"
          >
            <button
              type="button"
              onClick={() => setOpened(opened === section.key ? null : section.key)}
              className="w-full text-left"
            >
              <p className="font-display text-4xl">{section.count}</p>
              <p className="mt-1 text-sm text-ink-soft">{section.label}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-moss-deep">
                {opened === section.key ? 'Opened' : 'Open'}
                <ArrowRight className="h-3 w-3" aria-hidden />
              </p>
            </button>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {opened === 'assets' && capsule.assets.length > 0 ? (
          <Reveal key="assets">
            {capsule.assets.map((a) => (
              <div key={a.id} className="rounded-card bg-cotton p-5 text-left paper-edge">
                <p className="font-display text-xl">{a.label}</p>
                <p className="mono mt-1 text-sm text-ink-soft">
                  {a.amount} {a.assetCode} · {formatUsd(a.usdValue)}
                </p>
              </div>
            ))}
          </Reveal>
        ) : null}
        {opened === 'documents' && capsule.documents.length > 0 ? (
          <Reveal key="documents">
            {capsule.documents.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-card bg-cotton p-5 text-left paper-edge"
              >
                <p className="font-display text-lg">{d.title}</p>
                <span className="text-xs uppercase tracking-widest text-ink-faint">
                  {d.category}
                </span>
              </div>
            ))}
          </Reveal>
        ) : null}
        {opened === 'messages' && capsule.messages.length > 0 ? (
          <Reveal key="messages">
            {capsule.messages.map((m) => (
              <div key={m.id} className="rounded-card bg-linen/50 p-5 text-left paper-edge">
                <p className="font-display text-lg italic">{m.title}</p>
                {m.body ? (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
                ) : null}
                {m.durationLabel ? (
                  <p className="mt-1 text-xs text-ink-faint">{m.type} · {m.durationLabel}</p>
                ) : null}
              </div>
            ))}
          </Reveal>
        ) : null}
      </AnimatePresence>

      <motion.div
        variants={stamp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="mt-14"
      >
        <Button size="lg">
          <Lock className="h-4 w-4" aria-hidden />
          Open my legacy
        </Button>
        <p className="mt-4 text-xs text-ink-faint">
          Everything here was lovingly prepared for you, exactly as intended.
        </p>
      </motion.div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-6 space-y-4"
    >
      {children}
    </motion.div>
  );
}
