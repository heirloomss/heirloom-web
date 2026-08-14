# Heirloome — AI-runnable completion script (`latter.md`)

> **For an AI agent**: When the user says "run latter.md," execute every step
> below **in order**. The human has already finished `user_task.md`: Freighter
> accounts are funded, the Soroban contract is deployed, Postgres and Redis are
> running, R2 and Resend keys exist, and both `.env` files are filled. Your job
> is to install, migrate, verify, build, and prove the stack is **live** — not
> mocked. Commit local fixes if needed. **Never push.**

Workspace layout (sibling repos):

```
heirloom/
  heirloom-web/
  heirloom-api/
  heirloom-contracts/
```

If a path differs, locate the three repos and continue. Do not invent env values.

---

## Hard rules

- **Stop on the first real failure.** Report the exact error. Do not skip ahead
  and do not fabricate success.
- **No placeholders.** If `JWT_SECRET` is `change-me…`, `ENCRYPTION_KEY` is all
  zeros, `HEIRLOOM_CONTRACT_ID` is empty, R2 keys are empty, `RESEND_API_KEY` is
  empty, or `NEXT_PUBLIC_DEMO_MODE` is not `false`, **stop** and tell the human
  which `user_task.md` step is still open.
- **No simulated Stellar.** The API must never return fake transaction hashes.
  Missing `HEIRLOOM_CONTRACT_ID` is a 503, not a demo.
- **No demo data in production.** `NEXT_PUBLIC_DEMO_MODE=false` is mandatory.
- **Do not re-enable email/password auth.** It is preserved-but-disabled.
- **Do not add a platform signing key.** Heirloome is self-custodial.
- **Do not `git push`.** The human reviews and pushes.
- **Do not amend** unless the human asked. New commits only.

---

## Step 1: Validate environment files

Read `heirloom-api/.env` and `heirloom-web/.env.local` (never print secret values).

### `heirloom-api/.env` — all required for live

| Variable | Rule |
|---|---|
| `DATABASE_URL` | present |
| `JWT_SECRET` | ≥ 32 chars, not `change-me` |
| `ENCRYPTION_KEY` | 64 hex chars, not all zeros |
| `REDIS_URL` | present |
| `HEIRLOOM_CONTRACT_ID` | starts with `C`, not empty |
| `STELLAR_NETWORK` | `testnet` or `mainnet` |
| `STELLAR_RPC_URL` | present |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | all present |
| `RESEND_API_KEY` | present (`re_…`) |
| `EMAIL_FROM` | present |
| `WEB_ORIGIN` | present |

`STELLAR_SECRET_KEY` must **not** be required. If it is set, warn: the API does
not read it; secrets for signing belong in Freighter / the Stellar CLI identity
only.

### `heirloom-web/.env.local`

| Variable | Rule |
|---|---|
| `NEXT_PUBLIC_API_URL` | present |
| `NEXT_PUBLIC_STELLAR_NETWORK` | present |
| `NEXT_PUBLIC_RPC_URL` | present |
| `NEXT_PUBLIC_DEMO_MODE` | **exactly** `false` |

If anything fails this table, list the gaps and **stop**.

---

## Step 2: Install dependencies

```powershell
cd heirloom-web
corepack pnpm install

cd ../heirloom-api
corepack pnpm install
```

API `postinstall` runs `prisma generate`. If it fails, stop.

---

## Step 3: Database migration

Migrations already exist under `heirloom-api/prisma/migrations/`. Apply them:

```powershell
cd heirloom-api
corepack pnpm run prisma:deploy
```

If Postgres is down, stop and tell the human to run `docker compose up -d`
inside `heirloom-api` (`user_task.md` step 3).

---

## Step 4: Contract build (verify the wasm still compiles)

```powershell
cd heirloom-contracts
cargo test
stellar contract build
```

Do **not** redeploy unless the human asked. The live contract id is already in
`.env`. Building confirms the toolchain matches what was deployed.

If Rust / `stellar` is missing, stop — Drips requires a real contract
(`user_task.md` step 1 and 4).

---

## Step 5: Type-check, lint, tests

```powershell
cd heirloom-web
npx tsc --noEmit
corepack pnpm run lint

cd ../heirloom-api
npx tsc --noEmit
corepack pnpm run lint
corepack pnpm test
```

