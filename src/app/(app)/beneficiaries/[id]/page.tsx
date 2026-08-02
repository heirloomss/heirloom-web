'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, BadgeCheck, Mail, Phone, Pencil } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { BeneficiaryForm } from '@/components/forms/BeneficiaryForm';
import { maskAccount } from '@/utils/format';
import { useBeneficiary } from '@/hooks';

/** A single beneficiary — their share, their details, and what awaits them. */
export default function BeneficiaryDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: beneficiary } = useBeneficiary(params.id);
  const [editing, setEditing] = useState(false);

  if (!beneficiary) return null;

  return (
    <div>
      <Link
        href="/beneficiaries"
        className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All beneficiaries
      </Link>

      <div className="mt-6 max-w-2xl rounded-card bg-cotton p-8 shadow-paper-2 paper-edge">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={beneficiary.name} size="lg" />
            <div>
              <h1 className="font-display text-3xl">{beneficiary.name}</h1>
              <p className="text-ink-soft">{beneficiary.relationship}</p>
            </div>
          </div>
          <p className="font-display text-4xl text-moss-deep">
            {beneficiary.allocationPercentage}%
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {beneficiary.verified ? (
            <Badge tone="success">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
              Verified
            </Badge>
          ) : (
            <Badge tone="warning">Pending</Badge>
          )}
          {beneficiary.walletAddress ? (
            <Badge tone="moss">Account Connected</Badge>
          ) : (
            <Badge tone="neutral">Email Only</Badge>
          )}
        </div>

        <div className="mt-8 space-y-4 border-t border-ink/[0.08] pt-7">
          <div className="flex items-center gap-3 text-ink-soft">
            <Mail className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
            <span>{beneficiary.email}</span>
          </div>
          {beneficiary.phone ? (
            <div className="flex items-center gap-3 text-ink-soft">
              <Phone className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
              <span>{beneficiary.phone}</span>
            </div>
          ) : null}
          {beneficiary.walletAddress ? (
            <div className="text-ink-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
                Connected Account
              </p>
              <p className="mono mt-1 text-sm text-ink">{maskAccount(beneficiary.walletAddress)}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-card bg-linen/50 p-5 text-sm text-ink-soft">
          When the time comes, {beneficiary.name.split(' ')[0]} will receive a
          gentle, guided package — never a confusing list of files.
        </div>

        <div className="mt-7 flex justify-end">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" aria-hidden />
            Edit
          </Button>
        </div>
      </div>

      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title={`Edit ${beneficiary.name}`}
        description="Adjust their details or share of your legacy at any time."
      >
        <BeneficiaryForm
          beneficiaryId={beneficiary.id}
          initial={{
            name: beneficiary.name,
            relationship: beneficiary.relationship,
            email: beneficiary.email,
            phone: beneficiary.phone ?? '',
            walletAddress: beneficiary.walletAddress ?? '',
            allocationPercentage: beneficiary.allocationPercentage,
          }}
        />
      </Dialog>
    </div>
  );
}
