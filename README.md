<p align="center">
  <img src="https://github.com/user-attachments/assets/a9a214e7-fc55-4fb0-9617-61da01f7c443" alt="Artemis AI Banner" />

</p>

<h1 align="center">
  Artemis AI SEDA Integration
</h1>

## 📍 Overview

This repository contains the **SEDA** network integration components for Artemis AI, providing decentralized oracle services for AI-driven prompts with GPT4o, pricing data, and transaction verification across chains. The integration leverages **SEDA**'s verifiable data requests to ensure reliable and tamper-proof data delivery across different blockchain networks, alongside the secure proxies.

## 👾 Features

### AI Prompt Generation
- Decentralized prompt generation service via **SEDA** data requests
- Secure proxy for accessing Artemis AI chatGPT api wrapper
- Multi-node consensus for prompt verification
- Rate-limited and authenticated access

### Price Feed Oracle
- Real-time ETH/USD price feeds
- Aggregated data from multiple sources

### Transaction Verification
- Cross-chain transaction status verification
- Support for multiple EVM networks
- Etherscan data integration using **SEDA** data proxies
- Consensus-based verification results

## 🏗 Architecture

The project consists of several key components:

1. **Data Proxies**
   - `llm-data-proxy`: Handles AI prompt generation requests

**NOTE**: The llm data proxy is used to interact with our deployed openAI wrapper. The code for the wrapper can be found [here](https://github.com/Artemis-Multichain/frontend/blob/master/app/api/generatePrompt/route.ts) in the frontend
   - `transaction-verification-proxy`: Manages transaction verification data


2. **Data Request Programs**
   - `llm-data-requests`: WASM programs for prompt generation
   - `price-feed`: ETH/USD price oracle implementation
   - `transaction-verification-requests`: Transaction status verification logic

Each component follows a modular architecture with:
- Execution Phase: Fetches data from external sources
- Tally Phase: Aggregates results with consensus mechanisms
- Proxy Layer: Secure API access and response signing

## 🚀 Getting Started

### ☑️ Prerequisites

- Node.js v20 or higher
- Bun runtime
- Docker (for containerized deployment)
- Access to **SEDA** network (testnet/mainnet)
- Keplr wallet with **SEDA** devnet tokens

### ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Artemis-Multichain/seda-oracle
cd seda-oracle
```

2. Install dependencies for all components:
```bash
# Install root dependencies
bun install

# Initialize components
cd llm-data-proxy && bun install
cd ../price-feed && bun install
cd ../transaction-verification-proxy && bun install
```

3. Configure environment variables:
```bash
# Create .env files from examples
cp llm-data-proxy/.env.example llm-data-proxy/.env
cp price-feed/.env.example price-feed/.env
cp transaction-verification-proxy/.env.example transaction-verification-proxy/.env
```

Required environment variables:
```env
# **SEDA** network configuration
SEDA_RPC_ENDPOINT=https://rpc.devnet.seda.xyz
SEDA_MNEMONIC=your_mnemonic_here
ORACLE_PROGRAM_ID=your_program_id

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
ARTEMIS_AI_API_KEY=your_artemis_key
```

### 🤖 Usage

#### Running Data Proxies

Start the LLM data proxy:
```bash
cd llm-data-proxy
bun start run --config ./config.json
```

Start the transaction verification proxy:
```bash
cd transaction-verification-proxy
bun start run --config ./config.json
```

#### Deploying Oracle Programs

Deploy the price feed oracle:
```bash
cd price-feed
bun run deploy
```

Deploy the prompt generation oracle:
```bash
cd llm-data-requests
bun run deploy
```

#### Making Data Requests

Example price feed request:
```bash
cd price-feed
bun run post-dr
```

Example transaction verification:
```bash
cd transaction-verification-requests
bun run post-dr 
```

### 🧪 Testing

Run tests for each component:
```bash
# Test price feed
cd price-feed && bun test

# Test LLM requests
cd llm-data-requests && bun test

# Test transaction verification
cd transaction-verification-requests && bun test
```

## 📦 Docker Deployment

Build and run using Docker:

```bash
# Build all components
docker-compose build

# Run the entire stack
docker-compose up -d
```

## 🔐 Security

- All proxies implement request signing and verification
- Rate limiting on API endpoints
- Environment variable injection for sensitive data
- Consensus-based data validation
- Request proofs verified across SEDA's secure network
