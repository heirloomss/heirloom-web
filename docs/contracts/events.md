# Events

Every state transition emits an event so an off-chain indexer can rebuild plan
history without polling `get_legacy`. Topic symbols are `symbol_short!` (≤ 9
chars).

| Event | Topics | Data | Emitted by |
| --- | --- | --- | --- |
| `created` | `("created", owner: Address)` | `(legacy_id: u64, threshold: u32)` | `create_legacy` |
| `deposited` | `("deposited", owner: Address)` | `(legacy_id: u64, total_amount: i128)` | `deposit` |
| `approved` | `("approved", guardian: Address)` | `(legacy_id: u64, approvals_count: u32)` | `approve_guardian` (every call) |
| `verified` | `("verified",)` | `legacy_id: u64` | `approve_guardian` (only when threshold is reached) |
| `released` | `("released", token: Address)` | `(legacy_id: u64, total_amount: i128)` | `finalize_release` |
| `claimed` | `("claimed", beneficiary: Address)` | `(legacy_id: u64, amount: i128)` | `claim_assets` |
| `refunded` | `("refunded", owner: Address)` | `(legacy_id: u64, total_amount: i128)` | `cancel_legacy` (only if the plan was funded) |
| `cancelled` | `("cancelled", owner: Address)` | `legacy_id: u64` | `cancel_legacy` (always) |

## Reconstructing a plan's history

```
created    -> plan exists, Draft
deposited  -> Funded
approved   -> one guardian signed (count tells you how many so far)
verified   -> threshold met, Verified
released   -> Released, claims written
claimed    -> one beneficiary withdrew
refunded + cancelled -> owner cancelled a funded plan
cancelled (no refunded) -> owner cancelled an unfunded Draft
```

## Consuming events

Soroban RPC `getEvents` filtered by contract ID:

```bash
stellar events \
  --network testnet \
  --start-ledger <ledger> \
  --id CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE
```

In TypeScript, use `rpc.Server.getEvents({ startLedger, filters: [{ type: "contract",
contractIds: [CONTRACT_ID] }] })` and match on the first topic symbol.
