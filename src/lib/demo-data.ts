import type {
  ActivityEvent,
  ArchiveDocument,
  Asset,
  Beneficiary,
  CheckInState,
  DashboardStats,
  Guardian,
  GuardianSettings,
  JourneyEvent,
  Message,
  NotificationPreferences,
  User,
} from '@/types';

/**
 * Warm, realistic sample data. When the API is not running, every page
 * renders from these fallbacks so the complete UX is always visible.
 * Nothing here is real.
 */

export const demoUser: User = {
  id: 'usr_cj',
  name: 'CJ Morgan',
  firstName: 'CJ',
  email: 'cj@heirloom.family',
  phone: '+1 (415) 555-0134',
  walletAddress: 'GAs7Qk2wYvUxM3n9rT5pLbC8dHf1jZ4oV6eN0sWqRtYuIoPaSdFgHjKl',
  checkInIntervalDays: 90,
  createdAt: '2026-01-12T09:00:00.000Z',
  updatedAt: '2026-07-14T09:00:00.000Z',
};

export const demoBeneficiaries: Beneficiary[] = [
  {
    id: 'ben_sarah',
    userId: 'usr_cj',
    name: 'Sarah Morgan',
    relationship: 'Daughter',
    email: 'sarah@example.com',
    phone: '+1 (415) 555-0145',
    walletAddress: 'GB3xLmNoPqRsTuVwXyZ1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9',
    allocationPercentage: 40,
    verified: true,
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'ben_james',
    userId: 'usr_cj',
    name: 'James Reed',
    relationship: 'Brother',
    email: 'james@example.com',
    walletAddress: null,
    allocationPercentage: 25,
    verified: true,
    createdAt: '2026-02-20T09:00:00.000Z',
  },
  {
    id: 'ben_amara',
    userId: 'usr_cj',
    name: 'Amara Okafor',
    relationship: 'Friend',
    email: 'amara@example.com',
    walletAddress: 'GC9zYxWvUtSrQpOnMlKjIhGfEdCbA0z9Y8x7W6v5U4t3S2r1Q0p9O8n7',
    allocationPercentage: 25,
    verified: false,
    createdAt: '2026-03-05T09:00:00.000Z',
  },
  {
    id: 'ben_hope',
    userId: 'usr_cj',
    name: 'Hope Foundation',
    relationship: 'Charity',
    email: 'giving@hopefoundation.org',
    walletAddress: null,
    allocationPercentage: 10,
    verified: false,
    createdAt: '2026-04-18T09:00:00.000Z',
  },
];

export const demoGuardians: Guardian[] = [
  {
    id: 'grd_ben',
    userId: 'usr_cj',
    name: 'Benjamin Morgan',
    email: 'ben@example.com',
    relationship: 'Brother',
    status: 'Verified',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'grd_laila',
    userId: 'usr_cj',
    name: 'Laila Hassan',
    email: 'laila@lawfirm.example',
    relationship: 'Lawyer',
    status: 'Verified',
    createdAt: '2026-02-12T09:00:00.000Z',
  },
  {
    id: 'grd_tomas',
    userId: 'usr_cj',
    name: 'Tomás Rivera',
    email: 'tomas@example.com',
    relationship: 'Friend',
    status: 'Pending',
    createdAt: '2026-03-01T09:00:00.000Z',
  },
];

export const demoGuardianSettings: GuardianSettings = {
  requiredApprovals: 2,
  guardianCount: 3,
};

export const demoAssets: Asset[] = [
  {
    id: 'ast_savings',
    userId: 'usr_cj',
    label: 'Family Savings',
    assetCode: 'USDC',
    amount: 8000,
    usdValue: 8000,
    recipientId: 'ben_sarah',
    status: 'Protected',
    createdAt: '2026-03-10T09:00:00.000Z',
  },
  {
    id: 'ast_reserve',
    userId: 'usr_cj',
    label: 'Long-term Reserve',
    assetCode: 'XLM',
    amount: 24000,
    usdValue: 5400,
    recipientId: null,
    status: 'Protected',
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'ast_gift',
    userId: 'usr_cj',
    label: "A Gift for Amara",
    assetCode: 'EURC',
    amount: 2000,
    usdValue: 2200,
    recipientId: 'ben_amara',
    status: 'Protected',
    createdAt: '2026-05-12T09:00:00.000Z',
  },
];

