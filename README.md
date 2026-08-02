# heirloom-web

The user-facing experience of **Heirloom** — a digital legacy platform built
on Stellar. This is where people prepare, protect, and eventually pass on
their digital assets, documents, and the words that matter most.

It is intentionally *not* a crypto app. It is a calm, beautiful space for
families to prepare for the future — designed to feel like opening a family
archive: layered paper, warm tones, gentle motion, and language that never
mentions "wallets," "hashes," or "smart contracts."

## What it does

- **Continue your story** — a dashboard that greets you warmly ("Your legacy is protected").
- **Beneficiaries** — add the people and causes you love with clear allocation percentages.
- **Protected Assets** — set aside Stellar assets (XLM, USDC, etc.) without blockchain jargon.
- **Digital Archive** — a secure, encrypted vault for deeds, passports, insurance, and more.
- **Messages** — letters, voice notes, videos, and photos for the people you love, released at the right moment.
- **Guardians** — a small circle of trusted people who confirm, never control.
- **Life Check-In** — an "I'm Here" button; gentle reminders, never alarms.
- **Legacy Journey** — the signature feature: your legacy released at exactly the right moments (birthdays, graduations, weddings).
- **Legacy Capsule** — beneficiaries receive a guided, respectful reveal, not a download page.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom "Premium Paper Diorama" design system
- **Framer Motion** for paper-like animation (fold, lift, slide, reveal)
- **TanStack Query** for server state
- **React Hook Form + Zod** for calm, gentle validation
- **Lucide Icons**

All screens render fully with warm fallback data when the API isn't running —
a Stellar Wave reviewer or developer can explore the complete UX end-to-end
without a backend.

## Getting started

```powershell
# from this directory
pnpm install
pnpm dev        # http://localhost:3000
```

The app talks to `heirloom-api`. To run everything locally, start the API
(see its README) and set the API URL in `.env`:

```powershell
cp .env.example .env
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the heirloom-api REST backend (default `http://localhost:4000/api`) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_RPC_URL` | Soroban RPC endpoint |

## Design language

**Premium Paper Diorama** — luxury archival paper, not glass or neon.

- **Colors:** Museum Paper background, Forest Moss primary, Antique Bronze
  and Burgundy accents, Dusty Indigo information.
- **Typography:** Cormorant Garamond display, Satoshi/Inter UI, IBM Plex
  Mono for account IDs only.
- **Motion:** Fold, Lift, Slide, Reveal, Stack, Unfold — never bounce,
  elastic, or spin.
- **Shadows:** soft paper depth (`0 2px 6px`, `0 8px 20px`, `0 14px 34px`).

## Project structure

```
src/
├── app/
│   ├── (auth)/       # sign-in / register
│   ├── (app)/        # dashboard, beneficiaries, assets, archive,
│   │                 # messages, guardians, activity, settings
│   ├── (public)/     # the Legacy Capsule reveal
│   └── page.tsx      # landing
├── components/
│   ├── ui/           # Button, Card, Dialog, Input, Badge, etc.
│   ├── forms/        # RHF+Zod forms
│   ├── cards/        # BeneficiaryCard, AssetCard, MessageCard, ...
│   ├── timeline/     # FamilyTimeline, LegacyJourneyTimeline
│   ├── dashboard/    # HeroSection, StatCards, LifeCheckInCard
│   └── shared/       # AppShell, navigation
├── hooks/            # TanStack Query hooks with warm fallbacks
├── services/         # API client & endpoint wrappers
├── lib/              # motion, validation, utils
└── styles/           # globals.css with design tokens
```

## Deployment (Render)

1. Publish as a **Static Site** or **Web Service** (Next.js SSR) — build with
   `pnpm build`, start with `pnpm start`.
2. Set `NEXT_PUBLIC_API_URL` to your deployed `heirloom-api` URL.
3. Connect it to your repo and deploy.

## License

MIT
