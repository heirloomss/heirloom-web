# Contributing to heirloom-web

This is the user-facing app for Heirloom. It is deliberately **not** a crypto UI
— no "wallet", "hash", or "smart contract" language in the product surface.

## Ground rules

- Every change goes through a pull request. `main` is protected.
- One logical change per PR.
- CI (`ci` job) must be green: type-check, lint, build.
- TypeScript is `strict`. No `any` without a comment.
- Keep the "Premium Paper Diorama" design language: warm tones, layered paper,
  gentle motion. New surfaces should feel like a family archive, not a dashboard.
- `NEXT_PUBLIC_DEMO_MODE` must default to `false`. Demo mode renders fabricated
  sample families for reviewers with no backend — never let it leak into a real
  build path or become the default.
- Never put a secret in a `NEXT_PUBLIC_*` variable — those ship to the browser.
- API errors in production fall back to genuinely empty state, never invented
  "warm" data.

## Setup

```bash
corepack enable
pnpm install
cp .env.example .env.local        # NEXT_PUBLIC_DEMO_MODE=false
pnpm dev                          # http://localhost:3000
```

Node 22, pnpm 11.1.2 (pinned via `packageManager`). Requires a running
`heirloom-api` unless `NEXT_PUBLIC_DEMO_MODE=true`.

## Checks

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

## Commit format

Conventional commits, scoped by area:

```
feat(claim): guided reveal for beneficiary capsule
fix(dashboard): empty-state copy when API returns no plan
style(archive): paper-fold animation on upload
chore(ci): cache the pnpm store
```

One logical unit per commit, push after each. No `git add .`.

## Pull request checklist

- [ ] `tsc --noEmit` clean
- [ ] `pnpm run lint` clean
- [ ] `pnpm run build` succeeds
- [ ] No new `NEXT_PUBLIC_*` secret
- [ ] Product copy avoids crypto jargon
- [ ] New data-fetching handles the empty / error state without invented data
- [ ] `.env.example` updated if a new variable was introduced

## Reporting bugs

Functional bugs: open a GitHub issue with repro steps and a screenshot.
Security issues: **do not** open an issue — see [SECURITY.md](SECURITY.md).
