import { apiClient } from './api-client';
import {
  mapActivity,
  mapAsset,
  mapCheckIn,
  mapDocument,
  mapGuardian,
  mapMessage,
  mapUser,
  emptyWallet,
  messageTypeToApi,
  releaseRuleToApi,
} from '@/lib/mappers';
import type {
  ActivityEvent,
  ArchiveDocument,
  Asset,
  Beneficiary,
  CheckInState,
  Guardian,
  GuardianSettings,
  JourneyEvent,
  LegacyCapsule,
  LegacyClaimsResponse,
  LegacyOverview,
  Message,
  NotificationPreferences,
  SubmitLegacyPayload,
  SubmitResult,
  UnsignedTransaction,
  User,
} from '@/types';

/** Shape returned by GET /api/users/summary. */
export interface DashboardSummary {
  assets: number;
  assetsUsd: number;
  beneficiaries: number;
  messages: number;
  documents: number;
  guardians: number;
}

/** Shape returned by GET /api/activity/checkin. */
export interface CheckInStatusResponse {
  intervalDays: number;
  lastCheckIn: string | null;
  nextCheckIn: string | null;
  status: string;
  daysRemaining?: number;
}

/**
 * Endpoint wrappers, one per heirloom-api REST route.
 * TanStack Query hooks in `@/hooks` layer warm fallback/sample data on top so
 * every page renders completely even when the API is not running.
 */
