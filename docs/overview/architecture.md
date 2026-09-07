# System architecture

Three repositories, three deployable pieces, plus Stellar.

## Components

| Piece | Repo | Runtime | Responsibility |
| --- | --- | --- | --- |
| Web app | `heirloom-web` | Next.js 15 (Vercel) | The interface. Builds nothing trust-critical; sends Freighter-signed transactions straight to Soroban RPC. |
| API | `heirloom-api` | NestJS 11 (Render) | Accounts, beneficiaries/guardians metadata, encrypted archive, messages, reminders, activity feed. Builds **unsigned** contract transactions. |
| Contract | `heirloom-contracts` | Soroban / Stellar testnet | Custody of deposited assets, guardian threshold, release, claims, refunds. |
| Database | — | PostgreSQL + Redis (Render) | App state and the BullMQ check-in scheduler. |

## Topology

```
                 Freighter (signs everything on-chain)
                        │
   ┌────────────────────┼───────────────────────────┐
   │                    │                           │
 User ──▶ heirloom-web ─┼──▶ heirloom-api ──▶ PostgreSQL
        (Vercel)        │      (Render)   └──▶ Redis (BullMQ)
                        │
                        └──▶ Soroban RPC ──▶ legacy contract
                             (contract writes go direct from the
                              browser; the API only builds unsigned XDR)
```

Reads of on-chain state can go through the API (which caches and formats) or
direct from the app. **Writes** to the contract are always: API builds unsigned
XDR → app asks Freighter to sign → app submits to Soroban RPC.

## Why the API never signs

Heirloom is self-custodial by construction. The API holds no Stellar secret key.
If the API is compromised, an attacker can read app metadata and encrypted
blobs, but cannot move a single stroop out of the contract — every transfer
requires either a beneficiary/owner/guardian signature or the permissionless
`finalize_release`, which only pays out to the pre-recorded beneficiary claims.

## Data classification

| Data | Where it lives | Protection |
| --- | --- | --- |
| Committed assets | The `legacy` contract | On-chain; released only per the state machine |
| Beneficiary/guardian names, emails, relationships | PostgreSQL | Access-controlled by user; not encrypted at rest by the app |
| Documents, voice, video, photos | Cloudflare R2 | AES-256-GCM ciphertext; key only in `ENCRYPTION_KEY` |
| Claim tokens | PostgreSQL | 32 random bytes; the only key to a capsule; never in logs |
| Session | Browser | JWT, 7-day expiry, issued after a Freighter signature challenge |

## External services

| Service | Used for | Failure mode if unset |
| --- | --- | --- |
| Soroban RPC | All contract reads/writes | On-chain endpoints return HTTP 503 |
| Cloudflare R2 | Encrypted archive + message media | Upload/download return HTTP 503 |
| Resend | Guardian invites, check-in reminders, claim links | Emails are logged and skipped |

None of these can fabricate a success. A missing contract ID is a 503, never a
fake transaction hash.
