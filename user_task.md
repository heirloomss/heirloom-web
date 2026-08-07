# Heirloom — Human Setup Tasks (`user_task.md`)

Everything **you** (a human) must do by hand to take Heirloom from a fresh clone
to a real, production-honest running system. None of it can be automated safely
— it involves secrets, an external wallet, funding a testnet account, and
provisioning services. Once these are done, an AI can run `latter.md` to install,
migrate, verify, and build the rest.

This project is three repositories side by side:

```
heirlooms/
  heirloom-web/        Next.js 15 front end (this repo)
  heirloom-api/        NestJS 11 + Prisma + Postgres + Redis + Stellar SDK
  heirloom-contracts/  Soroban `legacy` smart contract (Rust)
```

> **Reality check.** Heirloom does **not** use Pinata/IPFS, Resend, SendGrid, or
> Twilio. Documents are encrypted **server-side** with AES-256-GCM in the API and
> stored in Postgres. Notifications are **console-log only** today (see step 9) —
> a real email/SMS provider is a future swap, not a launch requirement. Any older
> doc mentioning those services was aspirational and has been removed.

---

## 0. Security first — rotate the leaked GitHub token

A GitHub personal access token was pasted into a chat during development. Treat
it as **compromised**.

- [ ] Go to **GitHub → Settings → Developer settings → Personal access tokens**.
- [ ] **Revoke** the exposed token immediately.
- [ ] Generate a **fresh** token (or, better, use SSH keys / the `gh` CLI login).
- [ ] Never paste a token into a prompt again — use `git push` with a credential
      helper or SSH.

---

## 1. Prerequisites

Install these once on your machine.

- [ ] **Node.js 20+** — https://nodejs.org (LTS).
- [ ] **pnpm** via Corepack (ships with Node): `corepack enable`
- [ ] **Docker + Docker Compose** — for Postgres and Redis. https://docs.docker.com
- [ ] **Freighter wallet** browser extension — https://www.freighter.app
- [ ] *(only if you will build/deploy the contract yourself)* **Rust** +
      `wasm32-unknown-unknown` target and the **Stellar CLI**:
      ```bash
      curl https://sh.rustup.rs -sSf | sh
      rustup target add wasm32-unknown-unknown
      cargo install --locked stellar-cli
      ```

---

## 2. Clone the three repositories

The web app needs the API and contracts side-by-side.

```bash
mkdir ~/heirlooms && cd ~/heirlooms
git clone https://github.com/YOUR_ORG/heirloom-web.git
git clone https://github.com/YOUR_ORG/heirloom-api.git
git clone https://github.com/YOUR_ORG/heirloom-contracts.git
```

Replace `YOUR_ORG` with the actual GitHub org/user.

---

## 3. Install Freighter and fund a testnet account

Heirloom's **only** way in is a Freighter wallet signature. There is no
email/password sign-in anymore (that code is preserved but disabled).

- [ ] Install the **Freighter browser extension** from https://www.freighter.app
- [ ] Create or import a Stellar account in Freighter.
- [ ] Fund it on testnet via the **Stellar Laboratory Friendbot**:
      https://laboratory.stellar.org/#account-creator?network=test
      Paste your public key (starts with `G...`) and request XLM.
- [ ] Confirm your account has a balance by checking it on
      https://stellar.expert/explorer/testnet

You will sign in to Heirloom by connecting this wallet. Your signature proves
ownership — no password needed.

---

## 4. Provision Postgres and Redis (Docker Compose)

The API uses **Postgres** (Prisma ORM) and **Redis** (BullMQ scheduler for Life
Check-Ins).

Create `heirlooms/docker-compose.yml`:

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: heirloom
      POSTGRES_PASSWORD: heirloom
      POSTGRES_DB: heirloom
    ports:
      - '5432:5432'
    volumes:
      - heirloom_pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - '6379:6379'

volumes:
  heirloom_pgdata:
