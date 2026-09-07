# Environment variables

## `heirloom-api/.env`

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `PORT` | no | `4000` | HTTP port |
| `WEB_ORIGIN` | yes | `http://localhost:3000` | CORS allow-list; comma-separate multiple |
| `DATABASE_URL` | yes | `postgresql://heirloom:heirloom@localhost:5432/heirloom?schema=public` | Prisma |
| `JWT_SECRET` | yes | 32+ random chars | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `JWT_EXPIRES_IN` | no | `7d` | token lifetime |
| `ENCRYPTION_KEY` | yes | 64 hex chars | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` — AES-256-GCM |
| `REDIS_URL` | yes | `redis://localhost:6379` | BullMQ check-in scheduler |
| `CHECK_IN_REMINDER_GAP_HOURS` | no | `168` | `168` = weekly (prod). Use `1` on testnet to demo the missed-check-in cascade quickly. |
| `STELLAR_NETWORK` | yes | `testnet` | `testnet` or `mainnet` |
| `STELLAR_RPC_URL` | yes | `https://soroban-testnet.stellar.org` | Soroban RPC |
| `HEIRLOOM_CONTRACT_ID` | yes for on-chain | `CAA55GCID6…XUNE` | If empty, on-chain endpoints return **503** — never a fake tx hash |
| `R2_ACCOUNT_ID` | yes for archive | | Cloudflare account id |
| `R2_ACCESS_KEY_ID` | yes for archive | | R2 API token |
| `R2_SECRET_ACCESS_KEY` | yes for archive | | R2 API token secret |
| `R2_BUCKET` | yes for archive | `heirloom-archive` | |
| `R2_ENDPOINT` | no | *(blank)* | Defaults to `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `RESEND_API_KEY` | yes for email | `re_…` | Without it, emails are logged and skipped |
| `EMAIL_FROM` | yes for email | `Heirloome <onboarding@resend.dev>` | Resend test sender only delivers to your own Resend account email |

There is **no** `STELLAR_SECRET_KEY`. The API does not sign transactions.

## `heirloom-web/.env.local`

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:4000/api` | base URL of the API |
| `NEXT_PUBLIC_STELLAR_NETWORK` | yes | `testnet` | |
| `NEXT_PUBLIC_RPC_URL` | yes | `https://soroban-testnet.stellar.org` | used for direct contract reads/writes from the browser |
| `NEXT_PUBLIC_DEMO_MODE` | yes | `false` | **must be `false` in production.** `true` renders fabricated sample data with no backend. |

Anything prefixed `NEXT_PUBLIC_` ships to the browser — never put a secret there.

## `heirloom-contracts/.env`

| Variable | Example | Notes |
| --- | --- | --- |
| `NETWORK` | `testnet` | |
| `RPC_URL` | `https://soroban-testnet.stellar.org` | |
| `CONTRACT_ID` | `CAA55GCID6…XUNE` | filled after `scripts/deploy.sh` |

## Placeholders filled after deployment

| Value | Produced by | Consumed by |
| --- | --- | --- |
| `HEIRLOOM_CONTRACT_ID` / `CONTRACT_ID` | `heirloom-contracts/scripts/deploy.sh` | `heirloom-api/.env`, `heirloom-contracts/.env` |
| API base URL | Render deploy of `heirloom-api` | `heirloom-web` `NEXT_PUBLIC_API_URL`, and `WEB_ORIGIN` back on the API |
| Web URL | Vercel deploy of `heirloom-web` | `heirloom-api` `WEB_ORIGIN` (also builds the `/claim/<token>` email links) |
| `R2_*` | Cloudflare R2 dashboard | `heirloom-api/.env` |
| `RESEND_API_KEY` | Resend dashboard | `heirloom-api/.env` |
