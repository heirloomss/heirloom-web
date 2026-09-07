# For a guardian

Someone has named you a **guardian** of their legacy plan. You are a check, not
a controller. You cannot see their assets, move their money, change their
beneficiaries, or read their private messages. The one thing you can do is
**confirm, when asked, that they are gone** — and only together with the other
guardians.

## What you need

* A [Freighter](https://www.freighter.app) wallet on **Testnet**, funded with a
  little XLM for transaction fees.
* The wallet address you gave the owner must be the one you use.

## When nothing is happening

Most of the time there is nothing to do. The owner is checking in and the plan
sits untouched. You will not be contacted.

## When you are asked to confirm

If the owner stops checking in for the configured window, Heirloom emails the
guardians. The message will tell you:

* whose plan it is,
* how many confirmations are needed (the threshold),
* how many other guardians have already confirmed.

**Confirm only if you independently believe it is right.** Reach out to the
person or their family first if you can. Your confirmation is a signed on-chain
action and part of a decision to release someone's estate.

## How to confirm

1. Open the link in the email and connect your Freighter wallet.
2. Review the plan summary.
3. Click **Confirm** and approve the signature in Freighter. This calls
   `approve_guardian` on the contract.

The contract will reject your confirmation if:

* you are not in the plan's guardian set,
* you have already confirmed,
* the plan is not in the fundable/awaiting state.

## After the threshold is reached

Once enough guardians have confirmed, the contract marks the plan **Verified**
automatically. From that point:

* Release can be finalized by anyone (it is permissionless).
* Beneficiaries receive their capsule links and claim directly.
* Guardians have no further role.

## If you confirmed by mistake

You cannot un-confirm. But a single confirmation does nothing on its own —
release still needs the full threshold. If you believe verification is
happening wrongly, contact the owner immediately: **they can cancel the plan and
be refunded** at any time before release.
