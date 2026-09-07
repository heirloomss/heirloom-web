# Deployment

## Service topology

| Piece | Host | Why there |
| --- | --- | --- |
| `heirloom-web` | Vercel | Purpose-built for Next.js; edge/SSR handled for you |
| `heirloom-api` | Render (Web Service) | Long-running Node process + managed Postgres/Redis in one place |
| PostgreSQL, Redis | Render | Co-located with the API; use the internal connection strings |
| `legacy` contract | Stellar testnet | Deployed from `heirloom-contracts` |

```
user ──▶ heirloom-web (Vercel) ──▶ heirloom-api (Render) ──▶ Postgres / Redis (Render)
                     └──────────────────────────────────────▶ Soroban RPC ──▶ legacy contract
                              (Freighter-signed contract writes go direct)
```

## 1. Deploy the contract

```bash
cd heirloom-contracts
./scripts/init_identity.sh
NETWORK=testnet SOURCE=heirloom-deployer ./scripts/deploy.sh
```

Copy the printed contract id (`C…`). `stellar contract build` reproduces the
wasm hash, so anyone can verify the deployed code.

Current testnet deployment:

```
contract id: CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE
wasm hash:   d52d35a5cb25c249dfcbdb8602435bdaee43bde07254f44198c2793ba4bfad80
```

## 2. Deploy the API (Render)

1. **PostgreSQL** — create a Render Postgres instance. Note the *internal*
   `DATABASE_URL`.
2. **Redis** — create a Render Key Value (Redis) instance. Note the *internal*
   `REDIS_URL`.
3. **Web Service** — from the `heirloom-api` repo:
   * Root directory: `.` (repo root)
   * Build command: `corepack enable && pnpm install && pnpm run build`
   * Start command: `pnpm run start:prod`
   * Runtime: Node 22
4. **Environment** — set every variable from
   [Environment variables](environment.md): the production `DATABASE_URL`,
   `REDIS_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`, `STELLAR_*`,
   `HEIRLOOM_CONTRACT_ID`, `R2_*`, `RESEND_API_KEY`, `EMAIL_FROM`, and
   `WEB_ORIGIN` (set this once the web URL exists).
5. **Migrate** — run `pnpm run prisma:deploy` as a one-off job or release
   command.

## 3. Deploy the web app (Vercel)

1. Import the `heirloom-web` repo (framework preset: Next.js).
2. Environment variables:
   * `NEXT_PUBLIC_API_URL` = `https://<your-api>.onrender.com/api`
   * `NEXT_PUBLIC_STELLAR_NETWORK` = `testnet`
   * `NEXT_PUBLIC_RPC_URL` = `https://soroban-testnet.stellar.org`
   * `NEXT_PUBLIC_DEMO_MODE` = `false`
3. Deploy. Copy the resulting URL.

## 4. Close the loop

* Set `WEB_ORIGIN` on the API to the Vercel URL (comma-separate `localhost:3000`
  if you still develop locally). This is also what builds the
  `/claim/<token>` links in emails, so it must be the public origin.
* If you verified a domain in Resend, set `EMAIL_FROM` to
  `Heirloome <hello@yourdomain>`.

## Common failure: frontend still calls `localhost` in production

`NEXT_PUBLIC_*` values are inlined at **build time**. If you set
`NEXT_PUBLIC_API_URL` after the first deploy, redeploy so the new value is baked
in. Don't work around it with a runtime shim — fix the build env and rebuild.

## Going to mainnet

Not yet. The contract is unaudited. When you do: deploy the contract to mainnet,
change `STELLAR_NETWORK`/`STELLAR_RPC_URL`/`NEXT_PUBLIC_*` to mainnet values,
fund with a real SEP-41 token, and complete an audit first.