If types, lint, or tests fail: **fix the code**, re-run the failing command,
then continue. Do not ignore failures. Do not weaken tests to go green.

---

## Step 6: Production builds

```powershell
cd heirloom-web
corepack pnpm run build

cd ../heirloom-api
corepack pnpm run build
```

Both must succeed.

---

## Step 7: Live-stack audit (not optional)

Confirm all of the following in **code + env**, and report each as pass/fail:

1. **Demo mode off** — `NEXT_PUBLIC_DEMO_MODE=false`.
2. **No fake Stellar** — `StellarService` throws 503 when unconfigured; grep
   must not find deterministic fake tx hashes in `heirloom-api/src`.
3. **No platform key** — API does not read `STELLAR_SECRET_KEY`.
4. **R2 storage** — `StorageService` is used for archive + message media.
5. **Resend** — `NotificationsService` sends via Resend when the key is set.
6. **Capsule is live** — `GET /api/claim/:token` plus Freighter claim on
   `/claim/[token]` (not a dead button).
7. **Check-in cascade** — scheduler sends upcoming reminder → two missed
   reminders → then guardians, not an instant “they’re gone.”
8. **Journey endpoint** — `GET /api/legacy/journey` exists and is what the
   dashboard timeline calls.
9. **Web ↔ API mapping** — messages send `content` + `{ kind, value }` release
   rules; documents send Prisma enums; assets send `label` + string `amount`.

If any item fails, fix it in this run, then re-check.

---

## Step 8: Boot smoke (local)

Start both apps (separate terminals / background):

```powershell
cd heirloom-api
corepack pnpm run start:dev

cd heirloom-web
corepack pnpm run dev
```

- `GET http://localhost:4000/api/health` must be 200.
- API logs must show Stellar connected (not “NOT configured”), R2 connected,
  Resend connected. If any log says NOT configured, stop — the matching
  `user_task.md` step is incomplete.
- Open `http://localhost:3000` — login is Freighter, not email.

Do not click through a full on-chain demo yourself unless the human is present
(Freighter prompts need a person). Report that the owner must: connect Freighter
→ add beneficiaries (allocations = 100%) and guardians with wallets → protect
assets → Protect + Fund on the assets page → check in.

---

## Step 9: Commit (do NOT push)

If this run changed files:

```powershell
# In each dirty repo, separately:
git status
git diff
git log -5 --oneline
git add <the files you changed>
git commit -m "..."
```

Commit message: one or two sentences on **why** (live stack, no mocks). Do not
copy an old message about simulated mode. Do not commit `.env` / `.env.local`.

If there is nothing to commit, say so.

**Never `git push`.**

---

## Step 10: Final report

Fill this in honestly:

```
✅ Env validated (contract id, R2, Resend, DEMO_MODE=false).
✅ Dependencies installed (web + API).
✅ Database migrated (prisma:deploy).
✅ Contract tests + wasm build.
✅ Type-check, lint, tests (web + API).
✅ Production builds.
✅ Health check 200. Logs: Stellar / R2 / Resend connected.
✅ Changes committed (or: no local changes).

🔍 Live check:
   • NEXT_PUBLIC_DEMO_MODE=false
   • HEIRLOOM_CONTRACT_ID set (real C… id)
   • R2 configured
   • Resend configured
   • No STELLAR_SECRET_KEY used by the API
   • No fake transaction hashes

📋 Your next steps:
   1. Review commits (git log / git diff origin/main) in all three repos.
   2. Push when satisfied: git push origin main (each repo).
   3. Open http://localhost:3000, connect Freighter, walk the live flow:
      beneficiaries → guardians → assets → Protect + Fund → I'm Here.
   4. Use a second Freighter account as a guardian to approve.
   5. After verification, open the emailed /claim/<token> link as a beneficiary
      and claim with that wallet.
```

If any box is not true, do not say the product is Drips-ready.

---

## Notes for the agent

- Prefer fixing code over documenting workarounds.
- `user_task.md` is the only place humans create cloud accounts and secrets.
- Simulated Stellar, console-only email, and Postgres-as-file-storage are
  **obsolete**. The live stack is Freighter + Soroban + R2 + Resend.
- Email/password routes stay commented with their “do not delete” banners.