export const demoDocuments: ArchiveDocument[] = [
  {
    id: 'doc_deed',
    userId: 'usr_cj',
    title: 'Family House Deed',
    category: 'House Deed',
    encrypted: true,
    sizeLabel: '2.4 MB',
    createdAt: '2026-03-12T09:00:00.000Z',
  },
  {
    id: 'doc_insurance',
    userId: 'usr_cj',
    title: 'Life Insurance Policy',
    category: 'Insurance',
    encrypted: true,
    sizeLabel: '1.1 MB',
    createdAt: '2026-03-18T09:00:00.000Z',
  },
  {
    id: 'doc_passport',
    userId: 'usr_cj',
    title: 'Passport Scan',
    category: 'Passport',
    encrypted: true,
    sizeLabel: '820 KB',
    createdAt: '2026-04-02T09:00:00.000Z',
  },
  {
    id: 'doc_birth',
    userId: 'usr_cj',
    title: "Sarah's Birth Certificate",
    category: 'Birth Certificate',
    encrypted: true,
    sizeLabel: '640 KB',
    createdAt: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'doc_will',
    userId: 'usr_cj',
    title: 'Last Will & Testament',
    category: 'Will',
    encrypted: true,
    sizeLabel: '1.8 MB',
    createdAt: '2026-05-06T09:00:00.000Z',
  },
];

export const demoMessages: Message[] = [
  {
    id: 'msg_sarah_letter',
    userId: 'usr_cj',
    type: 'Letter',
    title: 'To My Daughter, Sarah',
    recipientId: 'ben_sarah',
    releaseRule: 'Immediately',
    body: 'My dearest Sarah,\n\nIf you are reading this, know that every ordinary morning with you was the great fortune of my life.\n\nBe gentle with yourself. Choose the work that keeps you curious, and the people who make you laugh until it hurts.\n\nI am so proud of you. I always was.\n\nAll my love,\nDad',
    createdAt: '2026-04-10T09:00:00.000Z',
  },
  {
    id: 'msg_amara_voice',
    userId: 'usr_cj',
    type: 'Voice',
    title: 'For My Wife — Our First Song',
    recipientId: 'ben_amara',
    releaseRule: 'After 30 Days',
    body: 'Hello my love. I recorded this on an ordinary Tuesday, because ordinary days with you were always my favorite.',
    durationLabel: '3 min',
    createdAt: '2026-04-28T09:00:00.000Z',
  },
  {
    id: 'msg_graduation',
    userId: 'usr_cj',
    type: 'Video',
    title: "Sarah's Graduation Message",
    recipientId: 'ben_sarah',
    releaseRule: 'On 18th Birthday',
    durationLabel: '5 min',
    createdAt: '2026-05-15T09:00:00.000Z',
  },
  {
    id: 'msg_lake_photo',
    userId: 'usr_cj',
    type: 'Photo',
    title: 'The Lake House, Summer 2019',
    recipientId: null,
    releaseRule: 'Immediately',
    createdAt: '2026-06-01T09:00:00.000Z',
  },
];