```

Start them:

```bash
cd ~/heirlooms
docker compose up -d
```

Confirm they are running: `docker compose ps`

---

## 5. Deploy the Soroban `legacy` contract (optional, or use simulated mode)

The `heirloom-contracts/contracts/legacy` Rust contract handles on-chain legacy
plans (guardian threshold, beneficiary claims). The **API can run without it** —
`StellarService` has a "simulated mode" that returns deterministic fake
transaction hashes when `STELLAR_SECRET_KEY` and `HEIRLOOM_CONTRACT_ID` are
absent. For **production-honest behavior** (real on-chain state), deploy the
contract.

### If you have Rust + `stellar` CLI installed:

```bash
cd ~/heirlooms/heirloom-contracts
stellar contract build
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/legacy.wasm \
  --network testnet \
  --source YOUR_FREIGHTER_SECRET_KEY
```

Save the returned contract ID (starts with `C...`).

### If you skip this step:

The API will log:

```
StellarService running in SIMULATED mode (no STELLAR_SECRET_KEY / HEIRLOOM_CONTRACT_ID).
Returning deterministic fake transaction hashes.
```

The app stays fully runnable — legacy plans, guardian approvals, and beneficiary
claims all return fake hashes and the UI reflects them, but nothing hits the
real Stellar network. **Mark this clearly** if you demo the app to real users.

---

## 6. Generate secrets

### JWT signing secret

The API uses this to sign access tokens.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output.

### AES-256 encryption key

The Digital Archive encrypts documents **server-side** (not in the browser, not
on IPFS) with AES-256-GCM before storing them in Postgres.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the 64-character hex string.

---

## 7. Fill `heirloom-api/.env`

Copy the example and edit it:

```bash
cd ~/heirlooms/heirloom-api
cp .env.example .env
```

Edit `.env`:

```env
PORT=4000
WEB_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://heirloom:heirloom@localhost:5432/heirloom?schema=public

JWT_SECRET=<paste the base64 secret from step 6>
JWT_EXPIRES_IN=7d

ENCRYPTION_KEY=<paste the 64-hex key from step 6>

REDIS_URL=redis://localhost:6379

STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_SECRET_KEY=<your Freighter secret key, or leave blank for simulated mode>
HEIRLOOM_CONTRACT_ID=<the deployed contract ID from step 5, or leave blank for simulated mode>
```

**If `STELLAR_SECRET_KEY` and `HEIRLOOM_CONTRACT_ID` are both blank**, the API
runs in simulated mode (explained in step 5). For production, fill them both.

---

## 8. Fill `heirloom-web/.env.local`

Copy the example and edit it:

```bash
cd ~/heirlooms/heirloom-web
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api

NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org

# DEMO DATA GATE — keep FALSE in production. When false, API errors fall back
# to genuinely empty data (no fabricated "warm" data is ever shown). Reviewers
# exploring the UX with no backend may set this to true.
NEXT_PUBLIC_DEMO_MODE=false
```

**Never commit `.env.local` to git.** It is already in `.gitignore`.

---

## 9. Notifications are console-log only (optional future work)

`heirloom-api/src/notifications/notifications.service.ts` logs "emails" to the
console with the calm product voice. A real provider (Resend, Postmark, AWS SES)
swaps in behind the same method signatures without touching callers.

**You do NOT need Pinata, Resend, SendGrid, or Twilio to run Heirloom.** Any
older doc mentioning them was aspirational and has been removed. When you are
ready to send real emails/SMS, implement one provider and wire it into
`NotificationsService` — the call sites already exist.

---

## 10. Summary checklist

- [ ] GitHub token rotated (step 0).
- [ ] Node 20+, pnpm, Docker, Freighter installed (step 1).
- [ ] Three repos cloned side-by-side (step 2).
- [ ] Freighter funded on testnet (step 3).
- [ ] Postgres + Redis running via Docker Compose (step 4).
- [ ] Soroban `legacy` contract deployed, or deliberately running in simulated
      mode (step 5).
- [ ] `JWT_SECRET` and `ENCRYPTION_KEY` generated (step 6).
- [ ] `heirloom-api/.env` filled (step 7).
- [ ] `heirloom-web/.env.local` filled with `NEXT_PUBLIC_DEMO_MODE=false` (step 8).
- [ ] Notifications understood as console-log placeholders (step 9).

---

## What's next

Once these are done, hand off to `latter.md` — an AI can run it to install
dependencies, migrate the database, build the contract (if Rust is present),
verify types and lint, build both apps, and commit everything. You review and
push when ready.

