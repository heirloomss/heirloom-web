# Heirloom — AI-runnable completion script (`latter.md`)

> **For an AI agent**: When the user says "run latter.md," execute every step
> below in order. This script finishes what `user_task.md` started — it installs
> dependencies, migrates the database, verifies types and lint, builds both apps,
> and honestly reports what worked and what requires manual intervention. It
> commits the result but **never pushes** (the user reviews and pushes).

---

## Context

You are working with three repositories side by side in `~/heirlooms`:

- `heirloom-web` — Next.js 15 front end (TypeScript, TanStack Query, Tailwind)
- `heirloom-api` — NestJS 11 API (Prisma, Postgres, Redis, Stellar SDK)
- `heirloom-contracts` — Soroban `legacy` smart contract (Rust)

The human has completed `user_task.md`: Freighter is installed and funded,
Postgres and Redis are running (Docker), `heirloom-api/.env` and
`heirloom-web/.env.local` are filled, and secrets are generated. Your job is to
install, migrate, verify, build, and commit.

---

## Step 1: Validate environment files

Check that the required environment variables are set.

### `heirloom-api/.env`

Required (production-honest):
- `DATABASE_URL`
- `JWT_SECRET` (at least 32 characters)
- `ENCRYPTION_KEY` (64 hex characters)
- `REDIS_URL`

Optional (presence determines simulated vs real Stellar):
- `STELLAR_SECRET_KEY` — if absent, StellarService runs in **simulated mode**
  (deterministic fake transaction hashes). Mark this clearly if it is absent.
- `HEIRLOOM_CONTRACT_ID` — same: if absent, the API stays in simulated mode.

If `JWT_SECRET` or `ENCRYPTION_KEY` are missing or look like placeholders
(`change-me`, `0000...`), stop and tell the user to run step 6 of `user_task.md`.

### `heirloom-web/.env.local`

Required:
- `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`)
- `NEXT_PUBLIC_STELLAR_NETWORK` (testnet or mainnet)
- `NEXT_PUBLIC_RPC_URL` (Stellar Soroban RPC)
- `NEXT_PUBLIC_DEMO_MODE` — must be `false` for production. If it is `true` or
  missing, warn the user: when true, API errors fall back to fabricated "warm"
  demo data instead of genuinely empty values.

If any required var is missing, list what is missing and stop.

---

## Step 2: Install dependencies (web + API)

Both use `pnpm` via corepack.

```bash
cd ~/heirlooms/heirloom-web
corepack pnpm install

cd ~/heirlooms/heirloom-api
corepack pnpm install
```

The API's `postinstall` script runs `prisma generate` automatically. If it
fails, report the error and stop.

---

## Step 3: Database migration

The `heirloom-api` Prisma schema has no committed migrations directory yet, so
the first run must use `migrate dev` (creates the migration + applies it).
Subsequent runs can use `migrate deploy` (applies existing migrations only).

```bash
cd ~/heirlooms/heirloom-api
# First run (no prisma/migrations/ directory):
corepack pnpm run prisma:migrate
# The script will prompt for a migration name; suggest "init" or let it default.

# OR, if migrations/ already exists:
corepack pnpm run prisma:deploy
```

If Postgres is unreachable or the migration fails, report the error and stop.

---

## Step 4: Contract build (Rust, optional)

If `cargo` and `stellar` CLI are installed, build and optionally deploy the
Soroban `legacy` contract. If Rust is absent, skip this step — the human can
deploy later or run in simulated mode.

```bash
cd ~/heirlooms/heirloom-contracts
cargo --version && stellar --version
# If both succeed:
stellar contract build
# Produces target/wasm32-unknown-unknown/release/legacy.wasm

# Deploying requires STELLAR_SECRET_KEY; only attempt if the user confirmed
# they want to deploy now. Otherwise, just build and stop here.
```

If Rust is absent, log:

```
Rust + stellar CLI not found; skipping contract build. The API will run in
simulated mode (fake tx hashes) unless STELLAR_SECRET_KEY and
HEIRLOOM_CONTRACT_ID are set. This is expected and fully runnable — just not
hitting the real Stellar network.
```

---

## Step 5: Type-check and lint (web + API)

Run `tsc --noEmit` and lint in both repos. Report every error; do not proceed to
build if types fail.

```bash
cd ~/heirlooms/heirloom-web
npx tsc --noEmit
corepack pnpm run lint

cd ~/heirlooms/heirloom-api
npx tsc --noEmit
corepack pnpm run lint
```

If types or lint fail, report the exact errors. Do not continue to step 6.

---

## Step 6: Build (web + API)

```bash
cd ~/heirlooms/heirloom-web
corepack pnpm run build

cd ~/heirlooms/heirloom-api
corepack pnpm run build
```

