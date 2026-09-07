# `legacy` contract reference

Soroban contract. Source: [`heirloom-contracts/contracts/legacy`](https://github.com/heirloomss/heirloom-contracts/tree/main/contracts/legacy).

| | |
| --- | --- |
| Network | Stellar testnet |
| Contract ID | `CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE` |
| Wasm hash | `d52d35a5cb25c249dfcbdb8602435bdaee43bde07254f44198c2793ba4bfad80` |
| SDK | `soroban-sdk` 22 |
| Build target | `wasm32v1-none` |

## Types

### `LegacyStatus` (enum)

`Draft` · `Funded` · `Verified` · `Released` · `Cancelled`

### `BeneficiaryShare`

| Field | Type | Notes |
| --- | --- | --- |
| `beneficiary` | `Address` | Who may claim this share |
| `bps` | `u32` | Allocation in basis points; all shares in a plan sum to `10_000` |

### `LegacyPlan`

| Field | Type | Notes |
| --- | --- | --- |
| `owner` | `Address` | Creator; controls deposit and cancel |
| `guardians` | `Vec<Address>` | Distinct; can approve verification |
| `threshold` | `u32` | Approvals needed for `Funded → Verified` (`1..=guardians.len()`) |
| `beneficiaries` | `Vec<BeneficiaryShare>` | Distinct addresses; `bps` sum `= 10_000` |
| `status` | `LegacyStatus` | Current state |
| `token` | `Address` | SEP-41 token the plan is funded in and pays out |
| `total_amount` | `i128` | Committed amount, in stroops; `> 0` |
| `deposited` | `bool` | Whether the contract currently holds the deposit |

### `ClaimData`

| Field | Type | Notes |
| --- | --- | --- |
| `token` | `Address` | Payout token |
| `amount` | `i128` | Beneficiary's allocation in stroops |
| `claimed` | `bool` | Set once withdrawn |

## Functions

### `create_legacy`

```rust
fn create_legacy(
    env: Env,
    owner: Address,
    token: Address,
    total_amount: i128,
    guardians: Vec<Address>,
    threshold: u32,
    beneficiaries: Vec<BeneficiaryShare>,
) -> Result<u64, Error>
```

Registers a plan in `Draft`. **No funds move.**

* **Auth:** `owner.require_auth()`
* **Validates:** `total_amount > 0` (`InvalidInput`); `guardians` non-empty
  (`InvalidInput`); `1 ≤ threshold ≤ guardians.len()` (`InvalidInput`); no
  duplicate guardian or beneficiary address (`DuplicateAddress`); `beneficiaries`
  non-empty and `bps` sum `= 10_000` (`InvalidShares`)
* **Returns:** the new `legacy_id` (`u64`, monotonic from 1)
* **Events:** `("created", owner) → (legacy_id, threshold)`

### `deposit`

```rust
fn deposit(env: Env, legacy_id: u64) -> Result<(), Error>
```

Pulls `total_amount` from the owner into the contract. `Draft → Funded`.

* **Auth:** `plan.owner.require_auth()`
* **Requires:** status `Draft` (`InvalidStatus`); `!deposited` (`AlreadyFunded`)
* **Effect:** `token.transfer(owner → contract, total_amount)`; sets
  `deposited = true`
* **Events:** `("deposited", owner) → (legacy_id, total_amount)`

### `approve_guardian`

```rust
fn approve_guardian(env: Env, legacy_id: u64, guardian: Address) -> Result<(), Error>
```

Records one guardian approval. Flips to `Verified` when the threshold is met.

* **Auth:** `guardian.require_auth()`
* **Requires:** status `Funded` (`InvalidStatus`); `guardian ∈ plan.guardians`
  (`NotGuardian`); guardian has not approved before (`AlreadyApproved`)
* **Effect:** appends to the approvals list; if
  `approvals.len() ≥ threshold`, sets status `Verified`
* **Events:** `("approved", guardian) → (legacy_id, approvals_count)`; then, on
  threshold, `("verified",) → legacy_id`

### `finalize_release`

```rust
fn finalize_release(env: Env, legacy_id: u64) -> Result<(), Error>
```

Splits the deposit into per-beneficiary claims. `Verified → Released`.
**Permissionless.**

* **Auth:** none
* **Requires:** status `Verified` (`InvalidStatus`); `deposited` (`NotFunded`);
  live contract token balance `≥ total_amount` (`InsufficientBalance`)
* **Effect:** for each beneficiary except the last,
  `amount = total_amount * bps / 10_000`; the last beneficiary gets
  `total_amount − Σ(previous)`. Writes one `ClaimData` per beneficiary. Sets
  status `Released`.
* **Events:** `("released", token) → (legacy_id, total_amount)`

### `claim_assets`

```rust
fn claim_assets(env: Env, legacy_id: u64, beneficiary: Address) -> Result<i128, Error>
```

Withdraws the caller's share.

* **Auth:** `beneficiary.require_auth()`
* **Requires:** status `Released` (`InvalidStatus`); a `ClaimData` for the
  caller (`NotFound`); `!claimed` (`AlreadyClaimed`); `amount > 0`
  (`NothingToClaim`)
* **Effect:** `token.transfer(contract → beneficiary, amount)`; sets
  `claimed = true` **after** the transfer
* **Returns:** the amount transferred
* **Events:** `("claimed", beneficiary) → (legacy_id, amount)`

### `cancel_legacy`

```rust
fn cancel_legacy(env: Env, legacy_id: u64) -> Result<(), Error>
```

Ends a pre-release plan, refunding any deposit. `→ Cancelled`.

* **Auth:** `plan.owner.require_auth()`
* **Requires:** status in {`Draft`, `Funded`, `Verified`} (`InvalidStatus`
  otherwise — cannot cancel after `Released`)
* **Effect:** if `deposited`, `token.transfer(contract → owner, total_amount)`
  and clear `deposited`; then set status `Cancelled`
* **Events:** if refunded, `("refunded", owner) → (legacy_id, total_amount)`;
  then `("cancelled", owner) → legacy_id`

### Read-only getters

```rust
fn get_legacy(env: Env, legacy_id: u64) -> Result<LegacyPlan, Error>   // NotFound if absent
fn get_approvals(env: Env, legacy_id: u64) -> Vec<Address>             // empty if none
fn get_claim(env: Env, legacy_id: u64, beneficiary: Address) -> Result<ClaimData, Error>  // NotFound if absent
```

No auth. Safe to call from anywhere.

## Full call order (happy path)

```
create_legacy  (owner)          -> id
deposit        (owner)          -> Funded
approve_guardian (guardian #1)  -> Funded
approve_guardian (guardian #2)  -> Verified        # threshold = 2
finalize_release (anyone)       -> Released
claim_assets   (beneficiary #1) -> amount
claim_assets   (beneficiary #2) -> amount
...
```

## Invoking from the CLI

```bash
stellar contract invoke \
  --id CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE \
  --source <identity> \
  --network testnet \
  -- get_legacy --legacy_id 1
```

See [`scripts/invoke_examples.sh`](https://github.com/heirloomss/heirloom-contracts/blob/main/scripts/invoke_examples.sh)
for templates of every function.
