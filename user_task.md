# Heirloome — Human Setup Tasks (`user_task.md`)

Everything **you** (a human) must do by hand so Heirloome can run as a live
product — no simulated chain, no fabricated demo data, no placeholder email.
None of this can be automated safely: it involves wallets, secrets, cloud
accounts, and funding. When this checklist is done, tell an agent to run
`latter.md`.

This project is three repositories side by side:

```
heirloom/
  heirloom-web/        Next.js 15 front end (this file lives here)
  heirloom-api/        NestJS 11 + Prisma + Postgres + Redis + Stellar SDK
  heirloom-contracts/  Soroban `legacy` smart contract (Rust)
```

GitHub org: `heirloomss`
(`https://github.com/heirloomss/heirloom-web` · `heirloom-api` · `heirloom-contracts`).

---

## 0. Security

- [ ] If a GitHub personal access token was ever pasted into a chat, **revoke it**
      at GitHub → Settings → Developer settings → Personal access tokens.
- [ ] Prefer SSH or `gh auth login` for git. Never paste tokens into prompts.

---

## 1. Install tools (once)

- [ ] **Node.js 20+** — https://nodejs.org (LTS)
- [ ] **pnpm** via Corepack: `corepack enable`
- [ ] **Docker Desktop** — Postgres + Redis for local runs
- [ ] **Freighter** browser extension — https://www.freighter.app
- [ ] **Rust** + wasm target + **Stellar CLI** (required — the contract must be live):

```powershell
# Windows (PowerShell). Use rustup from https://rustup.rs
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli
```

---

## 2. Freighter on Stellar testnet

Heirloome’s only sign-in is a Freighter signature. Email/password exists in the
code but is disabled on purpose — do not re-enable it for Drips.

- [ ] Install Freighter and create (or import) a Stellar account.
- [ ] Switch Freighter to **Testnet**.
- [ ] Fund it with Friendbot: https://laboratory.stellar.org/#account-creator?network=test
      Paste your public key (`G…`) and request XLM.
- [ ] Confirm a balance on https://stellar.expert/explorer/testnet
- [ ] You will also need **separate testnet accounts** for at least:
      - 2–3 guardians (they must sign approvals)
      - 1–2 beneficiaries (they must claim)
      Fund those too. Each person who signs on-chain needs their own funded `G…` account.

---

## 3. Start Postgres and Redis

The API already ships Compose. From `heirloom-api`:

```powershell
cd heirloom-api
docker compose up -d
docker compose ps
```

You should see `heirloom-postgres` on `5432` and `heirloom-redis` on `6379`.

---

## 4. Deploy the Soroban `legacy` contract (required)

There is **no simulated mode**. If `HEIRLOOM_CONTRACT_ID` is empty, protecting
a legacy returns HTTP 503. Deploy for real:

```powershell
cd heirloom-contracts
# One-time identity (stores a secret locally in the Stellar CLI, not in the API)
./scripts/init_identity.sh
# On Windows Git Bash / WSL. If you only have PowerShell, use WSL for these scripts.

NETWORK=testnet SOURCE=heirloom-deployer ./scripts/deploy.sh
```

- [ ] Copy the printed contract id (`C…`).
- [ ] You will paste it into `heirloom-api/.env` as `HEIRLOOM_CONTRACT_ID`.
- [ ] The **API never holds a signing key**. Owners, guardians, and beneficiaries
      sign in Freighter. Do not put a Freighter secret into the API `.env`.

---

## 5. Cloudflare R2 (encrypted archive)

Documents, voice, video, and photos are encrypted with AES-256-GCM in the API,
then stored in R2. Uploads return 503 until this is set.

- [ ] Create a Cloudflare account — https://dash.cloudflare.com
- [ ] R2 → Create bucket (e.g. `heirloom-archive`)
- [ ] Manage R2 API Tokens → Create API token with Object Read & Write on that bucket
- [ ] Copy: Account ID, Access Key ID, Secret Access Key, bucket name
- [ ] Endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (leave
      `R2_ENDPOINT` blank in `.env` to use that default)

---

## 6. Resend (real email)

Guardian invites, Life Check-In reminders, missed-check-in cascade, and the
beneficiary’s private capsule link (`/claim/<token>`) go out through Resend.

