'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/services/endpoints';
import { uploadDocument } from '@/lib/api';
import { isDemoMode } from '@/lib/demo';
import {
  demoActivity,
  demoAssets,
  demoBeneficiaries,
  demoCheckIn,
  demoDocuments,
  demoGuardianSettings,
  demoGuardians,
  demoJourney,
  demoMessages,
  demoStats,
  demoUser,
} from '@/lib/demo-data';
import type {
  Beneficiary,
  CheckInState,
  DashboardStats,
  Guardian,
  GuardianSettings,
  LegacyCapsule,
  LegacyOverview,
  User,
} from '@/types';
import { useUpdateProfile } from './use-update-profile';
import { useSignAndSubmit, signStepLabel } from './use-sign-and-submit';

export { useUpdateProfile, useSignAndSubmit, signStepLabel };
export type { SignStep } from './use-sign-and-submit';

const demoCapsule: LegacyCapsule = {
  token: 'demo',
  fromName: 'CJ Morgan',
  toName: 'Sarah',
  message:
    'A gift has been prepared for you with great care. Take your time. There is no rush to open everything at once.',
  assets: [
    { id: 'ast_savings', label: 'Family Savings', assetCode: 'USDC', amount: 8000, usdValue: 8000 },
  ],
  documents: [
    { id: 'doc_deed', title: 'Family House Deed', category: 'House Deed' },
    { id: 'doc_birth', title: 'Your Birth Certificate', category: 'Birth Certificate' },
  ],
  messages: [
    {
      id: 'msg_sarah_letter',
      type: 'Letter',
      title: 'To my daughter, Sarah',
      body: 'My dearest Sarah,\n\nIf you are reading this, know that every ordinary morning with you was the great fortune of my life.\n\nBe gentle with yourself. I am so proud of you. I always was.\n\nAll my love,\nDad',
    },
  ],
};

/**
 * Data hooks.
 *
 * Two modes, chosen by `NEXT_PUBLIC_DEMO_MODE` (see `@/lib/demo`):
 *
 *  • DEMO ON  — every query falls back to warm sample data so the complete UX
 *    is explorable with no backend running. This is an explicit reviewer
 *    convenience, never the production default.
 *
 *  • DEMO OFF (production) — NO fabricated data is ever shown. Queries fall
 *    back to genuinely empty values (`[]` for lists, neutral zeroed objects
 *    for singletons). A brand-new account correctly sees empty states, and a
 *    transient API error degrades to empty rather than to fiction.
 *
 * `pick(demo, empty)` selects the right fallback for the current mode, and the
 * SAME value feeds both `placeholderData` (pending state) and `withFallback`
 * (error state) so the two can never disagree.
 *
 * `withFallback` guarantees the fallback even when the API *errors* (e.g.
 * connection refused): `placeholderData` alone only covers the pending state,
 * so on a refused request the data would otherwise collapse to undefined.
 * Wrapping the queryFn means it never rejects — it resolves to the fallback
 * instead, and the page stays whole.
 */
function pick<T>(demo: T, empty: T): T {
  return isDemoMode() ? demo : empty;
}

function withFallback<T>(fn: () => Promise<T>, fallback: T): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch {
      return fallback;
    }
  };
}

// Neutral, non-fabricated singletons used when demo mode is off.
const emptyUser: User = {
  id: '',
  name: '',
  firstName: '',
  email: '',
  walletAddress: null,
  checkInIntervalDays: 90,
  createdAt: '',
  updatedAt: '',
};

const emptyCheckIn: CheckInState = {
  intervalDays: 90,
  daysRemaining: 90,
  lastCheckIn: '',
};

const emptyGuardianSettings: GuardianSettings = {
  requiredApprovals: 0,
  guardianCount: 0,
};

function emptyCapsule(token: string): LegacyCapsule {
  return { token, fromName: '', toName: '', message: '', assets: [], documents: [], messages: [] };
}

export function useUser() {
  const fallback = pick(demoUser, emptyUser);
  return useQuery({
    queryKey: ['me'],
    queryFn: withFallback(endpoints.me, fallback),
    placeholderData: fallback,
  });
}

export function useDashboardStats() {
  const demoSummary = {
    assets: demoStats.assetsUsd,
    assetsUsd: demoStats.assetsUsd,
    beneficiaries: demoStats.beneficiaries,
    messages: demoStats.messages,
    documents: demoStats.documents,
    guardians: demoGuardians.length,
  };
  const emptySummary = {
    assets: 0,
    assetsUsd: 0,
    beneficiaries: 0,
    messages: 0,
    documents: 0,
    guardians: 0,
  };
  const fallback = pick(demoSummary, emptySummary);
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: withFallback(endpoints.dashboardSummary, fallback),
    placeholderData: fallback,
    select: (d): DashboardStats => ({
      assetsUsd: d.assetsUsd,
      beneficiaries: d.beneficiaries,
      messages: d.messages,
      documents: d.documents,
    }),
  });
}

export function useBeneficiaries() {
  const fallback = pick(demoBeneficiaries, []);
  return useQuery({
    queryKey: ['beneficiaries'],
    queryFn: withFallback(endpoints.beneficiaries.list, fallback),
    placeholderData: fallback,
  });
}

