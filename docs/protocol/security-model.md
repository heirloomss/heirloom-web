# Trust and security model

## What you must trust

| You trust | Why | If it fails |
| --- | --- | --- |
| Your guardians (as a group) | A threshold of them can move a `Funded` plan to `Verified`. | A colluding threshold could verify while you are alive. Mitigation: the owner can `cancel_legacy` and refund at any time before release, and reminders/notifications make premature verification visible. |
| The Soroban contract code | It custodies the deposit and enforces the state machine. | Covered by tests; **unaudited**. Testnet only. |
| Stellar consensus and the token contract | Standard L1 assumptions plus the SEP-41 token you fund with. | Out of scope for Heirloom. |
| Your own keys (owner, each guardian, each beneficiary) | Every non-permissionless call needs a signature. | A lost key behaves like a lost key anywhere. |

## What you do *not* have to trust

* **Heirloom the company.** It holds no signing key and cannot move the deposit.
  It can stop sending emails; it cannot stop a claim.
* **The API host.** Compromise exposes app metadata and *encrypted* blobs. It
  cannot forge an on-chain action.
* **The frontend.** It only relays. The transaction Freighter shows you is the
  transaction that executes.

## Authorization matrix

| Function | Auth required | Enforced by |
| --- | --- | --- |
| `create_legacy` | `owner` | `require_auth()` |
| `deposit` | `plan.owner` | `require_auth()` + `Draft` + `!deposited` |
| `approve_guardian` | the `guardian` calling | `require_auth()` + membership in `plan.guardians` + no prior approval |
| `finalize_release` | **none** | on-chain state: `Verified` + `deposited` + balance ≥ `total_amount` |
| `claim_assets` | the `beneficiary` calling | `require_auth()` + `Released` + unclaimed `ClaimData` |
| `cancel_legacy` | `plan.owner` | `require_auth()` + status in {`Draft`,`Funded`,`Verified`} |
| `get_legacy` / `get_approvals` / `get_claim` | none (read-only) | — |

## Design decisions that matter

### Permissionless release

Once a plan is `Verified`, requiring a specific caller for `finalize_release`
would create a liveness dependency — if that party is unavailable, funds are
stuck. Because the payout targets are already fixed (the recorded `ClaimData`),
letting anyone finalize adds no attack surface: the caller cannot redirect a
single stroop.

### Balance check before release

`finalize_release` re-reads the contract's actual token balance and refuses if
it is below `total_amount`. This means a plan cannot open claims it can't honour
even if the funding token behaved unexpectedly.

### Claim-then-mark ordering

`claim_assets` transfers first and sets `claimed = true` only after the transfer
returns. A failed transfer leaves the claim withdrawable rather than burning it.

### No floats, typed errors

All math is integer bps. Every failure is a stable `u32` error code (see
[Error codes](../contracts/errors.md)) that off-chain clients match on; codes
are never reordered or reused.

### Claim tokens (off-chain)

The beneficiary capsule link uses a 32-byte random token. It grants **viewing**
of messages and documents, never spending — taking assets still needs the
beneficiary's wallet signature on `claim_assets`. Tokens are never written to
logs, URLs in analytics, or emails beyond the single capsule link.

## Known limitations

* Unaudited. Do not put mainnet value in it yet.
* Guardian collusion at threshold is a live risk until release; the owner's
  cancel/refund right is the counterweight.
* One asset per plan (committed at creation so deposit and payout can't
  disagree).
* No partial cancellation — cancel refunds the whole deposit and ends the plan.
