# Veil Badge

**Own your reputation. Protect your data.**

Veil is a privacy-preserving reputation system on Bitcoin. Build a verifiable track record of successful transactions without revealing your identity, history, or counterparties.

## What It Does

- **Anonymous Reputation** — Prove trustworthiness without exposing who you are
- **Portable** — Your reputation is a Bitcoin asset you control, not platform data
- **Verifiable** — Trust scores update through cryptographic proofs via Charms Protocol
- **Accountable** — Vouch network creates trust without central authority

## Project Structure

```
veil-badge/
├── charms-app/     # Rust smart contract (compiles to WASM)
│   ├── src/
│   │   ├── handlers/    # Action handlers (mint, vouch, transact, etc.)
│   │   ├── formulas/    # Trust score, risk flags, cascade damage
│   │   ├── validation/  # State transition validation
│   │   └── types/       # Badge, proposal, action types
│   └── spells/          # Example spell YAML files
├── client/         # React frontend
│   ├── src/
│   │   ├── pages/       # Dashboard, Transactions, Vouch, Network
│   │   ├── hooks/       # Wallet integration, WASM loading
│   │   └── services/    # Prover, Charms service
│   └── public/charms/   # Compiled WASM binary
└── docs/           # Future enhancements
```

## Quick Start

### Prerequisites

- Rust + `wasm32-wasip1` target
- Node.js 18+
- [Charms CLI](https://charms.dev) v0.10+

### Build the Smart Contract

```bash
cd charms-app
./build-optimized.sh
```

This compiles the Rust contract to WASM and outputs the verification key (VK).

### Run the Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

### Deploy

```bash
cd client
npm run deploy  # Deploys to GitHub Pages
```

## How It Works

1. **Mint** — Create an anonymous badge linked to your Bitcoin wallet
2. **Propose** — Send transaction proposals to counterparties
3. **Accept** — Counterparty accepts, both badges track the pending transaction
4. **Report** — After trade window, both parties report outcome (positive/negative)
5. **Settle** — Badge trust scores update based on mutual reports

## Badge Stats

| Field | Description |
|-------|-------------|
| `trust` | 0-100 score based on transaction history and age |
| `risk` | Behavioral flags (acceleration, extraction, isolated, etc.) |
| `tx_total` | Total completed transactions |
| `vouches_in` | Who vouches for you (and their stake) |
| `vouches_out` | Who you vouch for |
| `cascade_damage` | Reputation loss from vouching for bad actors |

## Tech Stack

- **Smart Contract**: Rust → WASM (Charms Protocol)
- **Frontend**: React + TypeScript + Tailwind
- **Bitcoin**: Testnet4 via Charms v8 prover
- **Crypto**: secp256k1 signatures, SHA-256 hashing

## Network

- **Testnet4** (default)
- Prover: `https://v8.charms.dev/spells/prove`

## License

MIT