export const demoActivity: ActivityEvent[] = [
  {
    id: 'act_7',
    userId: 'usr_cj',
    kind: 'legacy_updated',
    title: 'Updated your legacy plan',
    detail: 'Allocation for the Hope Foundation adjusted to 10%',
    createdAt: '2026-07-28T09:00:00.000Z',
  },
  {
    id: 'act_1',
    userId: 'usr_cj',
    kind: 'check_in',
    title: 'Life Check-In confirmed',
    detail: "You let your family know you're here.",
    createdAt: '2026-07-14T09:00:00.000Z',
  },
  {
    id: 'act_2',
    userId: 'usr_cj',
    kind: 'message_recorded',
    title: 'Recorded a video message',
    detail: "Sarah's Graduation Message",
    createdAt: '2026-05-15T09:00:00.000Z',
  },
  {
    id: 'act_3',
    userId: 'usr_cj',
    kind: 'asset_protected',
    title: 'Protected your family savings',
    detail: '8,000 USDC set aside for Sarah',
    createdAt: '2026-05-12T09:00:00.000Z',
  },
  {
    id: 'act_6b',
    userId: 'usr_cj',
    kind: 'beneficiary_added',
    title: 'Added Hope Foundation',
    detail: 'Charity · 10%',
    createdAt: '2026-04-18T09:00:00.000Z',
  },
  {
    id: 'act_4',
    userId: 'usr_cj',
    kind: 'document_uploaded',
    title: 'Uploaded your house deed',
    detail: 'Filed safely in your Digital Archive',
    createdAt: '2026-03-12T09:00:00.000Z',
  },
  {
    id: 'act_5',
    userId: 'usr_cj',
    kind: 'guardian_accepted',
    title: 'Laila accepted her invitation',
    detail: 'Now a Trusted Guardian',
    createdAt: '2026-02-12T09:00:00.000Z',
  },
  {
    id: 'act_6',
    userId: 'usr_cj',
    kind: 'beneficiary_added',
    title: 'Added Sarah as a beneficiary',
    detail: 'Daughter · 40%',
    createdAt: '2026-02-02T09:00:00.000Z',
  },
];

export const demoJourney: JourneyEvent[] = [
  {
    id: 'jrn_1',
    moment: 'Immediately',
    title: 'House deed & insurance',
    detail: 'Your property and policy records reach your family at once.',
    releaseRule: 'Immediately',
    kind: 'document',
  },
  {
    id: 'jrn_2',
    moment: 'Immediately',
    title: 'A letter to Sarah',
    detail: 'Your words of love arrive without delay.',
    releaseRule: 'Immediately',
    kind: 'message',
  },
  {
    id: 'jrn_3',
    moment: 'After 30 Days',
    title: 'Family Savings for Sarah',
    detail: '8,000 USDC released gently after a time of quiet.',
    releaseRule: 'After 30 Days',
    kind: 'asset',
  },
  {
    id: 'jrn_4',
    moment: 'After 30 Days',
    title: 'A song for Amara',
    detail: 'The voice note you recorded, delivered with care.',
    releaseRule: 'After 30 Days',
    kind: 'message',
  },
  {
    id: 'jrn_5',
    moment: 'Age 18',
    title: "Sarah's graduation message",
    detail: 'Kept safe until she comes of age.',
    releaseRule: 'On 18th Birthday',
    kind: 'message',
  },
  {
    id: 'jrn_6',
    moment: 'Wedding Day',
    title: 'The wedding letters',
    detail: 'Read and kept forever on the day they marry.',
    releaseRule: 'On Wedding Day',
    kind: 'message',
  },
];

export const demoCheckIn: CheckInState = {
  intervalDays: 90,
  daysRemaining: 18,
  lastCheckIn: '2026-07-14T09:00:00.000Z',
};

export const demoStats: DashboardStats = {
  assetsUsd: demoAssets.reduce((sum, a) => sum + a.usdValue, 0),
  beneficiaries: demoBeneficiaries.length,
  messages: demoMessages.length,
  documents: demoDocuments.length,
};

export const demoNotifications: NotificationPreferences = {
  checkInReminders: true,
  familyUpdates: true,
  guardianActivity: true,
};

export function beneficiaryName(id: string | null | undefined): string | null {
  if (!id) return null;
  return demoBeneficiaries.find((b) => b.id === id)?.name ?? null;
}