If the web build fails, report the errors. If the API build fails, report them.
Both must succeed for production deployment.

---

## Step 7: Reality check — what is mocked?

Audit the running state and report honestly:

- **NEXT_PUBLIC_DEMO_MODE**: is it `false`? If `true`, warn: "Demo mode is ON.
  API errors will fall back to fabricated data instead of genuinely empty
  values. Set `NEXT_PUBLIC_DEMO_MODE=false` in `.env.local` for production."

- **Stellar simulation**: are `STELLAR_SECRET_KEY` and `HEIRLOOM_CONTRACT_ID`
  both set in `heirloom-api/.env`? If either is absent, report: "StellarService
  is running in SIMULATED mode. Legacy plans, guardian approvals, and
  beneficiary claims return deterministic fake transaction hashes. Nothing hits
  the real Stellar network. To use the real network, deploy the Soroban contract
  (step 5 of `user_task.md`) and fill both env vars."

- **Notifications**: report: "Notifications are console-log only
  (`src/notifications/notifications.service.ts`). Check-in reminders, guardian
  alerts, and beneficiary notifications are logged to the API console with the
  calm product voice, but no real emails/SMS are sent. A real provider (Resend,
  Postmark, SES) swaps in behind the same method signatures when you are ready."

---

## Step 8: Commit (do NOT push)

Stage and commit all changes in `heirloom-web` with a descriptive message. The
user reviews and pushes manually.

```bash
cd ~/heirlooms/heirloom-web
git add .
git commit -m "feat: Freighter-only auth, demo-mode gating, reality-based docs

- Freighter wallet login as the only way into the dashboard (cryptographic
  challenge/signature via ed25519); email/password auth preserved but disabled
  with AI-removal warning banners.
- Demo-mode gating: NEXT_PUBLIC_DEMO_MODE=false (production default) ensures
  API errors fall back to genuinely empty data, never fabricated warm data.
- Rewrote user_task.md and latter.md to reflect the actual architecture
  (server-side AES-256 encryption, console-log notifications, no Pinata/Resend/
  Twilio).
- Added @stellar/freighter-api dependency, AuthGuard, real wallet services.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

If `heirloom-api` or `heirloom-contracts` have uncommitted changes, commit them
too with co-authorship trailers.

Do **not** run `git push`. The user will review the commits and push when ready.

---

## Step 9: Final report

Summarize what was done and what the user must do next:

```
✅ Dependencies installed (web + API).
✅ Database migrated (Prisma).
[✅ or ⚠️] Contract built [or skipped — Rust not found].
✅ Type-check and lint passed (web + API).
✅ Production builds succeeded (web + API).
✅ Changes committed in heirloom-web (and heirloom-api/contracts if modified).

🔍 Reality check:
   • NEXT_PUBLIC_DEMO_MODE: [false ✅ | true ⚠️ set to false for production]
   • Stellar: [REAL network ✅ | SIMULATED ⚠️ (no STELLAR_SECRET_KEY or CONTRACT_ID)]
   • Notifications: console-log only (optional future: wire a real provider)

📋 Next steps for you:
   1. Review the commits:
        cd ~/heirlooms/heirloom-web && git log --oneline -5
        cd ~/heirlooms/heirloom-api && git log --oneline -5
        cd ~/heirlooms/heirloom-contracts && git log --oneline -5
   2. Inspect the diffs vs origin/main:
        git diff origin/main
   3. When satisfied, push:
        git push origin main
   4. ROTATE THE GITHUB TOKEN you pasted earlier — it is compromised. Generate
      a fresh one (or use SSH) before your next push.
   5. Start the API:
        cd ~/heirlooms/heirloom-api && corepack pnpm run start:dev
   6. Start the web app:
        cd ~/heirlooms/heirloom-web && corepack pnpm run dev
   7. Open http://localhost:3000, connect your Freighter wallet, and sign in.

🎉 Heirloom is production-ready (modulo optional notifications and real Stellar
   if you want them). No mocks, no stale docs, no loose ends.
```

---

## Notes for the AI running this script

- **Honest reporting**: If a step fails, say exactly what failed and stop. Do
  not proceed to later steps or fabricate success.
- **No assumptions**: If an env var looks like a placeholder, stop and ask. Do
  not guess or auto-generate secrets.
- **Manual push**: Never run `git push`. The user reviews commits first.
- **Simulated mode is not a bug**: If `STELLAR_SECRET_KEY`/`CONTRACT_ID` are
  absent, StellarService deliberately runs in simulated mode (returning fake tx
  hashes). Report this as expected behavior, not an error, and note that the app
  is fully runnable this way — just not hitting the real network.
