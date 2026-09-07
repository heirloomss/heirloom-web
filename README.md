<!-- Add a banner image here (upload to a GitHub comment, paste the
     user-attachments URL) to match the approved-repo convention. -->
<p align="center">
  <strong>heirloom-web</strong><br />
  The user-facing app for Heirloom — a digital legacy platform on Stellar.
</p>

<p align="center">
  <a href="https://github.com/heirloomss/heirloom-web/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/heirloomss/heirloom-web/actions/workflows/ci.yml/badge.svg" /></a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black.svg" />
  <img alt="Node" src="https://img.shields.io/badge/node-22-339933.svg" />
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green.svg" />
</p>

<p align="center">
  <a href="docs/">Documentation</a> ·
  <a href="https://github.com/heirloomss/heirloom-api">API repo</a> ·
  <a href="https://github.com/heirloomss/heirloom-contracts">Contracts repo</a> ·
  <a href="#design-language">Design language</a> ·
  <a href="#environment-variables">Environment</a>
</p>

---

## What this is

Where people prepare, protect, and eventually pass on their digital assets,
documents, and the words that matter most.

It is intentionally **not** a crypto app. It is a calm space for families to
prepare for the future — designed to feel like opening a family archive: layered
paper, warm tones, gentle motion, and language that never mentions "wallets",
"hashes", or "smart contracts". The Stellar mechanics (Freighter signing, the
Soroban `legacy` contract) run underneath a plain-English surface.

## Maintainers · [Telegram](https://t.me/cjay)

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/Cjay-Cyber-2.png" width="120" alt="Cjay" /><br /><br />
      <strong>Cjay — Maintainer</strong><br /><br />
      <a href="https://github.com/Cjay-Cyber-2">Cjay-Cyber-2</a><br />
      <a href="https://t.me/cjay">Telegram</a><br />
      <a href="mailto:chijiokejoseph2022@gmail.com">Email</a>
    </td>
  </tr>
</table>

## Contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Design language](#design-language)
- [Project structure](#project-structure)
- [Deployment (Vercel)](#deployment-vercel)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Security](#security)
- [Contributors](#contributors)
- [License](#license)

## What it does

- **Continue your story** — a dashboard that greets you warmly ("Your legacy is protected").
- **Beneficiaries** — add the people and causes you love with clear allocation percentages.
- **Protected Assets** — set aside Stellar assets (XLM, USDC, …) without blockchain jargon.
- **Digital Archive** — an encrypted vault for deeds, passports, insurance, and more.
- **Messages** — letters, voice notes, videos, and photos, released at the right moment.
- **Guardians** — a small circle of trusted people who confirm, never control.
- **Life Check-In** — an "I'm Here" button; gentle reminders, never alarms.
- **Legacy Journey** — the signature feature: your legacy released at exactly the right moments.
- **Legacy Capsule** — beneficiaries receive a guided, respectful reveal at `/claim/[token]`, not a download page.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** — custom "Premium Paper Diorama" design system
- **Framer Motion** — paper-like animation (fold, lift, slide, reveal)
- **TanStack Query** — server state
- **React Hook Form + Zod** — calm, gentle validation
- **@stellar/freighter-api** — wallet signing
- Node **22**, pnpm **11.1.2** (pinned via `packageManager`)

## Quick start

```bash
corepack enable
pnpm install
cp .env.example .env.local        # NEXT_PUBLIC_DEMO_MODE=false
pnpm dev                          # http://localhost:3000
```

The app talks to `heirloom-api`. To bring up the whole stack locally, follow
[docs/developers/local-setup.md](docs/developers/local-setup.md).

Set `NEXT_PUBLIC_DEMO_MODE=true` to explore every screen with no backend — this
renders fabricated sample families and is a reviewer convenience only.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the heirloom-api REST backend (default `http://localhost:4000/api`) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` or `mainnet` |
| `NEXT_PUBLIC_RPC_URL` | Soroban RPC endpoint |
| `NEXT_PUBLIC_DEMO_MODE` | `true` to explore with no backend. **Must be `false` in production** — when false, no fabricated data is ever shown. |

## Design language

**Premium Paper Diorama** — luxury archival paper, not glass or neon.

- **Colours:** Museum Paper background, Forest Moss primary, Antique Bronze and
  Burgundy accents, Dusty Indigo for information.
- **Typography:** Cormorant Garamond display, Satoshi/Inter UI, IBM Plex Mono for
  account IDs only.
- **Motion:** Fold, Lift, Slide, Reveal, Stack, Unfold — never bounce, elastic,
  or spin.
- **Shadows:** soft paper depth (`0 2px 6px`, `0 8px 20px`, `0 14px 34px`).

## Project structure

```
src/
├── app/
│   ├── (auth)/       # Freighter wallet sign-in (email/password preserved but disabled)
│   ├── (app)/        # dashboard, beneficiaries, assets, archive,
│   │                 # messages, guardians, activity, settings
│   ├── (public)/     # the Legacy Capsule reveal — /claim/[token]
│   └── page.tsx      # landing
├── components/
│   ├── ui/           # Button, Card, Dialog, Input, Badge, …
│   ├── forms/        # RHF + Zod forms
│   ├── cards/        # BeneficiaryCard, AssetCard, MessageCard, …
│   ├── timeline/     # FamilyTimeline, LegacyJourneyTimeline
│   ├── dashboard/    # HeroSection, StatCards, LifeCheckInCard
│   └── shared/       # AppShell, navigation
├── hooks/            # TanStack Query hooks
├── services/         # API client & endpoint wrappers
├── lib/              # motion, validation, utils
└── styles/           # globals.css with design tokens
```

## Deployment (Vercel)

1. Import the repo into Vercel (framework preset: Next.js).
2. Set `NEXT_PUBLIC_API_URL` to the deployed `heirloom-api` URL (with `/api`),
   plus `NEXT_PUBLIC_STELLAR_NETWORK`, `NEXT_PUBLIC_RPC_URL`, and
   `NEXT_PUBLIC_DEMO_MODE=false`.
3. Deploy. Set `WEB_ORIGIN` on the API to the resulting URL so CORS and the
   `/claim/<token>` email links resolve.

Topology: user → **heirloom-web** (Vercel) → **heirloom-api** (Render) →
PostgreSQL/Redis, and heirloom-web → Soroban RPC directly for Freighter-signed
contract writes.

## Documentation

The full project documentation lives in [`docs/`](docs/) and is published with
GitBook (Git Sync on this repo, root `./docs` — see [`.gitbook.yaml`](.gitbook.yaml)).

| Section | |
| --- | --- |
| Overview | [The problem](docs/overview/problem.md) · [How it works](docs/overview/how-it-works.md) · [Architecture](docs/overview/architecture.md) |
| Protocol | [Lifecycle](docs/protocol/lifecycle.md) · [Economic model](docs/protocol/economics.md) · [Security model](docs/protocol/security-model.md) |
| Contract | [`legacy` reference](docs/contracts/legacy-reference.md) · [Events](docs/contracts/events.md) · [Errors](docs/contracts/errors.md) |
| Guides | [Owner](docs/guides/owner.md) · [Guardian](docs/guides/guardian.md) · [Beneficiary](docs/guides/beneficiary.md) |
| Developers | [Local setup](docs/developers/local-setup.md) · [Environment](docs/developers/environment.md) · [REST API](docs/developers/api-reference.md) · [SDK & RPC](docs/developers/sdk-and-rpc.md) · [Deployment](docs/developers/deployment.md) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). `main` is protected — open a PR, keep the
`ci` check green, one logical change per PR.

## Security

Unaudited, testnet-oriented. Report vulnerabilities privately — see
[SECURITY.md](SECURITY.md).

## Contributors

<a href="https://github.com/heirloomss/heirloom-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=heirloomss/heirloom-web" />
</a>

## License

MIT
