'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Feather, FileText, HeartHandshake, Vault, type LucideIcon } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';
import { formatUsd } from '@/utils/format';
import { useDashboardStats } from '@/hooks';

interface Stat {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  tone: string;
}

/** The four calm dashboard figures — numbers, never charts. */
export function StatCards() {
  const { data: stats } = useDashboardStats();

  const items: Stat[] = [
    {
      label: 'Protected Assets',
      value: formatUsd(stats?.assetsUsd ?? 0),
      href: '/assets',
      icon: Vault,
      tone: 'bg-indigo-wash text-indigo',
    },
    {
      label: 'Beneficiaries',
      value: String(stats?.beneficiaries ?? 0),
      href: '/beneficiaries',
      icon: HeartHandshake,
      tone: 'bg-burgundy-wash text-burgundy',
    },
    {
      label: 'Messages',
      value: String(stats?.messages ?? 0),
      href: '/messages',
      icon: Feather,
      tone: 'bg-bronze-wash text-bronze',
    },
    {
      label: 'Documents',
      value: String(stats?.documents ?? 0),
      href: '/archive',
      icon: FileText,
      tone: 'bg-moss-wash text-moss',
    },
  ];

  return (
    <motion.ul
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <motion.li key={item.label} variants={fadeUp}>
          <Link
            href={item.href}
            className="block rounded-card bg-cotton p-6 paper-edge transition-shadow duration-500 hover:shadow-paper-2"
            aria-label={`${item.label}: ${item.value}`}
          >
            <span
              aria-hidden
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mono mt-5 text-3xl font-medium tabular-nums text-ink">{item.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{item.label}</p>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
