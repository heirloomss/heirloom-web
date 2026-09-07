# REST API reference

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`). All routes
are under `/api`.

Auth: every route except `health` and `auth/*` requires
`Authorization: Bearer <jwt>`. Mutations also append an entry to the Family
Timeline (`ActivityLog`).

## Health

### `GET /api/health`

```json
200 OK
{ "status": "ok", "service": "heirloom-api", "timestamp": "2026-09-07T15:52:44.325Z" }
```

## Auth (Freighter wallet)

Email/password routes exist in the code but are disabled on purpose.

### `POST /api/auth/wallet/challenge`

```json
// request
{ "walletAddress": "GB...56CHARS" }        // must match /^G[A-Z2-7]{55}$/

// 200 OK — a human-readable message to sign in Freighter
{ "message": "Heirloom sign-in for GB...  nonce: <random>  issued: <iso>" }
```

Rate limited to 10 / minute.

### `POST /api/auth/wallet/verify`

```json
// request
{ "walletAddress": "GB...56CHARS", "signature": "<base64 ed25519 signature of the challenge>" }

// 200 OK
{ "token": "<jwt>", "user": { "id": "…", "walletAddress": "GB…", "name": null } }
```

The server verifies the ed25519 signature, creates or fetches the user by
`walletAddress`, and issues a 7-day JWT.

### `GET /api/auth/me`  ·  `POST /api/auth/logout`  ·  `POST /api/auth/link-wallet`

`me` returns the current user. `logout` is a courtesy 200 (JWTs are stateless —
the client discards the token). `link-wallet` attaches a wallet to the current
account.

## Resources

All of these follow the same REST shape. Bodies are validated with
`class-validator`; unknown fields are stripped.

| Resource | Routes |
| --- | --- |
| Users | `GET /users/me` · `PATCH /users/me` |
| Beneficiaries | `GET /beneficiaries` · `POST /beneficiaries` · `GET /beneficiaries/:id` · `PATCH /beneficiaries/:id` · `DELETE /beneficiaries/:id` |
| Guardians | `GET /guardians` · `POST /guardians` · `GET/PATCH/DELETE /guardians/:id` |
| Assets | `GET /assets` · `POST /assets` · `GET/PATCH/DELETE /assets/:id` |
| Archive | `POST /archive` (multipart) · `GET /archive` · `GET /archive/:id/download` · `DELETE /archive/:id` |
| Messages | `GET /messages` · `POST /messages` · `GET/PATCH/DELETE /messages/:id` |
| Activity | `GET /activity` |
| Legacy | `GET /legacy` · `GET /legacy/journey` · `GET /legacy/claims` + verification/claim orchestration |

### Example: create a beneficiary

```json
// POST /api/beneficiaries
{
  "name": "Sarah",
  "relationship": "Daughter",
  "email": "sarah@example.com",
  "allocationPercentage": 40
}

// 201 Created
{
  "id": "clz…",
  "userId": "clu…",
  "name": "Sarah",
  "relationship": "Daughter",
  "email": "sarah@example.com",
  "allocationPercentage": 40,
  "claimToken": "…64 hex…",     // minted server-side; the key to this beneficiary's capsule
  "createdAt": "2026-09-07T…"
}
```

`claimToken` is generated on the server (32 random bytes, hex). It is the only
key to `GET /api/claim/:token` and is never returned in logs.

### Web ↔ API field contracts

The frontend and API agree on these shapes:

* **Messages** send `content` plus a release rule `{ kind, value }`.
* **Documents** send Prisma enum values for type/category.
* **Assets** send a `label` and a **string** `amount` (never a float).

## Public capsule (no JWT, token-gated)

### `GET /api/claim/:token`

Returns the guided capsule payload for a released plan: the beneficiary's
messages and document list, gated until the plan is `Released`.

Sub-routes:

* `GET /api/claim/:token/documents/:id/download` — decrypts and streams a filed
  document.
* `GET /api/claim/:token/messages/:id/media` — decrypts a voice/video/photo.
* `POST /api/claim/:token/release/build` — returns unsigned XDR for
  `finalize_release`.
* `POST /api/claim/:token/claim/build` — returns unsigned XDR for
  `claim_assets`.
* `POST /api/claim/:token/submit` — relays a beneficiary-signed transaction to
  Soroban RPC.

## On-chain endpoints and 503

Any endpoint that builds a contract transaction returns **HTTP 503** when
`HEIRLOOM_CONTRACT_ID` is unset. It never returns a fabricated transaction hash.
Archive upload/download return **503** when R2 is unconfigured. Email is skipped
and logged when `RESEND_API_KEY` is unset.

## Errors

Validation failures return `400` with `class-validator` messages. Auth failures
return `401`. Cross-user access returns `404` (not `403`, to avoid leaking
existence). Contract errors are surfaced with their numeric code — see
[Error codes](../contracts/errors.md).
