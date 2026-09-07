# Economic model

Heirloom's contract does not take a fee. It is an allocation-and-custody
mechanism. All proportional math is integer **basis points** (bps), where
`10_000 bps = 100%`.

## Allocation

At `create_legacy`, each beneficiary gets a `bps` value. The contract enforces:

```
sum(beneficiaries[i].bps) == 10_000
```

Anything else is rejected with `InvalidShares`.

## Split at release

`finalize_release` divides `total_amount` (in token stroops — 1 unit = 10⁻⁷ of
the asset) across beneficiaries:

```
for i in 0..n-1:   amount[i] = total_amount * bps[i] / 10_000     # integer division, truncates
amount[n-1]     = total_amount - sum(amount[0..n-1])              # last one absorbs the remainder
```

Because the last beneficiary takes the remainder, `sum(amount) == total_amount`
exactly — no stroop is created or lost.

## Worked example 1 — clean split

Plan: **5,000 USDC**, three beneficiaries.

| Beneficiary | bps | Share | Amount (USDC) | Amount (stroops) |
| --- | --- | --- | --- | --- |
| Daughter | 5,000 | 50% | 2,500.0000000 | 25,000,000,000 |
| Son | 3,000 | 30% | 1,500.0000000 | 15,000,000,000 |
| Charity | 2,000 | 20% | 1,000.0000000 | 10,000,000,000 |
| **Total** | **10,000** | **100%** | **5,000.0000000** | **50,000,000,000** |

`total_amount = 50,000,000,000` stroops. Each split divides evenly; the last
beneficiary's remainder is 0.

## Worked example 2 — rounding dust

Plan: **1,000 XLM** (`total_amount = 10,000,000,000` stroops), three
beneficiaries at 1/3 each.

You cannot express exactly 1/3 in bps, so the owner sets `3334 / 3333 / 3333`.

| Beneficiary | bps | Calculation | Amount (stroops) | Amount (XLM) |
| --- | --- | --- | --- | --- |
| A | 3,334 | `10,000,000,000 × 3334 / 10000` | 3,334,000,000 | 333.4000000 |
| B | 3,333 | `10,000,000,000 × 3333 / 10000` | 3,333,000,000 | 333.3000000 |
| C (last) | 3,333 | `10,000,000,000 − 6,667,000,000` | 3,333,000,000 | 333.3000000 |
| **Total** | **10,000** | | **10,000,000,000** | **1,000.0000000** |

Here the divisions are exact, so C's "remainder" equals its nominal share. When
they are not exact — e.g. `total_amount = 10,000,000,001` — the truncated stroop
from A and B (`1` stroop each lost to integer division) lands on C, so C would
receive `3,333,000,001 + 2 = 3,333,000,003` and the total still reconciles to
`10,000,000,001`.

The maximum dust routed to the last beneficiary is `n − 1` stroops, i.e. at most
`(number_of_beneficiaries − 1) × 10⁻⁷` of the asset. For a 10-beneficiary plan
that is 9 stroops — 0.0000009 units.

## Costs a user actually pays

| Cost | Who | When | Rough magnitude (testnet) |
| --- | --- | --- | --- |
| `create_legacy` fee | Owner | Plan creation | A few hundred stroops of XLM (Soroban resource fee) |
| `deposit` fee + transfer | Owner | Funding | Soroban fee + the committed amount leaves the wallet |
| `approve_guardian` fee | Each guardian | Verification | Soroban fee only |
| `finalize_release` fee | Whoever calls it | Release | Soroban fee only |
| `claim_assets` fee | Each beneficiary | Claiming | Soroban fee only; the share arrives net of that fee |

Stellar's base fees are a tiny fraction of a cent. There is no protocol rake and
no Heirloom fee in the contract.

## Refund guarantee

While a plan is `Draft`, `Funded`, or `Verified`, the owner can call
`cancel_legacy` and, if funds were deposited, receive **the entire
`total_amount` back** in the same call. The contract clears `deposited` before
changing status, so a refund cannot be replayed.
