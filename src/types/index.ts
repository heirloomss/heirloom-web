/**
 * Shared domain types for Heirloom.
 * Mirrors the heirloom-api data models; kept free of blockchain vocabulary —
 * the UI speaks of accounts, keepsakes, and guardians instead.
 */

export type ISODateString = string;

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone?: string;
  /** Stellar account — surfaced to users only as "Connected Account". */
  walletAddress: string | null;
  checkInIntervalDays: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type Relationship =
  | 'Mother'
  | 'Father'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Friend'
  | 'Lawyer'
  | 'Charity'
  | 'Organization';

export const RELATIONSHIPS: Relationship[] = [
  'Mother',
  'Father',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Friend',
  'Lawyer',
  'Charity',
  'Organization',
];

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  relationship: Relationship;
  email: string;
  phone?: string;
  /** Present = "Wallet Connected"; absent = "Email Only". */
  walletAddress: string | null;
  allocationPercentage: number;
  verified: boolean;
  createdAt: ISODateString;
}

export type GuardianStatus = 'Verified' | 'Pending';

export interface Guardian {
  id: string;
  userId: string;
  name: string;
  email: string;
  relationship: Relationship;
  status: GuardianStatus;
  createdAt: ISODateString;
}

export interface GuardianSettings {
  /** How many guardians must approve, e.g. "2 of 3". */
  requiredApprovals: number;
  guardianCount: number;
}

export type AssetStatus = 'Protected' | 'Released' | 'Claimed';
export type AssetCode = 'XLM' | 'USDC' | 'EURC';

export const ASSET_CODES: AssetCode[] = ['USDC', 'XLM', 'EURC'];

export interface Asset {
  id: string;
  userId: string;
  label: string;
  assetCode: AssetCode;
  amount: number;
  /** Approximate value for calm display totals. */
  usdValue: number;
  recipientId: string | null;
  status: AssetStatus;
  createdAt: ISODateString;
}

export type DocumentCategory =
  | 'Passport'
  | 'House Deed'
  | 'Insurance'
  | 'Birth Certificate'
  | 'Marriage Certificate'
  | 'Business'
  | 'Tax'
  | 'Will'
  | 'Other';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Passport',
  'House Deed',
  'Insurance',
  'Birth Certificate',
  'Marriage Certificate',
  'Business',
  'Tax',
  'Will',
  'Other',
];

export interface ArchiveDocument {
  id: string;
  userId: string;
  title: string;
  category: DocumentCategory;
  /** Documents are always stored encrypted; surfaced as "Encrypted". */
  encrypted: boolean;
  sizeLabel: string;
  createdAt: ISODateString;
}

export type MessageType = 'Letter' | 'Voice' | 'Video' | 'Photo';
export const MESSAGE_TYPES: MessageType[] = ['Letter', 'Voice', 'Video', 'Photo'];

export type ReleaseRule =
  | 'Immediately'
  | 'After 30 Days'
  | 'On 18th Birthday'
  | 'On Wedding Day'
  | 'Future Milestone';

export const RELEASE_RULES: ReleaseRule[] = [
  'Immediately',
  'After 30 Days',
  'On 18th Birthday',
  'On Wedding Day',
  'Future Milestone',
];

export interface Message {
  id: string;
  userId: string;
  type: MessageType;
  title: string;
  recipientId: string | null;
  releaseRule: ReleaseRule;
  /** Letter body / transcript text. */
  body?: string;
  durationLabel?: string;
  createdAt: ISODateString;
}

export type ActivityKind =
  | 'beneficiary_added'
  | 'document_uploaded'
  | 'asset_protected'
  | 'message_recorded'
  | 'guardian_accepted'
  | 'legacy_updated'
  | 'check_in';

export interface ActivityEvent {
  id: string;
  userId: string;
  kind: ActivityKind;
  title: string;
  detail?: string;
  createdAt: ISODateString;
}

/** A single release moment in the Legacy Journey. */
export interface JourneyEvent {
  id: string;
  /** e.g. "Immediately", "After 30 Days", "Age 18", "Wedding Day". */
  moment: string;
  title: string;
  detail: string;
  releaseRule: ReleaseRule;
  kind: 'asset' | 'document' | 'message';
}

export interface CheckInState {
  intervalDays: number;
  daysRemaining: number;
  lastCheckIn: ISODateString;
}

export interface DashboardStats {
  assetsUsd: number;
  beneficiaries: number;
  messages: number;
  documents: number;
}

export type CheckInInterval = 30 | 90 | 180;
export const CHECK_IN_INTERVALS: CheckInInterval[] = [30, 90, 180];

export interface NotificationPreferences {
  checkInReminders: boolean;
  familyUpdates: boolean;
  guardianActivity: boolean;
}

/** A beneficiary claim package / guided Legacy Capsule reveal. */
export interface LegacyCapsule {
  token: string;
  fromName: string;
  toName: string;
  message: string;
  assets: Array<Pick<Asset, 'id' | 'label' | 'assetCode' | 'amount' | 'usdValue'>>;
  documents: Array<Pick<ArchiveDocument, 'id' | 'title' | 'category'>>;
  messages: Array<Pick<Message, 'id' | 'type' | 'title' | 'body' | 'durationLabel'>>;
}
