import type {
  ActivityEvent,
  ActivityKind,
  ArchiveDocument,
  Asset,
  AssetStatus,
  CheckInState,
  DocumentCategory,
  Guardian,
  GuardianStatus,
  Message,
  MessageType,
  ReleaseRule,
  User,
} from '@/types';

/**
 * Maps the API's Prisma enums and field names onto the calm UI types the rest
 * of the app already speaks. The API stays the source of truth; this file is
 * the only place the two vocabularies meet.
 */

const DOCUMENT_TO_API: Record<DocumentCategory, string> = {
  Passport: 'PASSPORT',
  'Birth Certificate': 'BIRTH_CERTIFICATE',
  Insurance: 'INSURANCE',
  'House Deed': 'HOUSE_DEED',
  'Marriage Certificate': 'MARRIAGE_CERTIFICATE',
  Business: 'BUSINESS',
  Tax: 'TAX',
  'Password Hint': 'PASSWORD_HINT',
  Will: 'WILL',
  Other: 'OTHER',
};

const DOCUMENT_FROM_API: Record<string, DocumentCategory> = {
  PASSPORT: 'Passport',
  BIRTH_CERTIFICATE: 'Birth Certificate',
  INSURANCE: 'Insurance',
  HOUSE_DEED: 'House Deed',
  MARRIAGE_CERTIFICATE: 'Marriage Certificate',
  BUSINESS: 'Business',
  TAX: 'Tax',
  PASSWORD_HINT: 'Password Hint',
  WILL: 'Will',
  OTHER: 'Other',
};

const MESSAGE_TO_API: Record<MessageType, string> = {
  Letter: 'LETTER',
  Voice: 'VOICE',
  Video: 'VIDEO',
  Photo: 'PHOTO',
};

const MESSAGE_FROM_API: Record<string, MessageType> = {
  LETTER: 'Letter',
  VOICE: 'Voice',
  VIDEO: 'Video',
  PHOTO: 'Photo',
};

const RELEASE_TO_API: Record<ReleaseRule, { kind: string; value?: string | number }> = {
  Immediately: { kind: 'IMMEDIATELY' },
  'After 30 Days': { kind: 'AFTER_DAYS', value: 30 },
  'On 18th Birthday': { kind: 'AT_AGE', value: 18 },
  'On Wedding Day': { kind: 'ON_EVENT', value: 'marriage' },
  'Future Milestone': { kind: 'ON_EVENT', value: 'future' },
};

export function documentCategoryToApi(category: string): string {
  return DOCUMENT_TO_API[category as DocumentCategory] ?? 'OTHER';
}

export function documentCategoryFromApi(raw: string): DocumentCategory {
  return DOCUMENT_FROM_API[raw] ?? (raw as DocumentCategory) ?? 'Other';
}

export function messageTypeToApi(type: MessageType | string): string {
  return MESSAGE_TO_API[type as MessageType] ?? String(type).toUpperCase();
}

export function messageTypeFromApi(raw: string): MessageType {
  return MESSAGE_FROM_API[raw] ?? (raw as MessageType) ?? 'Letter';
}

export function releaseRuleToApi(rule: ReleaseRule | string): { kind: string; value?: string | number } {
  return RELEASE_TO_API[rule as ReleaseRule] ?? { kind: 'IMMEDIATELY' };
}

export function releaseRuleFromApi(raw: unknown): ReleaseRule {
  if (typeof raw === 'string' && raw in RELEASE_TO_API) {
    return raw as ReleaseRule;
  }
  if (raw && typeof raw === 'object' && 'kind' in (raw as object)) {
    const rule = raw as { kind: string; value?: string | number };
    switch (rule.kind) {
      case 'AFTER_DAYS':
        return 'After 30 Days';
      case 'AT_AGE':
        return 'On 18th Birthday';
      case 'ON_EVENT': {
        const event = String(rule.value ?? '').toLowerCase();
        if (event === 'marriage' || event === 'wedding') return 'On Wedding Day';
        return 'Future Milestone';
      }
      case 'ON_DATE':
        return 'Future Milestone';
      default:
        return 'Immediately';
    }
  }
  return 'Immediately';
}

