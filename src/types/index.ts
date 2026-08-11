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
  /** Per-channel courtesy-email toggles; the API always returns a full object. */
  notificationPrefs: NotificationPreferences;
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
  /** Present once the guardian connects a wallet; required before they can approve. */
  walletAddress: string | null;
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

/**
 * The owner's courtesy-email toggles. These mirror the API's channels exactly
 * and gate ONLY emails to the owner's own inbox — safety emails to guardians
 * and beneficiaries are never affected. All default to on.
 */
export interface NotificationPreferences {
  /** Upcoming Life Check-In reminders. */
  checkInReminders: boolean;
  /** When a guardian accepts / responds to a request. */
  guardianResponses: boolean;
  /** When a beneficiary receives what was left for them. */
  beneficiaryClaims: boolean;
}

/** A beneficiary claim package / guided Legacy Capsule reveal. */
export interface LegacyCapsule {
  token: string;
  fromName: string;
  toName: string;
  message: string;
  /**
   * The plan's on-chain status. Drives the capsule's call-to-action: only once
   * it reaches VERIFIED can the beneficiary begin, and only at RELEASED can they
   * claim their share. Before VERIFIED the API reveals nothing private.
   */
  status: LegacyPlanStatus;
  /** True once the legacy is RELEASED and the beneficiary can claim. */
  readyToClaim: boolean;
  assets: Array<
    Pick<Asset, 'id' | 'label' | 'assetCode' | 'amount'> & {
      /** Only present for stablecoins (face value); never fabricated otherwise. */
      usdValue?: number;
    }
  >;
  documents: Array<Pick<ArchiveDocument, 'id' | 'title' | 'category'>>;
  messages: Array<Pick<Message, 'id' | 'type' | 'title' | 'body' | 'durationLabel'>>;
}

// ---------------------------------------------------------------------------
// Self-custody (build / sign / submit) shapes.
//
// Heirloom never holds a signing key. The API BUILDS an unsigned transaction;
// the owner / guardian / beneficiary signs it in their own Freighter wallet;
// the signed XDR is relayed back to POST /legacy/submit. These mirror the API's
// stellar.types.ts and legacy DTOs.
// ---------------------------------------------------------------------------

/** On-chain plan status, mirroring the contract's LegacyStatus. */
export type LegacyPlanStatus =
  | 'DRAFT'
  | 'FUNDED'
  | 'VERIFIED'
  | 'RELEASED'
  | 'CANCELLED';

/** An unsigned transaction envelope the client must sign in Freighter. */
export interface UnsignedTransaction {
  /** Base64 transaction envelope (XDR). */
  xdr: string;
  /** Which network Freighter should sign for. */
  networkPassphrase: string;
  /** The contract method this envelope calls — for display / telemetry. */
  method: string;
  /** The account expected to sign (source / auth). */
  source: string;
}

/** The on-chain actions a signed transaction can carry (see submit-legacy.dto). */
export type LegacyAction =
  | 'protect'
  | 'deposit'
  | 'approve'
  | 'release'
  | 'claim'
  | 'cancel';

/** Payload for POST /legacy/submit — a client-signed transaction to relay. */
export interface SubmitLegacyPayload {
  action: LegacyAction;
  /** The signed transaction envelope (base64 XDR) from Freighter. */
  signedXdr: string;
  /** Required for `approve` — the guardian whose approval this is. */
  guardianId?: string;
  /** Required for `claim` — the beneficiary claiming. */
  beneficiaryId?: string;
}

/** Result of relaying a signed transaction. */
export interface SubmitResult {
  txHash: string;
  status: LegacyPlanStatus;
}

/** GET /legacy overview — the plan plus a snapshot of what it protects. */
export interface LegacyOverview {
  plan: {
    status: LegacyPlanStatus;
    threshold: number;
    contractId: string | null;
    legacyId: string | null;
  };
  counts: {
    beneficiaries: number;
    guardians: number;
    verifiedGuardians: number;
    assets: number;
  };
  checkIn: CheckInState | null;
  /** Whether the on-chain layer is configured (a contract id is set). */
  onChainReady: boolean;
}

/** One beneficiary's claim package from GET /legacy/claims. */
export interface LegacyClaimPackage {
  beneficiary: {
    id: string;
    name: string;
    relationship: Relationship;
    allocationPercentage: number;
  };
  assets: Array<{ assetCode: string; amount: string; status: AssetStatus }>;
  messages: Array<{ id: string; title: string; type: MessageType }>;
  documents: Array<{ id: string; title: string; category: DocumentCategory }>;
  status: 'READY_TO_CLAIM' | 'PREPARING';
}

/** GET /legacy/claims — claim packages for every beneficiary. */
export interface LegacyClaimsResponse {
  status: LegacyPlanStatus;
  readyToClaim: boolean;
  packages: LegacyClaimPackage[];
}
