# Security Policy

## Audit status

**Heirloom is unaudited.** The frontend and the wider Heirloom stack have not had
a third-party security review. It targets Stellar **testnet**.

## Reporting a vulnerability

Report security issues **privately**. Do not open a public GitHub issue for
anything that could expose user data or funds.

- Email: **chijiokejoseph2022@gmail.com**
- Telegram: **@cjay**

Include the page or component involved, steps to reproduce, and the impact you
foresee. You will get an acknowledgement within **72 hours**. Please allow a
reasonable window for a fix before public disclosure. Reporters are credited on
request.

## In scope

- XSS, injection, or unsafe rendering of user-controlled content.
- Token/session handling in the browser (JWT storage, Freighter challenge flow).
- The public claim route `/claim/[token]` — leaking capsule contents before
  release, or token exposure via logs, referrers, or analytics.
- Client-side construction of Soroban transactions — anything that could get a
  user to sign something other than what the UI describes.
- `NEXT_PUBLIC_*` misuse — a secret shipped to the browser.

## Out of scope

- The API and contract — report in `heirloom-api` / `heirloom-contracts`.
- `NEXT_PUBLIC_DEMO_MODE=true` behaviour: it is a reviewer switch that renders
  fabricated sample data with no backend. It must be `false` in production.
- Missing headers with no demonstrated impact.
- Vulnerabilities that require a malicious browser extension other than a
  legitimate Freighter install.
