# Error codes

The contract returns a `#[contracterror]` enum. Each variant is a stable `u32`.
Codes are never reordered or reused, so off-chain clients can match on the
number.

| Code | Name | Meaning | Typically from |
| --- | --- | --- | --- |
| 1 | `NotFound` | The plan or a sub-record (approval set, claim) does not exist. | `get_legacy`, `get_claim`, `claim_assets` |
| 2 | `NotAuthorized` | Caller is not permitted to perform this action. | reserved / auth paths |
| 3 | `AlreadyApproved` | This guardian has already approved this plan. | `approve_guardian` |
| 4 | `NotGuardian` | Caller is not in the plan's guardian set. | `approve_guardian` |
| 5 | `ThresholdNotMet` | Approvals have not reached the threshold. | release-path checks |
| 6 | `InvalidShares` | Beneficiary shares are empty or do not sum to `10_000` bps. | `create_legacy` |
| 7 | `AlreadyClaimed` | This beneficiary already withdrew their portion. | `claim_assets` |
| 8 | `InvalidStatus` | The plan is not in the right state for this call. | `deposit`, `approve_guardian`, `finalize_release`, `claim_assets`, `cancel_legacy` |
| 9 | `NothingToClaim` | The caller's allocation is zero or missing. | `claim_assets` |
| 10 | `InvalidInput` | A supplied value (threshold, amount, bps multiplication overflow) is invalid. | `create_legacy`, `finalize_release` |
| 11 | `AlreadyFunded` | `deposit` called on a plan that is already funded. | `deposit` |
| 12 | `NotFunded` | An action needing deposited funds ran before `deposit`. | `finalize_release` |
| 13 | `InsufficientBalance` | The contract's live token balance is below `total_amount`. | `finalize_release` |
| 14 | `DuplicateAddress` | A guardian or beneficiary address appears more than once. | `create_legacy` |

## Handling errors client-side

The API surfaces contract errors as HTTP responses; it never swallows them into
a fake success. In TypeScript, decode the simulation error and map the code:

```ts
const MESSAGES: Record<number, string> = {
  3: "You've already confirmed this plan.",
  4: "You're not listed as a guardian for this plan.",
  7: "This portion has already been claimed.",
  8: "This plan isn't ready for that step yet.",
  11: "This plan is already funded.",
  13: "The plan isn't fully funded yet — try again once the deposit settles.",
  14: "That person is already on the plan.",
};
```

Unknown codes should fall back to a generic message and be logged with the raw
code for triage.
