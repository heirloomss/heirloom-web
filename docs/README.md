# Introduction

Heirloom is a digital legacy platform on Stellar. It lets a person set aside
assets, documents, and personal messages now, and have them reach the right
people later — without a company in the middle deciding when "later" is.

The decision to release is enforced by a Soroban smart contract, not by
Heirloom. A small circle of the owner's own **guardians** confirm that the owner
is gone; once enough of them agree, release is **permissionless** and each
**beneficiary** claims their share directly from the contract.

## Why this needs to exist

* An estimated **67% of American adults have no will or estate plan**
  (Caring.com, *2024 Wills and Estate Planning Study*). The share is higher
  among younger adults.
* Digital assets and accounts routinely die with the person who held them.
  Password managers, exchange accounts, cloud archives, and self-custodied
  crypto are frequently unrecoverable by the family.
* Traditional estate processes are slow and expensive. US probate commonly runs
  **6–9 months or longer** and consumes **3–7% of estate value** in fees.
* Custodial "inheritance" products ask families to trust a company to hold funds
  and to act correctly at the worst possible moment.

Heirloom's answer: the money and the release rules live on-chain, in a contract
whose behaviour anyone can read. The company can go away and the plan still
works.

## What you can do with it

| Feature | What it is |
| --- | --- |
| Protected Assets | Stellar assets (XLM, USDC, …) committed to a plan and deposited into the contract. |
| Beneficiaries | The people and causes you name, each with an allocation percentage. |
| Guardians | A small set of trusted people who confirm — never control. An M-of-N threshold. |
| Digital Archive | An encrypted vault for deeds, passports, insurance documents, and more. |
| Messages | Letters, voice notes, videos, and photos, released at the right moment. |
| Life Check-In | An "I'm Here" button. Miss it for long enough and the guardian process begins. |
| Legacy Journey | The dashboard timeline of what is set to be released, and when. |
| Legacy Capsule | The beneficiary's side: a guided, respectful reveal at `/claim/<token>`. |

## How to read these docs

* **Non-technical:** start with [The problem](overview/problem.md),
  [How it works](overview/how-it-works.md), then the guide for your role —
  [owner](guides/owner.md), [guardian](guides/guardian.md), or
  [beneficiary](guides/beneficiary.md).
* **Technical / reviewer:** [System architecture](overview/architecture.md),
  [Plan lifecycle](protocol/lifecycle.md), the
  [contract reference](contracts/legacy-reference.md), and the
  [developer guide](developers/local-setup.md).

## The repositories

| Repo | Purpose |
| --- | --- |
| [`heirloom-contracts`](https://github.com/heirloomss/heirloom-contracts) | The Soroban `legacy` contract (Rust). |
| [`heirloom-api`](https://github.com/heirloomss/heirloom-api) | Off-chain service: accounts, archive, messages, reminders, unsigned-XDR builder (NestJS). |
| [`heirloom-web`](https://github.com/heirloomss/heirloom-web) | The app people use (Next.js). |

## Status

Unaudited. Deployed on Stellar **testnet** only.

| | |
| --- | --- |
| Contract ID | `CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE` |
| Wasm hash | `d52d35a5cb25c249dfcbdb8602435bdaee43bde07254f44198c2793ba4bfad80` |
| Explorer | [stellar.expert](https://stellar.expert/explorer/testnet/contract/CAA55GCID6DTTQNUFMNT2PNKSBIDMMMKEPP6GKUKL3WJ3SH6QRRSXUNE) |
