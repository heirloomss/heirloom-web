# Drips Wave submission pack

Everything needed for the Stellar Wave submission form. Fill the bracketed URLs
once the repos are public and the app is deployed.

## Project description (one paragraph)

> Heirloom is a digital legacy platform on Stellar. Most people leave no estate
> plan — Caring.com's 2024 study found only about one in three US adults has a
> will — and the digital half of an estate (self-custodied crypto, exchange
> accounts, password vaults) is routinely lost when someone dies, while
> traditional probate runs 6–9 months and 3–7% of estate value in fees.
> Heirloom moves the two things that matter — the assets and the release rule —
> onto a Soroban contract. An owner deposits committed assets into the `legacy`
> contract, names beneficiaries with basis-point allocations, and names
> guardians with an M-of-N threshold. While the owner completes a periodic Life
> Check-In, nothing moves. If check-ins stop, the guardians verify on-chain;
> once the threshold is met, release is permissionless and each beneficiary
> claims their share directly from the contract. The company runs reminders, an
> encrypted document archive, and a calm non-crypto interface — it holds no
> signing key and cannot move the funds or decide the outcome.

## Repository relationship

Three repos, deployed as three pieces plus the contract:

- **[heirloom-contracts]** — the Soroban `legacy` contract (Rust). Custody of
  deposited assets, the five-state lifecycle, guardian threshold, permissionless
  release, per-beneficiary claims, owner cancel + refund. This is the only
  trust-critical code.
- **[heirloom-api]** — NestJS service. Accounts, beneficiary/guardian metadata,
  the AES-256-GCM encrypted archive (Cloudflare R2), personal messages, the Life
  Check-In scheduler, email, and an **unsigned-XDR builder** for the contract.
  It never holds a Stellar key.
- **[heirloom-web]** — Next.js app. The interface people use. Sends
  Freighter-signed transactions straight to Soroban RPC; reads plan state via
  the API.

Data flow: user → heirloom-web → heirloom-api → PostgreSQL/Redis, and
heirloom-web → Soroban RPC directly for contract writes. Contract writes are
always: API builds unsigned XDR → Freighter signs → app submits.

This documentation set lives in `heirloom-web/docs/` and is published with
GitBook (Git Sync on `heirloom-web`, root `./docs`).

## Planned issues (already created)

23 issues are open across the three repos, scoped by component with
complexity/type labels, acceptance criteria, and tech stack.

**heirloom-contracts (7)** — per-beneficiary claim expiry + reclaim; multi-asset
plans; editable guardian set on Draft; partial cancellation / top-up; property
tests for the bps dust invariant; CI wasm-hash verification; generated
TypeScript bindings.

**heirloom-api (8)** — contract-event indexer into the Family Timeline; capsule
token rate-limiting + audit; domain-verified templated email; hardened streaming
uploads; e2e for the missed-check-in cascade; Redis nonce store for the wallet
challenge; CI Postgres + migrate check; readiness probe.

**heirloom-web (8)** — full Freighter claim flow on `/claim/[token]`; Protect +
Fund flow with deposit progress; guardian approval screen; Legacy Journey
timeline wired to the API; accessibility pass on the capsule; Playwright smoke
in CI; build-time DEMO_MODE guard; copy extraction for i18n.

Cross-repo work (e.g. a new contract function plus its UI) is tracked with
coordinated "Depends on" issues and shipped contract → API → web.

## Links to assemble

| Item | URL |
| --- | --- |
| Live app | https://heirloome.vercel.app |
| heirloom-contracts | https://github.com/heirloomss/heirloom-contracts |
| heirloom-api | https://github.com/heirloomss/heirloom-api |
| heirloom-web | https://github.com/heirloomss/heirloom-web |
| Documentation site (GitBook, from heirloom-web/docs) | `[https://…gitbook.io]` |
| Contract on explorer | https://stellar.expert/explorer/testnet/contract/CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE |
| Deploy transaction | https://stellar.expert/explorer/testnet/tx/c1c58e40f734f618c99a9456c4f802be7344e27d7950842e74f90bf349af1844 |
| Release tags | `v0.1.0` on each repo |
| Demo video | `[record: owner sets up a plan → funds → guardian approves → beneficiary claims]` |

## Pre-submission checklist

- [ ] All three repos **public**
- [ ] Branch protection applied (`scripts-branch-protection.sh`)
- [ ] CI green on `main` for all repos
- [ ] App deployed; `NEXT_PUBLIC_DEMO_MODE=false`; health check 200 with Stellar,
      R2, and Resend all "connected"
- [ ] R2 and Resend credentials filled in `heirloom-api/.env` / host env
- [ ] GitBook space connected to `heirloom-web` (Git Sync, root `./docs`) and published
- [ ] Demo video recorded and linked
- [ ] Confirmed Heirloom is **not already** in the approved list
      (https://www.drips.network/wave/stellar/repos)
