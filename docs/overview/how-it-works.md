# How it works

The whole system is one object — a **legacy plan** — moving through five states.

## Step by step

### 1. The owner creates a plan

In the app the owner:

* names **beneficiaries** and gives each a percentage (must total 100%),
* names **guardians** and sets a threshold (e.g. "2 of my 3 guardians"),
* chooses an **asset and amount** to protect (e.g. 5,000 USDC).

This calls `create_legacy` on the contract. **No money moves yet.** The plan is
in `Draft`.

### 2. The owner funds the plan

The owner approves a token transfer and calls `deposit`. The committed amount
moves from the owner's wallet **into the contract**. The plan is now `Funded` —
the app shows this as "Protected."

From here the owner can still `cancel_legacy` and get the full amount back.

### 3. Life goes on

The owner does a periodic **Life Check-In** — one tap on "I'm Here." Heirloom
sends gentle reminders by email before each due date. As long as check-ins
happen, nothing changes on-chain.

### 4. A check-in is missed

If the owner stops checking in, Heirloom escalates: more reminders, then a
notice to the guardians. Each guardian independently decides whether to act.

### 5. Guardians verify

Each participating guardian calls `approve_guardian` (a Freighter signature).
When the number of approvals reaches the threshold, the contract moves the plan
from `Funded` to `Verified`. Double approvals and non-guardians are rejected
on-chain.

### 6. Release is finalized

Once `Verified`, the owner is presumed gone, so `finalize_release` takes **no
authorization** — any party (a beneficiary, a guardian, Heirloom, a script) can
call it. The contract:

* checks its own token balance actually covers the committed amount,
* splits the amount across beneficiaries by their basis-point shares,
* gives any rounding remainder to the last beneficiary,
* records a `ClaimData` entry per beneficiary,
* moves the plan to `Released`.

### 7. Beneficiaries claim

Each beneficiary gets a private link — `/claim/<token>` — with a guided reveal
of the messages and documents left for them. To take the assets, they connect
their own wallet and call `claim_assets`. The contract transfers their share and
marks it claimed. Beneficiaries claim **independently**; one slow beneficiary
never blocks another.

## What Heirloom can and cannot do

| Heirloom (the service) can | Heirloom cannot |
| --- | --- |
| Send reminder and notification emails | Move or freeze the deposited funds |
| Store encrypted documents and messages | Approve a plan on a guardian's behalf |
| Build unsigned transactions for the app to sign | Decide that release should happen |
| Show the plan's status | Change a beneficiary's allocation on-chain |

Every state change is signed by the relevant person in Freighter, or — for
`finalize_release` — gated purely by on-chain state.
