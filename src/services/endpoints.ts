import { apiClient } from './api-client';
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
  Message,
  NotificationPreferences,
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
  me: () => apiClient.get<User>('/users/me'),
  dashboardSummary: () => apiClient.get<DashboardSummary>('/users/summary'),

  beneficiaries: {
    list: () => apiClient.get<Beneficiary[]>('/beneficiaries'),
    get: (id: string) => apiClient.get<Beneficiary>(`/beneficiaries/${id}`),
    create: (data: Partial<Beneficiary>) =>
      apiClient.post<Beneficiary>('/beneficiaries', data),
    update: (id: string, data: Partial<Beneficiary>) =>
      apiClient.patch<Beneficiary>(`/beneficiaries/${id}`, data),
    remove: (id: string) => apiClient.delete<void>(`/beneficiaries/${id}`),
  },

  guardians: {
    list: () => apiClient.get<Guardian[]>('/guardians'),
    invite: (data: Partial<Guardian>) => apiClient.post<Guardian>('/guardians', data),
    update: (id: string, data: Partial<Guardian>) =>
      apiClient.patch<Guardian>(`/guardians/${id}`, data),
    /** Guardian confirms during verification. */
    approve: (id: string) => apiClient.post<Guardian>(`/guardians/${id}/approve`),
    remove: (id: string) => apiClient.delete<void>(`/guardians/${id}`),
  },

  assets: {
    list: () => apiClient.get<Asset[]>('/assets'),
    get: (id: string) => apiClient.get<Asset>(`/assets/${id}`),
    protect: (data: { label: string; assetCode: string; amount: number; recipientId?: string }) =>
      apiClient.post<Asset>('/assets', data),
    update: (id: string, data: Partial<Asset>) =>
      apiClient.patch<Asset>(`/assets/${id}`, data),
    allocate: (id: string, recipientId: string) =>
      apiClient.patch<Asset>(`/assets/${id}`, { recipientId }),
    remove: (id: string) => apiClient.delete<void>(`/assets/${id}`),
  },

  documents: {
    list: () => apiClient.get<ArchiveDocument[]>('/archive'),
    /** Multipart upload — handled by a dedicated client helper. */
    remove: (id: string) => apiClient.delete<void>(`/archive/${id}`),
    downloadUrl: (id: string) => `/archive/${id}/download`,
  },

  messages: {
    list: () => apiClient.get<Message[]>('/messages'),
    get: (id: string) => apiClient.get<Message>(`/messages/${id}`),
    create: (data: Partial<Message>) => apiClient.post<Message>('/messages', data),
    update: (id: string, data: Partial<Message>) =>
      apiClient.patch<Message>(`/messages/${id}`, data),
    remove: (id: string) => apiClient.delete<void>(`/messages/${id}`),
  },

  activity: {
    list: () => apiClient.get<ActivityEvent[]>('/activity'),
    timeline: () => apiClient.get<ActivityEvent[]>('/activity'),
  },

  /** Life Check-In — "We're checking in. Everything okay?" → "I'm Here". */
  checkIn: {
    state: () => apiClient.get<CheckInState>('/activity/checkin'),
    confirm: () => apiClient.post<CheckInStatusResponse>('/activity/checkin'),
    /** Configure cadence (30/90/180 days). */
    setInterval: (intervalDays: number) =>
      apiClient.post<CheckInStatusResponse>('/activity/checkin', { intervalDays }),
  },

  /** Legacy: plan overview, protect, simulated verification/release, claims. */
  legacy: {
    overview: () => apiClient.get<Record<string, unknown>>('/legacy'),
    protect: (data: unknown) => apiClient.post('/legacy/protect', data),
    simulateRelease: () => apiClient.post('/legacy/simulate-release'),
    claims: () => apiClient.get<LegacyCapsule[]>('/legacy/claims'),
    /** The Legacy Journey timeline. */
    journey: () => apiClient.get<JourneyEvent[]>('/legacy'),
    /** A beneficiary's guided Legacy Capsule reveal. */
    capsule: (token: string) => apiClient.get<LegacyCapsule>(`/legacy/claims/${token}`),
  },

  settings: {
    updateProfile: (data: Partial<User>) => apiClient.patch<User>('/users/me', data),
    updateCheckInInterval: (intervalDays: number) =>
      apiClient.post<CheckInStatusResponse>('/activity/checkin', { intervalDays }),
  },
};

// Referenced types used only for method signatures above; re-exported so the
// hooks layer stays tidy.
export type {
  GuardianSettings,
  NotificationPreferences,
};
