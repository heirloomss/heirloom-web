import {
  Award,
  Cake,
  Clock,
  FileText,
  HeartHandshake,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  type LucideIcon,
} from 'lucide-react';

/** Clear marketing copy & palette mappings. Keeps landing page copy completely explanatory. */

export const TAGLINES = [
  'Because your family deserves certainty, clarity, and peace of mind.',
  'Preserve your assets. Protect your family. Share your memories.',
  'Your digital legacy, secured with precision and delivered with care.',
] as const;

export type CardTone = 'moss' | 'burgundy' | 'indigo' | 'bronze';

/** Card background + ink color per tone, reused across cards & features. */
export const TONE_STYLES: Record<CardTone, { wash: string; text: string }> = {
  moss: { wash: 'bg-moss-wash', text: 'text-moss' },
  burgundy: { wash: 'bg-burgundy-wash', text: 'text-burgundy' },
  indigo: { wash: 'bg-indigo-wash', text: 'text-indigo' },
  bronze: { wash: 'bg-bronze-wash', text: 'text-bronze' },
};

export interface Feature {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  tone: CardTone;
}

export const FEATURES: Feature[] = [
  {
    title: 'Smart Asset Allocation',
    subtitle: 'Stellar Smart Contracts',
    description:
      'Set exact percentage splits (e.g. 50% daughter, 30% son) for digital assets & funds. Handled automatically on Stellar with zero complex crypto steps for beneficiaries.',
    icon: HeartHandshake,
    tone: 'moss',
  },
  {
    title: 'Encrypted Document Vault',
    subtitle: 'AES-256 Client Encryption',
    description:
      'Store property deeds, passports, tax records, and legal wills. Files are encrypted on your device before upload, so only your named beneficiaries can decrypt them.',
    icon: FileText,
    tone: 'indigo',
  },
  {
    title: 'Time-Released Messages',
    subtitle: 'Letters & Milestone Videos',
    description:
      'Leave personal written letters, voice notes, and video messages. Schedule them to be delivered immediately, after 30 days, or on future milestones like an 18th birthday.',
    icon: Mail,
    tone: 'burgundy',
  },
  {
    title: 'Visual Legacy Timeline',
    subtitle: 'Complete Roadmap',
    description:
      'A clear, step-by-step visual timeline of every document, asset, and message prepared, showing exact delivery conditions and status.',
    icon: Clock,
    tone: 'bronze',
  },
  {
    title: 'Trusted Guardian Network',
    subtitle: 'Human Safeguard Protocol',
    description:
      'Nominate 2-3 trusted individuals (such as a sibling or lawyer). A configurable threshold (e.g. 2 of 3) must confirm status before any plan executes.',
    icon: Shield,
    tone: 'moss',
  },
  {
    title: 'Gentle Life Check-In',
    subtitle: '1-Click Confirmation',
    description:
      'Receive periodic (30, 90, or 180 day) email check-ins. Clicking "I\'m Here" resets the timer and keeps everything completely private and active.',
    icon: Award,
    tone: 'bronze',
  },
];

export interface JourneyStep {
  moment: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    moment: 'Step 1: Immediately',
    label: 'Essential Legal Documents',
    detail: 'Wills, life insurance policies, and critical house deeds released immediately to designated beneficiaries upon verified trigger.',
    icon: FileText,
  },
  {
    moment: 'Step 2: 30 Days Later',
    label: 'Financial Assets & Accounts',
    detail: 'Digital funds (USDC/XLM) transferred securely via Stellar claimable balances, and account password access hints shared.',
    icon: Clock,
  },
  {
    moment: 'Step 3: Age 18',
    label: 'Child Trust & Savings',
    detail: 'Savings and specific legacy funds saved for your children are released automatically when they reach adulthood.',
    icon: Cake,
  },
  {
    moment: 'Step 4: Future Milestones',
    label: 'Personal Letters & Videos',
    detail: 'Handwritten notes, wisdom letters, and videos saved for future milestones (like weddings or graduations) delivered as scheduled.',
    icon: Award,
  },
];

export const FEATURE_AUDIENCE = [
  'Parents who want to guarantee their children inherit savings, property deeds, and loving messages automatically.',
  'Digital Asset & Crypto Holders looking for a simple, non-technical way to pass on funds without risking lost private keys.',
  'Caretakers & Family Leaders organizing important documents (insurance, wills, titles) so relatives never struggle to find them.',
  'Anyone who wants peace of mind knowing their family will be guided, protected, and provided for no matter what happens.',
];

export const LEGACY_JOURNEY = {
  title: 'Automated Release Timeline',
  subtitle:
    'An ordered, gentle schedule of how assets, documents, and personal notes are delivered at the precise right moment.',
} as const;

export const FAQS = [
  {
    question: 'What is Heirloom and how does it work?',
    answer: 'Heirloom is a digital legacy platform that combines client-side document encryption and Stellar smart contracts. You upload important documents, set fund allocation percentages, write letters, and pick 2-3 trusted guardians. If you miss your periodic check-ins and guardians confirm your status, your inheritance plan executes automatically.'
  },
  {
    question: 'What happens if I accidentally miss a Life Check-In?',
    answer: 'Missing a check-in NEVER immediately triggers your inheritance plan. You will receive multiple email and SMS reminders. If you remain unresponsive, your nominated Trusted Guardians must vote and confirm (e.g. 2 out of 3 confirmation threshold) before any release process begins.'
  },
  {
    question: 'Do my beneficiaries need crypto knowledge to receive assets?',
    answer: 'No. Heirloom abstracts away all blockchain jargon. Beneficiaries receive clear, guided instructions with direct claim links that convert or deposit funds smoothly into standard fiat bank balances or simple digital wallets.'
  },
  {
    question: 'Are my private documents and messages safe?',
    answer: 'Yes. All documents and messages are encrypted on your local browser using zero-knowledge encryption before reaching our servers. Heirloom cannot read your files — only your intended beneficiaries holding the decryption key can unlock them.'
  }
];