export function useBeneficiary(id: string) {
  const fallback = isDemoMode()
    ? (demoBeneficiaries.find((b) => b.id === id) ?? demoBeneficiaries[0])
    : undefined;
  return useQuery({
    queryKey: ['beneficiaries', id],
    queryFn: withFallback(() => endpoints.beneficiaries.get(id), fallback),
    placeholderData: fallback,
  });
}

export function useGuardians() {
  const fallback = pick(demoGuardians, []);
  return useQuery({
    queryKey: ['guardians'],
    queryFn: withFallback(endpoints.guardians.list, fallback),
    placeholderData: fallback,
  });
}

export function useGuardianSettings() {
  // There is no dedicated settings endpoint; derive the approval threshold from
  // the guardians list. In demo mode we surface the warm demo configuration; in
  // production we default to the same rule the API uses (min(2, count)) rather
  // than any fabricated value.
  const fallback = pick(demoGuardianSettings, emptyGuardianSettings);
  return useQuery({
    queryKey: ['guardians', 'settings'],
    queryFn: withFallback(async () => {
      const list = await endpoints.guardians.list();
      const requiredApprovals = isDemoMode()
        ? demoGuardianSettings.requiredApprovals
        : Math.min(2, list.length);
      return { guardianCount: list.length, requiredApprovals };
    }, fallback),
    placeholderData: fallback,
  });
}

export function useAssets() {
  const fallback = pick(demoAssets, []);
  return useQuery({
    queryKey: ['assets'],
    queryFn: withFallback(endpoints.assets.list, fallback),
    placeholderData: fallback,
  });
}

export function useDocuments() {
  const fallback = pick(demoDocuments, []);
  return useQuery({
    queryKey: ['archive'],
    queryFn: withFallback(endpoints.documents.list, fallback),
    placeholderData: fallback,
  });
}

export function useMessages() {
  const fallback = pick(demoMessages, []);
  return useQuery({
    queryKey: ['messages'],
    queryFn: withFallback(endpoints.messages.list, fallback),
    placeholderData: fallback,
  });
}

export function useMessage(id: string) {
  const fallback = isDemoMode()
    ? (demoMessages.find((m) => m.id === id) ?? demoMessages[0])
    : undefined;
  return useQuery({
    queryKey: ['messages', id],
    queryFn: withFallback(() => endpoints.messages.get(id), fallback),
    placeholderData: fallback,
  });
}

export function useActivityTimeline() {
  const fallback = pick(demoActivity, []);
  return useQuery({
    queryKey: ['activity', 'timeline'],
    queryFn: withFallback(endpoints.activity.timeline, fallback),
    placeholderData: fallback,
  });
}

export function useLegacyJourney() {
  const fallback = pick(demoJourney, []);
  return useQuery({
    queryKey: ['legacy', 'journey'],
    queryFn: withFallback(endpoints.legacy.journey, fallback),
    placeholderData: fallback,
  });
}

export function useCheckIn() {
  const fallback = pick(demoCheckIn, emptyCheckIn);
  return useQuery({
    queryKey: ['check-in'],
    queryFn: withFallback(endpoints.checkIn.state, fallback),
    placeholderData: fallback,
  });
}

/** Optimistic life check-in: confirms instantly and settles with the API. */
export function useConfirmCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: endpoints.checkIn.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-in'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity', 'timeline'] });
    },
    onError: () => {
      // The UI stays confirmed — check-ins fail gently.
    },
  });
}

export function useCapsule(token: string) {
  const fallback = pick(demoCapsule, emptyCapsule(token));
  return useQuery<LegacyCapsule>({
    queryKey: ['legacy', 'capsule', token],
    queryFn: withFallback(() => endpoints.legacy.capsule(token), fallback),
    placeholderData: fallback,
  });
}

// ---------------------------------------------------------------------------
// Legacy plan overview + mutations.
//
// Overview is a real read — no fabricated fallback. If it errors we surface a
// neutral DRAFT so the page renders, but we never invent an on-chain plan.
// ---------------------------------------------------------------------------

const emptyOverview: LegacyOverview = {
  plan: { status: 'DRAFT', threshold: 2, contractId: null, legacyId: null },
  counts: { beneficiaries: 0, guardians: 0, verifiedGuardians: 0, assets: 0 },
  checkIn: null,
  onChainReady: false,
};

export function useLegacyOverview() {
  return useQuery({
    queryKey: ['legacy', 'overview'],
    queryFn: withFallback(endpoints.legacy.overview, emptyOverview),
    placeholderData: emptyOverview,
  });
}

/** Add / edit a beneficiary, surfacing real errors and refreshing the list. */
export function useSaveBeneficiary(beneficiaryId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Beneficiary>) =>
      beneficiaryId
        ? endpoints.beneficiaries.update(beneficiaryId, payload)
        : endpoints.beneficiaries.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['legacy', 'overview'] });
    },
  });
}

/** Invite a guardian, surfacing real errors and refreshing the list. */
export function useInviteGuardian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Guardian>) => endpoints.guardians.invite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['guardians', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/** Add an asset to the plan, surfacing real errors and refreshing totals. */
export function useProtectAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { label: string; assetCode: string; amount: number }) =>
      endpoints.assets.protect(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['legacy', 'overview'] });
    },
  });
}

/** Upload an encrypted document to the archive, surfacing real errors. */
export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, category, file }: { title: string; category: string; file: File }) =>
      uploadDocument(title, category, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archive'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