function formatBytes(size: number | undefined): string {
  if (!size || size <= 0) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function assetStatusFromApi(raw: string): AssetStatus {
  if (raw === 'RELEASED') return 'Released';
  if (raw === 'CLAIMED') return 'Claimed';
  return 'Protected';
}

function guardianStatusFromApi(raw: string): GuardianStatus {
  return raw === 'VERIFIED' ? 'Verified' : 'Pending';
}

function usdValue(assetCode: string, amount: number): number {
  if (assetCode === 'USDC' || assetCode === 'EURC') return amount;
  return 0;
}

export function mapUser(raw: Record<string, unknown>): User {
  const name = String(raw.name ?? '');
  return {
    id: String(raw.id ?? ''),
    name,
    firstName: name.split(' ')[0] || name,
    email: String(raw.email ?? ''),
    walletAddress: (raw.walletAddress as string | null) ?? null,
    checkInIntervalDays: 90,
    notificationPrefs: (raw.notificationPrefs as User['notificationPrefs']) ?? {
      checkInReminders: true,
      guardianResponses: true,
      beneficiaryClaims: true,
    },
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

export function mapAsset(raw: Record<string, unknown>): Asset {
  const amount = Number(raw.amount ?? 0);
  const assetCode = String(raw.assetCode ?? 'XLM') as Asset['assetCode'];
  const recipient = raw.recipient as { id?: string; name?: string } | null | undefined;
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    label: String(raw.label || assetCode),
    assetCode,
    amount,
    usdValue: usdValue(assetCode, amount),
    recipientId: (raw.recipientId as string | null) ?? recipient?.id ?? null,
    recipientName: recipient?.name ?? null,
    status: assetStatusFromApi(String(raw.status ?? 'PROTECTED')),
    createdAt: String(raw.createdAt ?? ''),
  };
}

export function mapDocument(raw: Record<string, unknown>): ArchiveDocument {
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    title: String(raw.title ?? ''),
    category: documentCategoryFromApi(String(raw.category ?? 'OTHER')),
    encrypted: Boolean(raw.encrypted ?? true),
    sizeLabel: formatBytes(Number(raw.size ?? 0)),
    createdAt: String(raw.createdAt ?? ''),
  };
}

export function mapMessage(raw: Record<string, unknown>): Message {
  const recipient = raw.recipient as { name?: string } | null | undefined;
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    type: messageTypeFromApi(String(raw.type ?? 'LETTER')),
    title: String(raw.title ?? ''),
    recipientId: (raw.recipientId as string | null) ?? null,
    recipientName: recipient?.name ?? null,
    releaseRule: releaseRuleFromApi(raw.releaseRule),
    body: (raw.content as string | undefined) ?? (raw.body as string | undefined),
    hasMedia: Boolean(raw.fileUrl),
    createdAt: String(raw.createdAt ?? ''),
  };
}

export function mapGuardian(raw: Record<string, unknown>): Guardian {
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    name: String(raw.name ?? ''),
    email: String(raw.email ?? ''),
    relationship: raw.relationship as Guardian['relationship'],
    status: guardianStatusFromApi(String(raw.status ?? 'PENDING')),
    walletAddress: (raw.walletAddress as string | null) ?? null,
    createdAt: String(raw.createdAt ?? ''),
  };
}

const ACTIVITY_KIND: Record<string, ActivityKind> = {
  BENEFICIARY_ADDED: 'beneficiary_added',
  DOCUMENT_UPLOADED: 'document_uploaded',
  ASSET_PROTECTED: 'asset_protected',
  MESSAGE_CREATED: 'message_recorded',
  GUARDIAN_ACCEPTED: 'guardian_accepted',
  LEGACY_UPDATED: 'legacy_updated',
  LEGACY_PROTECTED: 'legacy_updated',
  LEGACY_FUNDED: 'legacy_updated',
  LEGACY_VERIFIED: 'legacy_updated',
  LEGACY_RELEASED: 'legacy_updated',
  CHECK_IN_CONFIRMED: 'check_in',
  CHECK_IN_MISSED: 'check_in',
};

export function mapActivity(raw: Record<string, unknown>): ActivityEvent {
  const type = String(raw.type ?? '');
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    kind: ACTIVITY_KIND[type] ?? 'legacy_updated',
    title: String(raw.message ?? type),
    createdAt: String(raw.createdAt ?? ''),
  };
}

export function mapCheckIn(raw: Record<string, unknown> | null | undefined): CheckInState {
  if (!raw) {
    return { intervalDays: 90, daysRemaining: 90, lastCheckIn: '' };
  }
  const last = String(raw.lastCheckIn ?? '');
  const daysRemaining =
    typeof raw.daysRemaining === 'number'
      ? raw.daysRemaining
      : raw.nextCheckIn
        ? Math.max(0, Math.ceil((new Date(String(raw.nextCheckIn)).getTime() - Date.now()) / 86_400_000))
        : 90;
  return {
    intervalDays: Number(raw.intervalDays ?? 90),
    daysRemaining,
    lastCheckIn: last,
  };
}

export function emptyWallet(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
