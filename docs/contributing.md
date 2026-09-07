# Contributing

Each repo has its own `CONTRIBUTING.md` with the specifics. This page is the
shared picture.

## Repos and where work goes

| Change is about… | Repo |
| --- | --- |
| Contract logic, state machine, on-chain auth, events | `heirloom-contracts` |
| Endpoints, encryption, archive, messages, reminders, unsigned-XDR builder | `heirloom-api` |
| Screens, flows, wallet integration, copy, design | `heirloom-web` |
| These docs | `heirloom-web` (`docs/`) |

A change that spans repos (e.g. a new contract function plus the UI to call it)
gets a coordinated issue in each, with an explicit **"Depends on"**
cross-reference. Ship in dependency order — contract deployed first, then API,
then web.

## Workflow (all repos)

1. `main` is protected. Branch, commit, push, open a PR.
2. One logical change per PR. One logical unit per commit; push after each.
3. Conventional commits: `type(scope): description`.
4. CI must be green before review:
   * `heirloom-contracts`: `fmt`, `clippy`, `test`, `build`
   * `heirloom-api`: `ci` (tsc, eslint `--max-warnings 0`, jest, build)
   * `heirloom-web`: `ci` (tsc, next lint, next build)
5. New behaviour ships with tests. Don't weaken a test to make CI pass.

## Non-negotiables

* **Contracts:** no `unwrap`/`panic` outside tests, no floats, integer bps math,
  `require_auth()` on every state-changing call except the permissionless
  `finalize_release`, an event per transition.
* **API:** never signs a Stellar transaction, never stores a signing key, never
  logs secrets or decrypted content. A missing integration is a 503 or a logged
  skip — never a fabricated success.
* **Web:** no crypto jargon in the product surface, `NEXT_PUBLIC_DEMO_MODE`
  defaults to `false`, no secret in a `NEXT_PUBLIC_*` var.
* **Everywhere:** email/password auth stays preserved-but-disabled — keep the
  "do not delete" banners.

## Writing style for docs

* Short, direct sentences. No "seamlessly", "robust", "powerful", "leverage".
* Real numbers over vague claims. If you cite a figure, cite where it's from.
* Every function/endpoint reference states parameters, return type, and who can
  call it.

## Reporting security issues

Do not open a public issue. Email **chijiokejoseph2022@gmail.com** or Telegram
**@cjay**. See each repo's `SECURITY.md`.
