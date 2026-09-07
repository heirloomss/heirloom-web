# Local setup

You need all three repos side by side:

```
heirloom/
  heirloom-contracts/
  heirloom-api/
  heirloom-web/
```

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22 | `heirloom-api` pins pnpm 11.1.2, which needs Node ≥ 22.13 |
| pnpm | 11.1.2 | `corepack enable` picks it up from `packageManager` |
| Docker + Compose | any recent | Postgres 16 + Redis 7 for the API |
| Rust | 1.88.0 | pinned in `heirloom-contracts/rust-toolchain.toml` |
| Stellar CLI | ≥ 22 | `cargo install --locked stellar-cli` |
| Freighter | latest | browser extension, set to Testnet |

## 1. Contract — build, test, deploy

```bash
cd heirloom-contracts
rustup show                       # installs the pinned toolchain
rustup target add wasm32v1-none
cargo test --workspace            # 14 tests
stellar contract build            # wasm hash d52d35a5… — matches the deployed one

# deploy your own copy (optional — a shared testnet contract already exists)
./scripts/init_identity.sh
NETWORK=testnet SOURCE=heirloom-deployer ./scripts/deploy.sh
```

Copy the printed `C…` id — it goes into the API env as `HEIRLOOM_CONTRACT_ID`.

## 2. API — services, env, migrate, run

```bash
cd heirloom-api
corepack enable
pnpm install
docker compose up -d              # postgres:16 on 5432, redis:7 on 6379
cp .env.example .env              # fill every value — see Environment variables
pnpm run prisma:deploy            # apply migrations
pnpm run start:dev                # http://localhost:4000/api
```

Health check: `curl http://localhost:4000/api/health` → `{"status":"ok",…}`.

On boot the logs tell you what is wired:

```
StellarService connected to testnet via https://soroban-testnet.stellar.org.
NotificationsService is NOT configured (missing RESEND_API_KEY). …   # if unset
StorageService is NOT configured (missing R2 credentials). …          # if unset
```

An unconfigured integration is a clear `503` or a logged skip — never a fake
success.

## 3. Web — env, run

```bash
cd heirloom-web
corepack enable
pnpm install
cp .env.example .env.local        # NEXT_PUBLIC_DEMO_MODE=false
pnpm dev                          # http://localhost:3000
```

Set `NEXT_PUBLIC_DEMO_MODE=true` to browse every screen with fabricated sample
data and no API running.

## 4. Test wallets

Each on-chain actor needs their own funded testnet account:

* 1 owner
* 2–3 guardians (they sign `approve_guardian`)
* 1–2 beneficiaries (they sign `claim_assets`)

Create them in Freighter and fund with Friendbot
(`https://friendbot.stellar.org/?addr=<G…>`).

## Verify the stack

Run these in order; each must pass before the next:

```bash
# contracts
cd heirloom-contracts && cargo test --workspace && stellar contract build

# api
cd ../heirloom-api && pnpm install && pnpm run prisma:deploy \
  && pnpm exec tsc --noEmit && pnpm run lint && pnpm test && pnpm run build

# web
cd ../heirloom-web && pnpm install && pnpm exec tsc --noEmit \
  && pnpm run lint && pnpm run build
```

Then boot the API (`pnpm run start:prod`) and check
`GET http://localhost:4000/api/health` returns `200` with the logs showing
`StellarService connected`. A missing contract / R2 / Resend is a clear `503`
or a logged skip — never a fabricated success.
