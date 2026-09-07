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

- [x] **Node.js 20+** — ✅ nvm default now `v20.20.2` (was v18.19.1; `/usr/bin/node` v18 still on PATH — use a login shell so nvm wins)
- [x] **pnpm** via Corepack — ✅ pnpm `12.3.4` active
- [ ] **Docker** — ❌ not installed. `sudo apt install -y docker.io docker-compose-v2 && sudo usermod -aG docker $USER` (then re-login)
- [ ] **Freighter** browser extension — https://www.freighter.app — *install in your own Chrome*
- [x] **Rust** + wasm target + **Stellar CLI** — ✅ rustc 1.97.1, `wasm32v1-none` target, stellar-cli 27.1.0 all present

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

- [x] ✅ **DONE (testnet, 2026-09-07).**
      Contract id: `CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE`
      Deployer identity `heirloom-deployer` (`GC3LHAXATEX724O356S6ERSFO6B64HGGJWUCORSUFAPSFQVVRTI6UZUT`),
      Friendbot-funded, key in `~/.config/stellar/identity/`.
      Wasm hash `d52d35a5cb25c249dfcbdb8602435bdaee43bde07254f44198c2793ba4bfad80`.
      Deploy tx: https://stellar.expert/explorer/testnet/tx/c1c58e40f734f618c99a9456c4f802be7344e27d7950842e74f90bf349af1844
- [x] Written into `heirloom-api/.env` as `HEIRLOOM_CONTRACT_ID` (and `heirloom-contracts/.env`).
- [x] Toolchain note: `rust-toolchain.toml` bumped `1.85.0 → 1.88.0` (transitive deps
      `darling 0.23` / `serde_with 3.21` now need rustc ≥ 1.88).
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

> **SKIPPED for now** — R2 activation requires a card on file. Come back to this;
> uploads/downloads return 503 until `R2_*` is filled.

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

> **SKIPPED for now** — revisit. Emails are logged-only until `RESEND_API_KEY` is set.

---

## 7. Generate secrets

- [x] ✅ **DONE.** `JWT_SECRET` (base64) and `ENCRYPTION_KEY` (64 hex) generated and
      already written into `heirloom-api/.env`.
- [x] `.env` is covered by `.gitignore` — never committed.

---

## 8. Fill `heirloom-api/.env`

- [x] `heirloom-api/.env` created from `.env.example`.
- [x] Filled: `PORT`, `WEB_ORIGIN`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
      `ENCRYPTION_KEY`, `REDIS_URL`, `CHECK_IN_REMINDER_GAP_HOURS`, `STELLAR_NETWORK`,
      `STELLAR_RPC_URL`, `EMAIL_FROM`.
- [ ] **Still blank — need real values:** `HEIRLOOM_CONTRACT_ID` (step 4),
      `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` (step 5),
      `RESEND_API_KEY` (step 6).

Reference — every value should end up real:

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

- [x] ✅ **DONE.** `heirloom-web/.env.local` created with `NEXT_PUBLIC_API_URL`,
      `NEXT_PUBLIC_STELLAR_NETWORK`, `NEXT_PUBLIC_RPC_URL`, and
      `NEXT_PUBLIC_DEMO_MODE=false`. Covered by `.gitignore`.

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
- [ ] Node 20+, pnpm ✅ · Rust + Stellar CLI ✅ · **Docker ❌** · Freighter ❌ (step 1)
- [ ] Owner + guardian + beneficiary Freighter accounts funded on testnet (step 2)
- [ ] Postgres + Redis running (step 3)
- [x] `legacy` contract deployed; contract id copied (step 4) ✅ `CAA55GCID6...XUNE`
- [ ] R2 bucket + API token created (step 5)
- [ ] Resend API key created (step 6)
- [x] `JWT_SECRET` and `ENCRYPTION_KEY` generated (step 7) ✅
- [ ] `heirloom-api/.env` complete — base values ✅; still need `HEIRLOOM_CONTRACT_ID`, R2, Resend (step 8)
- [x] `heirloom-web/.env.local` with `NEXT_PUBLIC_DEMO_MODE=false` (step 9) ✅
- [ ] Production hosts filled in if you are going public (step 10)

---

## What’s next

Tell an agent: **run latter.md**

That script installs dependencies, migrates the database, type-checks, tests,
builds, and reports whether the stack is actually live. It will **refuse to
treat missing contract / R2 / Resend / demo-mode-on as “fine”.** You review
and push.
