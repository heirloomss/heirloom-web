'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  Mail, 
  HeartHandshake, 
  Clock, 
  Lock, 
  CheckCircle2, 
  Eye,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { WaxSeal } from '@/components/ui/WaxSeal';

type TabKey = 'assets' | 'documents' | 'messages' | 'guardians';

interface TabItem {
  id: TabKey;
  label: string;
  badge: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'assets', label: 'Protected Assets', badge: 'Smart Contract Secured', icon: HeartHandshake },
  { id: 'documents', label: 'Encrypted Vault', badge: 'AES-256 Encrypted', icon: FileText },
  { id: 'messages', label: 'Time-Released Messages', badge: 'Milestone Delivery', icon: Mail },
  { id: 'guardians', label: 'Guardians & Check-In', badge: '2-of-3 Verification', icon: ShieldCheck },
];

export function HeroCardDeck() {
  const [activeTab, setActiveTab] = useState<TabKey>('assets');
  const [isPaused, setIsPaused] = useState(false);
  const [checkInSimulated, setCheckInSimulated] = useState(false);

  // Auto rotate tabs every 5 seconds unless user interacts
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TABS.findIndex((t) => t.id === prev);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex].id;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Bent card-by-card background diorama paper sheets */}
      <div className="absolute -top-6 left-1/2 -z-20 h-[92%] w-[96%] -translate-x-1/2 rounded-[36px] bg-linen/80 rotate-[-1.5deg] shadow-paper-2 border border-bronze/15 transition-transform duration-500" />
      <div className="absolute -top-3 left-1/2 -z-10 h-[96%] w-[98%] -translate-x-1/2 rounded-[30px] bg-cotton rotate-[1.2deg] shadow-paper-3 border border-moss/15 transition-transform duration-500" />

      {/* Tab navigation bar */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 relative z-10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setIsPaused(true);
              }}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 sm:text-sm ${
                isActive
                  ? 'bg-moss text-cotton shadow-paper-3 scale-105 ring-2 ring-gold/40'
                  : 'bg-ivory/95 text-ink-soft hover:bg-cotton hover:text-ink shadow-paper-1 border border-ink/10'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cotton' : 'text-moss'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main 3D Shadowbox Diorama Frame */}
      <div className="paper-diorama-frame relative min-h-[400px] w-full p-6 sm:p-9 z-10">
        {/* Top right corner wax seal stamp */}
        <div className="absolute right-6 top-6 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-bronze">Archival Status</span>
            <span className="text-[10px] text-ink-soft">Encrypted & Sealed</span>
          </div>
          <WaxSeal tone={activeTab === 'messages' ? 'burgundy' : activeTab === 'documents' ? 'gold' : 'moss'} size="md" text="H" />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pt-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-moss-wash px-3 py-1 text-xs font-semibold text-moss border border-moss/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Stellar Smart Contract Vault
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Automated Digital Asset Inheritance
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    Funds are locked in smart contracts and distributed by percentage when triggered.
                  </p>
                </div>
                <div className="rounded-card bg-indigo-wash/30 p-3.5 text-right shadow-paper-2 border border-indigo/20 rotate-[-1deg]">
                  <span className="text-[10px] uppercase font-bold text-indigo tracking-widest">Stellar Vault Balance</span>
                  <div className="font-mono text-2xl font-bold text-indigo">$15,000.00 <span className="text-xs font-sans text-indigo/70">USDC</span></div>
                </div>
              </div>

              {/* Beneficiaries Split Cards with micro-rotations */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="paper-stack-deck rounded-card bg-cotton p-5 shadow-paper-2 border border-moss/20 transition-transform duration-300 sm:rotate-[-1deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <WaxSeal tone="moss" size="sm" text="S" />
                      <div>
                        <h4 className="font-semibold text-ink">Sarah Johnson</h4>
                        <p className="text-xs text-ink-soft">Daughter · Primary Beneficiary</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-moss bg-moss-wash px-3 py-1 rounded-full text-sm border border-moss/20">60%</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs text-ink-soft">
                    <span>Allocated: <strong className="text-ink font-mono">$9,000.00 USDC</strong></span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold"><CheckCircle2 className="h-3.5 w-3.5 text-moss" /> Verified</span>
                  </div>
                </div>

                <div className="paper-stack-deck rounded-card bg-cotton p-5 shadow-paper-2 border border-bronze/20 transition-transform duration-300 sm:rotate-[1deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <WaxSeal tone="bronze" size="sm" text="M" />
                      <div>
                        <h4 className="font-semibold text-ink">Michael Johnson</h4>
                        <p className="text-xs text-ink-soft">Son · Secondary Beneficiary</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-bronze bg-bronze-wash px-3 py-1 rounded-full text-sm border border-bronze/20">40%</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs text-ink-soft">
                    <span>Allocated: <strong className="text-ink font-mono">$6,000.00 USDC</strong></span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold"><CheckCircle2 className="h-3.5 w-3.5 text-moss" /> Verified</span>
                  </div>
                </div>
              </div>

              <div className="rounded-card bg-linen/60 p-3.5 text-xs text-ink-soft flex items-center gap-2.5 border border-ink/10">
                <Lock className="h-4 w-4 text-moss shrink-0" />
                <span>Zero crypto complexity. Beneficiaries receive a simple claim link that deposits funds to their standard bank account.</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pt-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-wash px-3 py-1 text-xs font-semibold text-indigo border border-indigo/20">
                    <KeyRound className="h-3.5 w-3.5" />
                    Client-Side AES-256 Encryption
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Zero-Knowledge Document Vault
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    House deeds, passports, tax filings, and legal wills stored safely offline.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-card bg-cotton px-4 py-2 text-xs font-semibold text-indigo shadow-paper-2 border border-indigo/20 rotate-[1deg]">
                  <Lock className="h-4 w-4 text-indigo" />
                  <span>3 Documents Sealed</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="paper-dogear paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-indigo/20 space-y-2.5 transition-transform duration-300 sm:rotate-[-1.2deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <FileText className="h-6 w-6 text-indigo" />
                    <span className="rounded bg-indigo-wash px-2 py-0.5 text-[10px] font-bold text-indigo uppercase border border-indigo/20">PDF</span>
                  </div>
                  <h4 className="font-semibold text-ink text-sm">Last Will & Testament</h4>
                  <p className="text-xs text-ink-soft">2.4 MB · Encrypted</p>
                  <p className="text-[11px] text-indigo font-semibold pt-1 border-t border-ink/5">Release: Immediately</p>
                </div>

                <div className="paper-dogear paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-indigo/20 space-y-2.5 transition-transform duration-300 sm:rotate-[0.8deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <FileText className="h-6 w-6 text-indigo" />
                    <span className="rounded bg-indigo-wash px-2 py-0.5 text-[10px] font-bold text-indigo uppercase border border-indigo/20">DOCX</span>
                  </div>
                  <h4 className="font-semibold text-ink text-sm">Property Title Deed</h4>
                  <p className="text-xs text-ink-soft">1.8 MB · Encrypted</p>
                  <p className="text-[11px] text-indigo font-semibold pt-1 border-t border-ink/5">Release: Immediately</p>
                </div>

                <div className="paper-dogear paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-indigo/20 space-y-2.5 transition-transform duration-300 sm:rotate-[-0.6deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <KeyRound className="h-6 w-6 text-indigo" />
                    <span className="rounded bg-indigo-wash px-2 py-0.5 text-[10px] font-bold text-indigo uppercase border border-indigo/20">SECURE</span>
                  </div>
                  <h4 className="font-semibold text-ink text-sm">Account Passcode Hints</h4>
                  <p className="text-xs text-ink-soft">Encrypted Note</p>
                  <p className="text-[11px] text-indigo font-semibold pt-1 border-t border-ink/5">Release: 30 Days After</p>
                </div>
              </div>

              <div className="rounded-card bg-linen/60 p-3.5 text-xs text-ink-soft flex items-center justify-between border border-ink/10">
                <span>Files are encrypted on your local browser. Heirloom servers cannot decrypt your documents.</span>
                <span className="font-semibold text-indigo flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> Client Encrypted</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pt-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-burgundy-wash px-3 py-1 text-xs font-semibold text-burgundy border border-burgundy/20">
                    <Clock className="h-3.5 w-3.5" />
                    Scheduled Legacy Delivery
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Time-Released Letters & Videos
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    Leave audio recordings, videos, and letters delivered on specific life milestones.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-card bg-cotton px-4 py-2 text-xs font-semibold text-burgundy shadow-paper-2 border border-burgundy/20 rotate-[-1deg]">
                  <Mail className="h-4 w-4" />
                  <span>2 Personal Messages Scheduled</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="paper-stack-deck rounded-card bg-cotton p-5 shadow-paper-2 border border-burgundy/20 space-y-3 transition-transform duration-300 sm:rotate-[-1deg] hover:rotate-0">
                  <div className="flex items-center gap-3">
                    <WaxSeal tone="burgundy" size="md" text="V" />
                    <div>
                      <h4 className="font-semibold text-ink text-sm">Graduation Video Message</h4>
                      <p className="text-xs text-ink-soft">For Sarah · Video Note (4 mins)</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-burgundy-wash/60 p-2.5 text-xs text-burgundy flex items-center justify-between border border-burgundy/20">
                    <span>Unlocks on: <strong>Sarah&apos;s 18th Birthday</strong></span>
                    <span className="font-bold uppercase tracking-wider text-[10px]">Scheduled</span>
                  </div>
                </div>

                <div className="paper-stack-deck rounded-card bg-cotton p-5 shadow-paper-2 border border-burgundy/20 space-y-3 transition-transform duration-300 sm:rotate-[1deg] hover:rotate-0">
                  <div className="flex items-center gap-3">
                    <WaxSeal tone="burgundy" size="md" text="L" />
                    <div>
                      <h4 className="font-semibold text-ink text-sm">Handwritten Family Letter</h4>
                      <p className="text-xs text-ink-soft">For Everyone · Personal Guidance</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-burgundy-wash/60 p-2.5 text-xs text-burgundy flex items-center justify-between border border-burgundy/20">
                    <span>Unlocks on: <strong>Immediate Release</strong></span>
                    <span className="font-bold uppercase tracking-wider text-[10px]">Ready</span>
                  </div>
                </div>
              </div>

              <div className="rounded-card bg-linen/60 p-3.5 text-xs text-ink-soft flex items-center justify-between border border-ink/10">
                <span>Words of wisdom and love saved for the exact moment your children need them most.</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'guardians' && (
            <motion.div
              key="guardians"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pt-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-moss-wash px-3 py-1 text-xs font-semibold text-moss border border-moss/20">
                    <UserCheck className="h-3.5 w-3.5" />
                    Human Safeguard Protocol
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Trusted Guardians & Life Check-In
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    Nothing is ever released automatically without check-in missed + 2 of 3 guardian confirmations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckInSimulated(true)}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 shadow-paper-2 ${
                    checkInSimulated
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                      : 'bg-moss text-cotton hover:bg-moss-deep'
                  }`}
                >
                  {checkInSimulated ? '✓ Checked In Today!' : "Click to Try 'I'm Here' Check-In"}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-moss/20 space-y-2 transition-transform duration-300 sm:rotate-[-1deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-moss bg-moss-wash px-2 py-0.5 rounded border border-moss/20">Guardian 1</span>
                    <WaxSeal tone="moss" size="sm" text="✓" />
                  </div>
                  <h4 className="font-semibold text-ink text-sm mt-2">David Miller</h4>
                  <p className="text-xs text-ink-soft">Brother · Primary Contact</p>
                  <p className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-ink/5">Status: Confirmed</p>
                </div>

                <div className="paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-moss/20 space-y-2 transition-transform duration-300 sm:rotate-[0.8deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-moss bg-moss-wash px-2 py-0.5 rounded border border-moss/20">Guardian 2</span>
                    <WaxSeal tone="moss" size="sm" text="✓" />
                  </div>
                  <h4 className="font-semibold text-ink text-sm mt-2">Elena Vance, Esq.</h4>
                  <p className="text-xs text-ink-soft">Family Attorney</p>
                  <p className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-ink/5">Status: Confirmed</p>
                </div>

                <div className="paper-stack-deck rounded-card bg-cotton p-4.5 shadow-paper-2 border border-bronze/20 space-y-2 transition-transform duration-300 sm:rotate-[-0.6deg] hover:rotate-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-bronze bg-bronze-wash px-2 py-0.5 rounded border border-bronze/20">Guardian 3</span>
                    <Clock className="h-4 w-4 text-bronze" />
                  </div>
                  <h4 className="font-semibold text-ink text-sm mt-2">Dr. Robert Chen</h4>
                  <p className="text-xs text-ink-soft">Close Friend</p>
                  <p className="text-[11px] text-bronze font-semibold pt-2 border-t border-ink/5">Threshold: 2 of 3 Required</p>
                </div>
              </div>

              <div className="rounded-card bg-linen/60 p-3.5 text-xs text-ink-soft flex items-center justify-between border border-ink/10">
                <span>Life Check-in Frequency: <strong>Every 30 Days</strong> (1 click email check-in). Next check-in in 18 days.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
