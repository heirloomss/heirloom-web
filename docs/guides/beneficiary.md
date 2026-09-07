# For a beneficiary

Someone named you in their Heirloom legacy. When the plan is released, you will
receive a private link to a **Legacy Capsule** — the messages and documents they
left for you — and you can claim your share of the protected assets.

## The capsule link

You will get an email with a link like `https://…/claim/<token>`. That token is
the only key to your capsule. Treat it like a password:

* Don't forward the email or post the link.
* The link lets you **view** what was left for you. It does **not** move any
  assets by itself.

## Viewing what was left for you

Open the link. The capsule is a guided reveal — letters, voice notes, videos,
photos, and any documents addressed to you, shown one at a time. You do not need
a wallet to read your capsule.

## Claiming your share

To receive the assets you need a Stellar wallet:

1. Install [Freighter](https://www.freighter.app), create an account, switch to
   **Testnet**, and fund it with a little XLM for fees.
2. In the capsule, choose **Claim** and connect your wallet. The wallet address
   must match the one the owner listed for you.
3. Approve the signature in Freighter. This calls `claim_assets` on the
   contract; your share is transferred straight to your wallet.

You claim **independently** of the other beneficiaries. You can do it whenever
you are ready — there is no deadline in the contract, and another beneficiary
being slow never blocks you.

## What can go wrong

| Message | Why | What to do |
| --- | --- | --- |
| "Already claimed" | You (or someone with your key) already withdrew this share. | Check your wallet history. |
| "Nothing to claim" | Your address has no allocation on this plan. | Confirm with the family that the right wallet address was used. |
| "This plan isn't ready" | Release hasn't been finalized yet. | Wait; anyone can finalize it, so it should resolve shortly. |
| The link doesn't open | The token is wrong or the capsule was regenerated. | Ask the family or Heirloom to re-send. |

## If Heirloom is gone

The capsule (messages/documents) lives with Heirloom, but **the assets do not**.
If you have the contract ID
(`CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE`) and your wallet, you
can call `claim_assets` directly — via the Stellar CLI or any Soroban client —
without the Heirloom app.
