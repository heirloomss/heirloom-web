# Plan lifecycle

A legacy plan is a state machine with five states. Every transition is a single
contract call with explicit guards.

## States

| State | Meaning | Funds held by contract? |
| --- | --- | --- |
| `Draft` | Plan registered (guardians, beneficiaries, asset, amount) but not funded. | No |
| `Funded` | Owner has deposited the committed amount. Shown as "Protected". | Yes |
| `Verified` | Guardian approvals reached the threshold. Release is authorized. | Yes |
| `Released` | Amount split into per-beneficiary claims. Withdrawals open. | Yes, until each beneficiary claims |
| `Cancelled` | Owner cancelled before release. Any deposit refunded. | No |

## Transition diagram

```
                     deposit                approve_guardian × threshold
        ┌────────┐   (owner)     ┌────────┐        (guardians)      ┌──────────┐
        │ Draft  │ ────────────▶ │ Funded │ ─────────────────────▶ │ Verified │
        └────────┘               └────────┘                        └──────────┘
             │                        │                                  │
             │ cancel_legacy          │ cancel_legacy                    │ cancel_legacy
             │ (owner, no refund      │ (owner, refunds deposit)         │ (owner, refunds deposit)
             │  — nothing deposited)  │                                  │
             ▼                        ▼                                  │
        ┌───────────┐ ◀──────────────────────────────────────────────────┘
        │ Cancelled │
        └───────────┘

        ┌──────────┐   finalize_release (permissionless)   ┌──────────┐   claim_assets × N
        │ Verified │ ────────────────────────────────────▶ │ Released │ ──────────────────▶ (funds to beneficiaries)
        └──────────┘                                       └──────────┘   (each beneficiary, independently)
```

## Transition rules

### `create_legacy` → `Draft`

* `owner.require_auth()`.
* `total_amount > 0`.
* `guardians` non-empty, no duplicates.
* `1 ≤ threshold ≤ guardians.len()`.
* `beneficiaries` non-empty, no duplicate addresses, `bps` values sum to exactly
  `10_000`.
* Returns the new `legacy_id` (`u64`, monotonic).

### `deposit` → `Funded`

* `plan.owner.require_auth()`.
* Plan must be `Draft` and not already `deposited`.
* Pulls `total_amount` via `token.transfer(owner → contract)`. The owner must
  have authorized the transfer/allowance in the same signed envelope.
* Sets `deposited = true`.

### `approve_guardian` → stays `Funded`, or → `Verified`

* `guardian.require_auth()`.
* Plan must be `Funded`.
* Caller must be in `plan.guardians`; otherwise `NotGuardian`.
* Caller must not have approved already; otherwise `AlreadyApproved`.
* When `approvals.len() ≥ threshold`, status flips to `Verified` in the same
  call.

### `finalize_release` → `Released`

* **No `require_auth()`.** By the time a plan is `Verified`, the owner is
  presumed gone, so anyone may finalize.
* Plan must be `Verified` and `deposited`.
* The contract's live token balance must be `≥ total_amount`; otherwise
  `InsufficientBalance`. This closes the underfunded-release loophole even if a
  token misbehaves.
* Splits `total_amount` by `bps`: for each beneficiary except the last,
  `amount = total_amount * bps / 10_000` (integer division). The **last
  beneficiary absorbs the remainder**, so the sum of claims always equals
  `total_amount` exactly.
* Writes one `ClaimData { token, amount, claimed: false }` per beneficiary.

### `claim_assets` → stays `Released`

* `beneficiary.require_auth()`.
* Plan must be `Released`.
* The caller must have a `ClaimData` with `claimed == false` and `amount > 0`;
  otherwise `AlreadyClaimed` or `NothingToClaim`.
* Transfers `amount` from the contract to the beneficiary, then sets
  `claimed = true` (only after the transfer succeeds). Returns the amount.

### `cancel_legacy` → `Cancelled`

* `plan.owner.require_auth()`.
* Allowed from `Draft`, `Funded`, or `Verified`. **Never** from `Released` or
  `Cancelled` (`InvalidStatus`).
* If `deposited`, the full `total_amount` is transferred back to the owner and
  `deposited` is cleared before the status changes — a cancelled plan never
  strands funds.

## Storage and TTL

* The plan counter and each `LegacyPlan` live in **instance** storage; the
  contract extends its instance TTL on every state-changing call.
* Approvals and `ClaimData` live in **persistent** storage keyed by
  `legacy_id` (and beneficiary address for claims), with TTL bumped on write so
  long-running inheritance timelines are not archived out from under a plan.
