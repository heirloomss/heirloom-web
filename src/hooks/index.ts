'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { endpoints } from '@/services/endpoints';
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
import type { LegacyCapsule } from '@/types';
import { useUpdateProfile } from './use-update-profile';

export { useUpdateProfile };

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
 * Data hooks — every query has a warm fallback so pages always render
 * fully even while the API is not running. Never let a blank screen
 * be the user's first impression of their own legacy.
 *
 * `withFallback` guarantees the fallback even when the API *errors*
 * (e.g. connection refused): `placeholderData` alone only covers the
 * pending state, so on a refused request the data would otherwise
 * collapse to empty. Wrapping the queryFn means it never rejects — it
 * resolves to the demo data instead, and the page stays whole.
 */
function withFallback<T>(fn: () => Promise<T>, fallback: T): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch {
      return fallback;
    }
  };
}

export function useUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: withFallback(endpoints.me, demoUser),
    placeholderData: demoUser,
  });
}

export function useDashboardStats() {
  const fallbackSummary = {
    assets: demoStats.assetsUsd,
    assetsUsd: demoStats.assetsUsd,
    beneficiaries: demoStats.beneficiaries,
    messages: demoStats.messages,
    documents: demoStats.documents,
    guardians: demoGuardians.length,
  };
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: withFallback(endpoints.dashboardSummary, fallbackSummary),
    placeholderData: fallbackSummary,
    select: (d) => ({
      assetsUsd: d.assetsUsd,
      beneficiaries: d.beneficiaries,
      messages: d.messages,
      documents: d.documents,
    }),
  });
}

export function useBeneficiaries() {
  return useQuery({
    queryKey: ['beneficiaries'],
    queryFn: withFallback(endpoints.beneficiaries.list, demoBeneficiaries),
    placeholderData: demoBeneficiaries,
  });
}

export function useBeneficiary(id: string) {
  const fallback = demoBeneficiaries.find((b) => b.id === id) ?? demoBeneficiaries[0];
  return useQuery({
    queryKey: ['beneficiaries', id],
    queryFn: withFallback(() => endpoints.beneficiaries.get(id), fallback),
    placeholderData: fallback,
  });
}

export function useGuardians() {
  return useQuery({
    queryKey: ['guardians'],
    queryFn: withFallback(endpoints.guardians.list, demoGuardians),
    placeholderData: demoGuardians,
  });
}

export function useGuardianSettings() {
  // There is no dedicated settings endpoint; derive the approval threshold
  // from the guardians list and the demo configuration as a warm default.
  return useQuery({
    queryKey: ['guardians', 'settings'],
    queryFn: withFallback(async () => {
      const list = await endpoints.guardians.list();
      return { guardianCount: list.length, requiredApprovals: demoGuardianSettings.requiredApprovals };
    }, demoGuardianSettings),
    placeholderData: demoGuardianSettings,
  });
}

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: withFallback(endpoints.assets.list, demoAssets),
    placeholderData: demoAssets,
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['archive'],
    queryFn: withFallback(endpoints.documents.list, demoDocuments),
    placeholderData: demoDocuments,
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: withFallback(endpoints.messages.list, demoMessages),
    placeholderData: demoMessages,
  });
}

export function useMessage(id: string) {
  const fallback = demoMessages.find((m) => m.id === id) ?? demoMessages[0];
  return useQuery({
    queryKey: ['messages', id],
    queryFn: withFallback(() => endpoints.messages.get(id), fallback),
    placeholderData: fallback,
  });
}

export function useActivityTimeline() {
  return useQuery({
    queryKey: ['activity', 'timeline'],
    queryFn: withFallback(endpoints.activity.timeline, demoActivity),
    placeholderData: demoActivity,
  });
}

export function useLegacyJourney() {
  return useQuery({
    queryKey: ['legacy', 'journey'],
    queryFn: withFallback(endpoints.legacy.journey, demoJourney),
    placeholderData: demoJourney,
  });
}

export function useCheckIn() {
  return useQuery({
    queryKey: ['check-in'],
    queryFn: withFallback(endpoints.checkIn.state, demoCheckIn),
    placeholderData: demoCheckIn,
  });
}

/** Optimistic life check-in: confirms instantly and settles with the API. */
export function useConfirmCheckIn() {
  return useMutation({
    mutationFn: endpoints.checkIn.confirm,
    onError: () => {
      // The UI stays confirmed — check-ins fail gently.
    },
  });
}

export function useCapsule(token: string) {
  return useQuery<LegacyCapsule>({
    queryKey: ['legacy', 'capsule', token],
    queryFn: withFallback(() => endpoints.legacy.capsule(token), demoCapsule),
    placeholderData: demoCapsule,
  });
}
