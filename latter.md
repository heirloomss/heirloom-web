# 🤖 Heirloom — Post-Configuration Execution Plan (`latter.md`)

> **Instructions for AI Agent**: When the user asks you to **"run latter.md"**, execute the steps below in sequence to wire live API handlers, replace mock endpoints with real `.env.local` credentials, run production checks, and push the updated build to GitHub main.

---

## 🎯 Target Tasks

### Step 1: Validate Environment Variables
- Check `heirloom-web/.env.local` for:
  - `NEXT_PUBLIC_SOROBAN_CONTRACT_ID`
  - `PINATA_API_KEY`
  - `RESEND_API_KEY`
- If any required key is missing, inform the user which key from `usertask.md` needs to be set.

---

### Step 2: Wire Live Services & Remove Placeholders

#### A. Soroban Smart Contract Integration (`src/lib/stellar.ts`)
- Replace mock transaction hash generators with live `@stellar/stellar-sdk` Soroban contract calls.
- Bind `NEXT_PUBLIC_SOROBAN_CONTRACT_ID` to handle beneficiary claims and check-in updates.

#### B. IPFS Document Vault (`src/lib/ipfs.ts`)
- Wire Pinata IPFS upload endpoint (`https://api.pinata.cloud/pinning/pinFileToIPFS`) using `PINATA_API_KEY` & `PINATA_SECRET_KEY`.
- Ensure client-side AES-256 encrypted blobs are uploaded to IPFS and return valid CIDs.

#### C. Notification API Route (`src/app/api/checkin/route.ts`)
- Connect email dispatcher to Resend API (`https://api.resend.com/emails`) using `RESEND_API_KEY`.
- Dispatch automated check-in reminder emails and guardian alert webhooks.

---

### Step 3: Run Full Production Build Audit
Execute the following verification commands:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Verify that there are zero TypeScript errors, zero lint warnings, and a clean Next.js static/dynamic build output.

---

### Step 4: Commit & Push to Main
Stage all live integrations, commit with a descriptive message, and push directly to GitHub:
```bash
git add .
git commit -m "feat(prod): wire live Soroban smart contracts, Pinata IPFS, and Resend notifications"
git push origin main
```

---

### Step 5: Report Readiness
Summarize the live integration status to the user and confirm that Heirloom is 100% ready for production deployment.
