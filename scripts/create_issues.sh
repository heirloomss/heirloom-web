#!/usr/bin/env bash
# Create the planned issue backlog for heirloom-web in one run.
# Requires: gh auth login with `repo` scope on heirloomss/heirloom-web.
set -euo pipefail
REPO=heirloomss/heirloom-web

label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null; }
label "type: feature"      "1d76db" "New capability"
label "type: fix"          "d73a4a" "Bug fix"
label "type: test"         "0e8a16" "Test coverage"
label "type: chore"        "fef2c0" "Tooling / CI / housekeeping"
label "complexity: small"  "c2e0c6" "< 1 day"
label "complexity: medium" "fbca04" "1-3 days"
label "complexity: large"  "d93f0b" "> 3 days"
label "area: claim"        "bfd4f2" "Beneficiary capsule flow"
label "area: assets"       "d4c5f9" "Protect + fund"
label "area: guardians"    "c5def5" "Guardian approval"
label "area: a11y"         "fad8c7" "Accessibility"

mk() { gh issue create --repo "$REPO" --title "$1" --label "$2" --body "$3"; }

mk "feat(claim): full Freighter claim flow on /claim/[token]" \
"type: feature,complexity: large,area: claim" \
"## Summary
Wire the capsule 'Claim' action end to end: request unsigned XDR from \`POST /api/claim/:token/claim/build\`, sign in Freighter, submit via \`POST /api/claim/:token/submit\`, then show the confirmed amount and tx link.

## Depends on
heirloomss/heirloom-api — capsule build/submit endpoints (already present)

## Acceptance criteria
- [ ] Connect-wallet step validates the address matches the beneficiary
- [ ] Loading / signing / submitting / done states, each with copy
- [ ] Error states mapped from contract codes (already claimed, nothing to claim, not released)
- [ ] Success shows amount + stellar.expert link
- [ ] Not a dead button in any state

## Tech stack
Next.js, @stellar/freighter-api, TanStack Query"

mk "feat(assets): Protect + Fund flow with deposit progress and errors" \
"type: feature,complexity: large,area: assets" \
"## Summary
On the asset page, implement create_legacy then deposit as a two-step flow with clear progress, a pending state while the deposit settles, and recoverable errors.

## Acceptance criteria
- [ ] Step 1 (create) and Step 2 (fund) are distinct and resumable
- [ ] Shows 'Protected' only after deposit confirms on-chain
- [ ] Handles user-rejects-signature and insufficient-balance
- [ ] Cancel + refund path reachable from the same screen

## Tech stack
Next.js, @stellar/freighter-api, TanStack Query"

mk "feat(guardians): guardian approval screen" \
"type: feature,complexity: medium,area: guardians" \
"## Summary
The screen a guardian lands on from the notification email: plan summary, connect wallet, approve (\`approve_guardian\`), and a progress indicator (n of threshold).

## Acceptance criteria
- [ ] Read-only plan summary (no asset amounts beyond what the owner shares)
- [ ] Approve button -> Freighter -> submit
- [ ] Rejections surfaced (not a guardian, already approved, wrong status)
- [ ] Shows updated approval count after success

## Tech stack
Next.js, @stellar/freighter-api"

mk "feat(dashboard): Legacy Journey timeline wired to the API" \
"type: feature,complexity: medium" \
"## Summary
Bind the dashboard timeline to \`GET /api/legacy/journey\`, rendering release moments in order with empty and error states.

## Acceptance criteria
- [ ] Calls \`/api/legacy/journey\`
- [ ] Ordered by the API's \`order\` field
- [ ] Empty state ('Your journey is a blank page for now')
- [ ] No fabricated entries when the API errors

## Tech stack
Next.js, TanStack Query"

mk "feat(a11y): keyboard and screen-reader pass on the capsule reveal" \
"type: feature,complexity: medium,area: a11y" \
"## Summary
The Legacy Capsule is the most emotionally loaded surface and must be fully accessible.

## Acceptance criteria
- [ ] Full keyboard navigation through the guided reveal
- [ ] Focus management between steps; visible focus rings
- [ ] Media has controls + transcripts/alt where provided
- [ ] Respects \`prefers-reduced-motion\`
- [ ] axe-core clean on the route

## Tech stack
Next.js, Framer Motion, @axe-core/react"

mk "chore(ci): Playwright smoke for the core flows" \
"type: chore,complexity: medium" \
"## Summary
Add a Playwright job covering: sign-in (mocked wallet), add beneficiary, dashboard renders, capsule route renders in DEMO_MODE.

## Acceptance criteria
- [ ] Runs against \`next build && next start\` with \`NEXT_PUBLIC_DEMO_MODE=true\`
- [ ] Traces uploaded on failure
- [ ] Added as a branch-protection required check

## Tech stack
Playwright, GitHub Actions"

mk "fix(demo): guarantee DEMO_MODE never affects production bundles" \
"type: fix,complexity: small" \
"## Summary
Add a build-time assertion and a test so \`NEXT_PUBLIC_DEMO_MODE\` can never ship \`true\` to production, and demo-only modules are tree-shaken out.

## Acceptance criteria
- [ ] Build fails if \`NODE_ENV=production\` and \`NEXT_PUBLIC_DEMO_MODE=true\`
- [ ] Test asserts fabricated-data modules are not in the production bundle
- [ ] Documented in CONTRIBUTING

## Tech stack
Next.js, a small build script"

mk "feat(i18n): extract product copy for localization" \
"type: feature,complexity: medium" \
"## Summary
Move hard-coded strings into a message catalogue so the calm, non-jargon copy can be translated.

## Acceptance criteria
- [ ] All user-facing strings referenced by key
- [ ] English catalogue complete; one stub locale wired
- [ ] Lint rule flags new string literals in JSX

## Tech stack
Next.js, next-intl or equivalent"
