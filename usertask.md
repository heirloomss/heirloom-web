# 📋 Heirloom — Human Task Checklist (`usertask.md`)

This document details all **human-in-the-loop configuration tasks** required before launching Heirloom into production. Complete these steps to generate your environment keys and service credentials.

---

## 1. 🔑 Stellar & Soroban Blockchain Setup

Heirloom uses **Stellar** for automated asset inheritance and **Soroban Smart Contracts** for trustless verification rules.

### Action Items:
- [ ] **Install Freighter Wallet**: Install the [Freighter Browser Extension](https://www.freighter.app/) to interact with Stellar.
- [ ] **Fund Staging Testnet Account**: Use the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator) to fund your test account with testnet XLM.
- [ ] **Deploy Soroban Smart Contract**:
  - Deploy the Heirloom vault contract to Stellar Testnet (or Mainnet).
  - Note your deployed `CONTRACT_ID`.

---

## 2. 📁 Decentralized Document Vault (Pinata IPFS)

Heirloom encrypts documents locally in the browser with AES-256 before uploading to IPFS.

### Action Items:
- [ ] **Create a Pinata Account**: Sign up at [Pinata.cloud](https://www.pinata.cloud/).
- [ ] **Generate API Keys**:
  - Go to **API Keys** -> **New Key**.
  - Enable `pinFileToIPFS` permissions.
  - Copy your `API Key`, `API Secret`, and `JWT Token`.

---

## 3. ✉️ Automated Check-In & Guardian Alerts (Resend / SendGrid & Twilio)

Heirloom sends 30-day *"I'm Here"* check-in emails to vault owners and alerts trusted guardians when check-ins are missed.

### Action Items:
- [ ] **Set Up Email Provider (Resend or SendGrid)**:
  - Create an account on [Resend.com](https://resend.com) or [SendGrid.com](https://sendgrid.com).
  - Verify your sending domain (e.g., `notifications.heirloom.legacy`).
  - Copy your `API Key`.
- [ ] **Set Up SMS Alerts (Twilio)** *(Optional)*:
  - Create a [Twilio Account](https://www.twilio.com/).
  - Obtain a phone number with SMS capability.
  - Copy your `Account SID`, `Auth Token`, and `Phone Number`.

---

## 📄 Production `.env.local` Key Matrix

Create or update your `heirloom-web/.env.local` file with the following variables:

```env
# ------------------------------------------------------------------
# STELLAR & SOROBAN BLOCKCHAIN CONFIGURATION
# ------------------------------------------------------------------
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ------------------------------------------------------------------
# PINATA IPFS STORAGE (Client-Side Encrypted Vault)
# ------------------------------------------------------------------
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# ------------------------------------------------------------------
# NOTIFICATIONS (Email Check-Ins & Guardian Alerts)
# ------------------------------------------------------------------
RESEND_API_KEY=re_123456789_your_resend_api_key
NOTIFICATION_FROM_EMAIL=legacy@heirloom.app

# ------------------------------------------------------------------
# TWILIO SMS (Emergency Guardian Notifications)
# ------------------------------------------------------------------
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+18005550199
```

---

## 🚀 Next Step
Once you have collected the API keys and populated `.env.local`, execute **`latter.md`** with your AI assistant to automatically link production handlers, swap placeholder hooks, and push the production build!
