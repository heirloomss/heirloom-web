# For the owner

You are the person setting up a legacy. This is what you do, in order.

## 1. Sign in

Heirloom uses a Stellar wallet ([Freighter](https://www.freighter.app)) as your
sign-in. Install it, create or import an account, and switch it to **Testnet**.
On the Heirloom sign-in screen, connect the wallet and approve the signature
request. There is no password.

## 2. Add the people who matter

**Beneficiaries** — the people and causes who will receive something. For each,
add a name, your relationship, an email, and a percentage. The percentages must
add up to 100%.

**Guardians** — a small circle (2 to 5 works well) who will confirm when the
time comes. For each, add a name, an email, and their Stellar wallet address —
they will need to sign on-chain, so they each need a funded testnet account.
Then choose how many of them must agree: "2 of 3" is a common setting.

## 3. Fill your archive and write your messages

* **Digital Archive** — upload deeds, passports, insurance papers, account
  inventories. Everything is encrypted before it leaves your browser session;
  Heirloom stores only ciphertext.
* **Messages** — letters, voice notes, videos, photos. You choose which
  beneficiary each one is for and when it should be revealed.

## 4. Protect an asset

Go to **Protected Assets**, pick an asset (XLM, USDC, …) and an amount. This
does two things:

1. **Create the plan** — records your guardians, beneficiaries, asset, and
   amount on the contract. No funds move yet.
2. **Protect + Fund** — you approve a transfer in Freighter and the amount moves
   from your wallet **into the contract**. The asset now shows as "Protected."

You can do step 2 later, but the plan does nothing until it is funded.

## 5. Check in

On your dashboard there is an **"I'm Here"** button. Tap it on your schedule
(the default reminder gap is weekly; it is configurable). Heirloom emails you a
gentle reminder before each due date. As long as you check in, nothing else
happens.

## If you change your mind

Before anything is released, you can **cancel** a plan from the asset's page.
If it was funded, the full amount is returned to your wallet in the same step.
You can then rebuild the plan differently.

## What happens if you stop checking in

1. Heirloom sends escalating reminders.
2. After the configured window, your guardians are notified.
3. Each guardian independently confirms (or not) by signing on-chain.
4. When enough have confirmed, the plan is **Verified** and release can be
   finalized by anyone.
5. Each beneficiary gets a private capsule link and claims their share with
   their own wallet.

You are never "declared gone" by a single click. It takes missed check-ins
**plus** a threshold of your chosen guardians.
