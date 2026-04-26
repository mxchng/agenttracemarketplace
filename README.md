# Tracer

Tracer is a buyer-first marketplace for agent training traces on Base.

The product is designed around a simple idea: teams should be able to inspect, trust, purchase, and manage curated trace datasets without wading through a generic crypto dashboard. This repo contains the MVP scaffold for that flow, including Base wallet sign-in, listing detail pages, a buyer library, and an x402-shaped purchase path with both real and mock payment modes.

## What It Does

- Lets buyers connect a wallet and create an app session tied to a Base address
- Presents a marketplace of agent trace listings with trust and preview boundaries
- Shows structured listing detail pages with preview and purchase states
- Supports a client-side x402 purchase flow scaffold for Base-compatible payments
- Provides a mock payment mode so the full UI flow can be tested without spending funds

## Current Product Name

The suggested product name for the marketplace is **Tracer**.

Why this name:
- clear and literal about what is being sold
- easy to say and remember
- broad enough to cover browser traces, research traces, and future trace formats
- serious without sounding like a generic infra tool

If you keep the existing repo/package name for now, that is fine. `Tracer` can still be the public-facing product name.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Wagmi + viem for Base wallet integration
- Prisma with SQLite for the local scaffold
- x402 client/server libraries for payment flows
- Coinbase CDP auth for facilitator-backed x402 verification

## Key Flows

### Base Sign-In

The app implements a real wallet sign-in loop:

1. The server issues a nonce message
2. The connected wallet signs it
3. The server verifies the signature
4. The app writes a signed session cookie
5. Buyer routes can read the server session instead of relying only on wallet connection state

### Purchase Flow

There are two payment modes:

- `PAYMENT_MODE="mock"`
  Best for local product testing. Exercises the browser purchase flow without real payment settlement.

- `PAYMENT_MODE="x402"`
  Uses the x402 challenge and payment flow with a facilitator-backed verify/settle path.

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm run build
```

## Environment

Create `.env.local` in the repo root.

Minimum app auth and database config:

```bash
AUTH_SESSION_SECRET="replace-with-a-long-random-string"
DATABASE_URL="file:/Users/max/agenttracemarketplace/prisma/dev.db"
NEXT_PUBLIC_BASE_NETWORK="mainnet"
NEXT_PUBLIC_COINBASE_WALLET_PREFERENCE="eoaOnly"
```

### Mock Payment Mode

Use this when you want to test the purchase UI without a real onchain payment:

```bash
PAYMENT_MODE="mock"
X402_NETWORK_ID="eip155:8453"
X402_ASSET_ADDRESS="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
X402_PAY_TO="0x0000000000000000000000000000000000000001"
```

### Real x402 Mode

Use this when you want the app to hit the Coinbase facilitator:

```bash
PAYMENT_MODE="x402"
X402_FACILITATOR_URL="https://api.cdp.coinbase.com/platform/v2/x402"
X402_FACILITATOR_KEY_NAME="replace-with-cdp-api-key-id"
X402_FACILITATOR_KEY_SECRET="replace-with-cdp-api-key-secret"
X402_NETWORK_ID="eip155:8453"
X402_ASSET_ADDRESS="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
X402_ASSET_NAME="USDC"
X402_PAY_TO="0xYourBaseWalletAddress"
X402_MAX_TIMEOUT_SECONDS="60"
```

Notes:
- The app now generates short-lived CDP JWTs per facilitator endpoint when key name and secret are provided.
- A static `X402_FACILITATOR_TOKEN` can still be used as a fallback, but it is a worse local workflow because CDP JWTs are short-lived and path-scoped.
- For the current custom x402 client flow, `NEXT_PUBLIC_COINBASE_WALLET_PREFERENCE="eoaOnly"` is the safer default than Smart Wallet mode.

## Project Structure

- [app](/Users/max/agenttracemarketplace/app) - routes, pages, and API handlers
- [components](/Users/max/agenttracemarketplace/components) - UI building blocks including wallet and purchase controls
- [lib/auth](/Users/max/agenttracemarketplace/lib/auth) - session and wallet auth helpers
- [lib/base](/Users/max/agenttracemarketplace/lib/base) - Base chain and wallet config
- [lib/payment](/Users/max/agenttracemarketplace/lib/payment) - payment interfaces, mock mode, and facilitator-backed x402 integration
- [lib/services](/Users/max/agenttracemarketplace/lib/services) - purchase-domain orchestration
- [prisma](/Users/max/agenttracemarketplace/prisma) - local schema and SQLite database

## Design Direction

The product is intentionally not styled like a neon crypto landing page. The design goal is a calm, editorial technical marketplace where trust, provenance, and preview boundaries are more important than flashy wallet choreography.

See [DESIGN.md](/Users/max/agenttracemarketplace/DESIGN.md) for the current design source of truth.

## Known Limitations

- Listing and purchase data are still scaffolded from sample data in parts of the app
- The x402 flow is still an MVP integration and may need additional refinement for specific wallet providers
- Coinbase Smart Wallet flows are less reliable for the current custom typed-data signing path than EOA wallets
- Builds still emit upstream wagmi connector warnings, though lint and build complete successfully

## Next Likely Steps

- Replace mock listing and purchase reads with Prisma-backed data
- Persist real purchase and access-grant records
- Refine the facilitator-backed x402 settlement loop
- Implement a real preview serializer and download enforcement
- Add a more polished buyer purchase history and asset delivery flow
