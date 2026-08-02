import {
  Award,
  Cake,
  Clock,
  FileText,
  HeartHandshake,
  Mail,
  Shield,
  type LucideIcon,
} from 'lucide-react';

/** Static marketing copy & palette mappings. Keeps pages free of copy clutter. */

export const TAGLINES = [
  'Because love deserves a plan that lasts.',
  'Preserve what matters. Protect those who matter.',
  'Your legacy, thoughtfully prepared.',
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
  description: string;
  icon: LucideIcon;
  tone: CardTone;
}

export const FEATURES: Feature[] = [
  {
    title: 'Beneficiaries',
    description:
      'The people and causes you love, gathered in one place — with clear, gentle instructions about who receives what.',
    icon: HeartHandshake,
    tone: 'moss',
  },
  {
    title: 'Digital Archive',
    description:
      'Deeds, passports, insurance — every important document, sealed safely and released only when the time comes.',
    icon: FileText,
    tone: 'indigo',
  },
  {
    title: 'Messages',
    description:
      'Letters, voice notes, videos and photographs — words of love and guidance, delivered at exactly the right moment.',
    icon: Mail,
    tone: 'burgundy',
  },
  {
    title: 'Legacy Journey',
    description:
      'A timeline of everything you leave behind, delivered gracefully — some things immediately, others at future milestones.',
    icon: Clock,
    tone: 'bronze',
  },
  {
    title: 'Guardians',
    description:
      'A small circle of people you trust absolutely, who confirm everything and help protect your family.',
    icon: Shield,
    tone: 'moss',
  },
  {
    title: 'Peace of Mind',
    description:
      'A gentle Life Check-In keeps everything quiet and certain. As long as you are here, nothing changes.',
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
    moment: 'Immediately',
    label: 'Essential documents',
    detail: 'The will, insurance and key records — available to the right people at once.',
    icon: FileText,
  },
  {
    moment: 'After 30 days',
    label: 'Letters & savings',
    detail: 'A window of quiet, then your words and provisions are delivered gently.',
    icon: Clock,
  },
  {
    moment: 'Age 18',
    label: 'Coming of age',
    detail: 'What you saved for your children, released when they are grown.',
    icon: Cake,
  },
  {
    moment: 'Future milestones',
    label: 'Weddings & beyond',
    detail: 'Moments you choose — marked and kept safe for the day they arrive.',
    icon: Award,
  },
];

export const FEATURE_AUDIENCE = [
  'Parents who want certainty for their children, whatever tomorrow holds.',
  'Couples building a life together and protecting it — quietly, simply.',
  'Caretakers of family history, keeping memories from slipping away.',
  'Anyone who has ever thought: "Someone should know where everything is."',
];

export const LEGACY_JOURNEY = {
  title: 'The Legacy Journey',
  subtitle:
    'An ordered, gentle timeline of everything you leave behind — delivered at exactly the right moment.',
} as const;