export const endpoints = {
  me: async () => mapUser((await apiClient.get<Record<string, unknown>>('/users/me')) as Record<string, unknown>),
  dashboardSummary: () => apiClient.get<DashboardSummary>('/users/summary'),

  beneficiaries: {
    list: () => apiClient.get<Beneficiary[]>('/beneficiaries'),
    get: (id: string) => apiClient.get<Beneficiary>(`/beneficiaries/${id}`),
    create: (data: Partial<Beneficiary>) =>
      apiClient.post<Beneficiary>('/beneficiaries', {
        ...data,
        walletAddress: emptyWallet(data.walletAddress ?? undefined),
      }),
    update: (id: string, data: Partial<Beneficiary>) =>
      apiClient.patch<Beneficiary>(`/beneficiaries/${id}`, {
        ...data,
        walletAddress: emptyWallet(data.walletAddress ?? undefined),
      }),
    remove: (id: string) => apiClient.delete<void>(`/beneficiaries/${id}`),
  },

  guardians: {
    list: async () =>
      ((await apiClient.get<Record<string, unknown>[]>('/guardians')) ?? []).map(mapGuardian),
    invite: (data: Partial<Guardian>) =>
      apiClient.post<Guardian>('/guardians', {
        ...data,
        walletAddress: emptyWallet(data.walletAddress ?? undefined),
      }),
    update: (id: string, data: Partial<Guardian>) =>
      apiClient.patch<Guardian>(`/guardians/${id}`, {
        ...data,
        walletAddress: emptyWallet(data.walletAddress ?? undefined),
      }),
    /**
     * Build the unsigned approve_guardian transaction for the guardian to sign
     * in their own Freighter wallet. `guardianAddress` is optional — the API
     * falls back to the guardian's stored walletAddress.
     */
    approveBuild: (id: string, guardianAddress?: string) =>
      apiClient.post<UnsignedTransaction>(
        `/guardians/${id}/approve/build`,
        guardianAddress ? { guardianAddress } : {},
      ),
    remove: (id: string) => apiClient.delete<void>(`/guardians/${id}`),
  },

  assets: {
    list: async () => ((await apiClient.get<Record<string, unknown>[]>('/assets')) ?? []).map(mapAsset),
    get: async (id: string) => mapAsset(await apiClient.get<Record<string, unknown>>(`/assets/${id}`)),
    protect: (data: { label: string; assetCode: string; amount: number; recipientId?: string }) =>
      apiClient.post<Asset>('/assets', { ...data, amount: String(data.amount) }),
    update: (id: string, data: Partial<Asset>) =>
      apiClient.patch<Asset>(`/assets/${id}`, data),
    allocate: (id: string, recipientId: string) =>
      apiClient.patch<Asset>(`/assets/${id}`, { recipientId }),
    remove: (id: string) => apiClient.delete<void>(`/assets/${id}`),
  },

  documents: {
    list: async () =>
      ((await apiClient.get<Record<string, unknown>[]>('/archive')) ?? []).map(mapDocument),
    /** Multipart upload — handled by a dedicated client helper. */
    remove: (id: string) => apiClient.delete<void>(`/archive/${id}`),
    downloadUrl: (id: string) => `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api'}/archive/${id}/download`,
  },

  messages: {
    list: async () =>
      ((await apiClient.get<Record<string, unknown>[]>('/messages')) ?? []).map(mapMessage),
    get: async (id: string) => mapMessage(await apiClient.get<Record<string, unknown>>(`/messages/${id}`)),
    create: (data: Partial<Message>) =>
      apiClient.post<Message>('/messages', {
        title: data.title,
        type: messageTypeToApi((data.type as Message['type']) ?? 'Letter'),
        recipientId: data.recipientId || undefined,
        content: data.body,
        releaseRule: releaseRuleToApi((data.releaseRule as Message['releaseRule']) ?? 'Immediately'),
      }),
    update: (id: string, data: Partial<Message>) =>
      apiClient.patch<Message>(`/messages/${id}`, {
        title: data.title,
        recipientId: data.recipientId,
        content: data.body,
        releaseRule: data.releaseRule
          ? releaseRuleToApi(data.releaseRule as Message['releaseRule'])
          : undefined,
      }),
    remove: (id: string) => apiClient.delete<void>(`/messages/${id}`),
  },

  activity: {
    list: async () =>
      ((await apiClient.get<Record<string, unknown>[]>('/activity')) ?? []).map(mapActivity),
    timeline: async () =>
      ((await apiClient.get<Record<string, unknown>[]>('/activity')) ?? []).map(mapActivity),
  },

  /** Life Check-In — "We're checking in. Everything okay?" → "I'm Here". */
  checkIn: {
    state: async () => mapCheckIn(await apiClient.get<Record<string, unknown>>('/activity/checkin')),
    confirm: () => apiClient.post<CheckInStatusResponse>('/activity/checkin'),
    /** Configure cadence (30/90/180 days). */
    setInterval: (intervalDays: number) =>
      apiClient.post<CheckInStatusResponse>('/activity/checkin', { intervalDays }),
  },

  /**
   * Legacy — the self-custodial lifecycle. Every state change is a two-step
   * handshake: a `*Build` call returns an unsigned transaction the owner /
   * guardian / beneficiary signs in Freighter, then `submit` relays the signed
   * XDR and the API reconciles the database. The API never holds a signing key.
   */
  legacy: {
    overview: () => apiClient.get<LegacyOverview>('/legacy'),
    /** The "N of M" guardian approval threshold and guardian count. */
    guardianSettings: () => apiClient.get<GuardianSettings>('/legacy/guardian-settings'),
    /** Persist the approval threshold (draft plans only). */
    setThreshold: (threshold: number) =>
      apiClient.patch<GuardianSettings>('/legacy/threshold', { threshold }),
    /** Build create_legacy (owner-signed) — Draft. */
    protectBuild: (data?: { threshold?: number; token?: string }) =>
      apiClient.post<UnsignedTransaction>('/legacy/protect/build', data ?? {}),
    /** Build deposit (owner-signed) — Draft → Funded. */
    depositBuild: () => apiClient.post<UnsignedTransaction>('/legacy/deposit/build'),
    /** Build finalize_release (permissionless; caller pays the fee). */
    releaseBuild: (callerAddress: string) =>
      apiClient.post<UnsignedTransaction>('/legacy/release/build', { callerAddress }),
    /** Build claim_assets (beneficiary-signed). */
    claimBuild: (beneficiaryId: string, beneficiaryAddress: string) =>
      apiClient.post<UnsignedTransaction>('/legacy/claim/build', {
        beneficiaryId,
        beneficiaryAddress,
      }),
    /** Build cancel_legacy (owner-signed) — refunds any deposit. */
    cancelBuild: () => apiClient.post<UnsignedTransaction>('/legacy/cancel/build'),
    /** Relay a client-signed transaction and reconcile the database. */
    submit: (data: SubmitLegacyPayload) => apiClient.post<SubmitResult>('/legacy/submit', data),
    claims: () => apiClient.get<LegacyClaimsResponse>('/legacy/claims'),
    /** The Legacy Journey timeline. */
    journey: () => apiClient.get<JourneyEvent[]>('/legacy/journey'),
  },

  /**
   * Claim — the PUBLIC Legacy Capsule at /claim/:token. A beneficiary has no
   * account, so every call here is unauthenticated (`skipAuth`) and scoped only
   * by the unguessable token in the URL. The token lets them VIEW the capsule
   * and BUILD the two transactions they sign in their own Freighter wallet; it
   * can never move funds on its own.
   */
  claim: {
    /** A beneficiary's guided Legacy Capsule reveal (gated until released). */
    capsule: (token: string) =>
      apiClient.get<LegacyCapsule>(`/claim/${token}`, { skipAuth: true }),
    /** Build finalize_release (permissionless; the beneficiary pays the fee). */
    releaseBuild: (token: string, callerAddress: string) =>
      apiClient.post<UnsignedTransaction>(
        `/claim/${token}/release/build`,
        { callerAddress },
        { skipAuth: true },
      ),
    /** Build claim_assets (beneficiary-signed). */
    claimBuild: (token: string, beneficiaryAddress: string) =>
      apiClient.post<UnsignedTransaction>(
        `/claim/${token}/claim/build`,
        { beneficiaryAddress },
        { skipAuth: true },
      ),
    /** Relay a beneficiary-signed transaction and reconcile. */
    submit: (token: string, data: { action: 'release' | 'claim'; signedXdr: string }) =>
      apiClient.post<SubmitResult>(`/claim/${token}/submit`, data, { skipAuth: true }),
  },

  settings: {
    updateProfile: (data: UpdateProfileInput) => apiClient.patch<User>('/users/me', data),
    updateCheckInInterval: (intervalDays: number) =>
      apiClient.post<CheckInStatusResponse>('/activity/checkin', { intervalDays }),
  },
};

/**
 * Fields the owner may change on their own profile. `notificationPrefs` accepts
 * a partial toggle — the API merges it onto the stored channels, so sending one
 * flag never clears the others.
 */
export type UpdateProfileInput = Partial<Omit<User, 'notificationPrefs'>> & {
  notificationPrefs?: Partial<NotificationPreferences>;
};

// Referenced types used only for method signatures above; re-exported so the
// hooks layer stays tidy.
export type {
  GuardianSettings,
  NotificationPreferences,
};