- [ ] Create an account — https://resend.com
- [ ] Create an API key
- [ ] For Drips/testnet you may send from `Heirloome <onboarding@resend.dev>`
      (Resend’s test sender — only delivers to **your** Resend account email)
- [ ] For a public demo, verify your own domain in Resend and set `EMAIL_FROM`
      to something like `Heirloome <hello@yourdomain.com>`

Without `RESEND_API_KEY`, emails are skipped and only logged. That is not
Drips-ready — fill it in.

---

## 7. Generate secrets

```powershell
# JWT signing secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# AES-256-GCM key (64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] Copy both. You will paste them into `heirloom-api/.env`.
- [ ] Never commit `.env` files.

---

## 8. Fill `heirloom-api/.env`

```powershell
cd heirloom-api
copy .env.example .env
```

Edit `.env` so **every** value is real:

```env
PORT=4000
WEB_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://heirloom:heirloom@localhost:5432/heirloom?schema=public

JWT_SECRET=<base64 from step 7>
JWT_EXPIRES_IN=7d

ENCRYPTION_KEY=<64-hex from step 7>

REDIS_URL=redis://localhost:6379

# 168 = 7 days between missed-check-in reminders (production).
# Use 1 on testnet if you need to demonstrate the cascade in a sitting.
CHECK_IN_REMINDER_GAP_HOURS=168

STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
HEIRLOOM_CONTRACT_ID=<C… from step 4>

R2_ACCOUNT_ID=<Cloudflare account id>
R2_ACCESS_KEY_ID=<R2 access key>
R2_SECRET_ACCESS_KEY=<R2 secret>
R2_BUCKET=heirloom-archive
R2_ENDPOINT=

RESEND_API_KEY=<re_… from step 6>
EMAIL_FROM=Heirloome <onboarding@resend.dev>
```

There is **no** `STELLAR_SECRET_KEY`. If an old note mentions it, ignore it.

---

## 9. Fill `heirloom-web/.env.local`

```powershell
cd heirloom-web
copy .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_DEMO_MODE=false
```

`NEXT_PUBLIC_DEMO_MODE` **must be `false`**. When true, API errors are replaced
with fabricated sample families. That is a reviewer convenience only — not a
live product.

Never commit `.env.local`.

---

## 10. Production host (Drips / public URL)

If you are deploying, not just running locally:

- [ ] Render (or similar): Postgres → Redis → **heirloom-api** web service → **heirloom-web**
- [ ] Set the same env vars on the API service (use the production `DATABASE_URL`,
      `REDIS_URL`, `WEB_ORIGIN`, `EMAIL_FROM`)
- [ ] Set `NEXT_PUBLIC_API_URL` on the web service to `https://<your-api>/api`
- [ ] Set `WEB_ORIGIN` on the API to the web URL (comma-separate localhost if needed)
- [ ] After deploy, update `EMAIL_FROM` / Resend domain so claim emails use the
      live `/claim/<token>` origin (`WEB_ORIGIN` is how those links are built)

Contracts stay on Stellar testnet until you explicitly choose mainnet.

---

## 11. Summary checklist

- [ ] GitHub auth is not a leaked token (step 0)
- [ ] Node 20+, pnpm, Docker, Freighter, Rust, Stellar CLI (step 1)
- [ ] Owner + guardian + beneficiary Freighter accounts funded on testnet (step 2)
- [ ] Postgres + Redis running (step 3)
- [ ] `legacy` contract deployed; contract id copied (step 4)
- [ ] R2 bucket + API token created (step 5)
- [ ] Resend API key created (step 6)
- [ ] `JWT_SECRET` and `ENCRYPTION_KEY` generated (step 7)
- [ ] `heirloom-api/.env` complete — including `HEIRLOOM_CONTRACT_ID`, R2, Resend (step 8)
- [ ] `heirloom-web/.env.local` with `NEXT_PUBLIC_DEMO_MODE=false` (step 9)
- [ ] Production hosts filled in if you are going public (step 10)

---

## What’s next

Tell an agent: **run latter.md**

That script installs dependencies, migrates the database, type-checks, tests,
builds, and reports whether the stack is actually live. It will **refuse to
treat missing contract / R2 / Resend / demo-mode-on as “fine”.** You review
and push.
