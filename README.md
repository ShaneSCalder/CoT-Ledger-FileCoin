# CoT-Ledger-FileCoin

# 🧠 CoT Ledger Agent – Verifiable Chain-of-Thought Logging on Filecoin

## 🚀 Overview

The CoT Ledger Agent is a modular system that enables AI agents and developers to:
- Store encrypted or plaintext Chain-of-Thought (CoT) logs
- Generate verifiable metadata
- Upload and pin files on Filecoin
- Sign transactions with MetaMask to ensure ownership and attribution

It combines a conversational AI assistant (GPT), Merkle-root verification, and decentralized storage to solve critical challenges in the emerging AI x crypto landscape.

---

## 🧩 What We're Solving

### ❓ The Problem
As AI systems generate increasing volumes of output, logs, and reasoning steps, there is **no standardized, verifiable way to store or prove the origin of AI-generated content**. This opens the door to:
- Model manipulation without traceability
- Loss of decision provenance
- Centralized data control
- Missing attribution to contributors and agents

---

## ✅ Our Solution

### 🧠 AI-Driven Agent + CoT Ledger + Filecoin

1. 📁 Upload a CoT file (from an agent or developer)
2. 💬 AI assistant (GPT-3.5) helps generate metadata
3. 🌐 Upload to Filecoin via Web3.Storage**
4. 🔗 MetaMask signature verifies ownership
5. 🔍 Merkle root + CID ensure integrity and provenance
6. 📜 Metadata saved locally and downloadable (`meta.json`)
7. 📡 CID linked to dweb/IPFS gateway** for public proof

---

## 🎯 Hackathon Bounties Matched

### 🧬 1. **Data Provenance**
- Stores CoT logs with immutable Merkle-root-based proof
- Signed with user wallet via MetaMask
- CID + hash traceable, downloadable, and verifiable

### 💰 2. **Fair Attribution**
- Each CoT log is tied to a wallet and timestamp
- System can be extended to reward contributors (e.g., Data DAOs)

### 🧱 3. **Modular Architecture**
- Plug-in structure: AES256 encryption, Filecoin upload, metadata, wallet signing
- Easily extendable: Smart contract registry, NFT minting, DAO hooks

### 🤖 4. **Agentic Economy**
- Designed for use by autonomous agents to self-log reasoning
- GPT-powered assistant allows agents to self-describe their outputs
- Could evolve into multi-agent proof-of-thought environments

---

## 🔧 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| UI          | Node.js + Express + EJS       |
| AI Agent    | GPT-3.5-turbo (OpenAI API)     |
| Storage     | Web3.Storage (Filecoin/IPFS)  |
| Signing     | MetaMask + Ethers.js          |
| Metadata    | JSON manifest + Merkle root   |
| Logs        | Local ledger (JSON)           |

---

## 🖼️ Demo Features

- Upload a file (e.g., `cot_log.json`)
- Chat with AI to describe file purpose, proof ID, etc.
- Generate and preview `meta.json`
- Upload to Filecoin
- Sign CID + hash with MetaMask
- View and download metadata and original file
- Verify file availability via `https://dweb.link/ipfs/<cid>`

---

## 📁 Example Meta.json

```json
{
  "developer_wallet": "0xYourWalletAddress",
  "filecoin_cid": "bafybeigd...",
  "upload_time": "2025-04-09T18:00:00Z",
  "filename": "cot_proof_genesis.json",
  "merkle_root": "abc123...",
  "proof_id": "Proof_GENESIS_XYZ",
  "signed_tx": "0xSignatureHash"
}
```
---

## 🧠 Credits
Encryption Module: @shanescalder/aes256-encryption-layerone

AI Integration: OpenAI GPT-3.5 API

Storage: Filecoin via Web3.Storage

Wallet Signing: MetaMask + Ethers.js

---

## 🚀 Join the CoT Ledger Beta

We’re launching CoT Ledger as a foundational tool for transparent, agent-driven reasoning and verifiable AI logs — built for developers, researchers, and autonomous systems.

🔒 Secure  
📜 Verifiable  
🌐 Stored on Filecoin

If you’re building with AI, agents, LLMs, or care about data provenance — we’d love to have you onboard.

👉 **[Sign up for the Beta at cotledger.com](https://cotledger.com)**

### 🎁 Beta Perks
- Early access to CoT ledger features (encryption, verification, public proofs)
- Propose features and integrations directly with the team
- Priority access to our upcoming smart contract + DAO modules
- Featured project slots for hackathon builders and early adopters

---

# CoT Ledger
Building Transparent, Long-Term AI Reasoning for an Ethical Future

# CoT Audit Log for AI Portfolio Balancer

## Overview

This repository provides a builder-centric implementation of a **Chain of Thought (CoT) Audit Log** system tailored for an AI-powered portfolio balancer. It logs model reasoning, actions, and validation processes into a structured mini-ledger format using deterministic JSON schemas. Memos are hashed, verified with Merkle trees, and grouped into blocks for trustless auditability.

---

## 🔧 Core Components

### 1. `creatememoledger.js`

- Creates a new **memo entry** from incoming AI model data.
- Applies consistent schema to ensure deterministic hashing.
- Generates a memo file ready for ledger entry.

### 2. `runledger.js`

- Executes ledger functions:
  - Updates the memo ledger.
  - Computes Merkle roots.
  - Generates proof hashes.
  - Appends full blocks when the defined size is reached.

---

## 📄 Memo Structure
Each memo contains `part_a`, `part_b`, and `part_c` sections:

- Part A – Model Reasoning
  - Tracks what the AI decided and why (MACD, volume, confidence, etc.).

- Part B – Execution Details
  - Records transaction simulation details: sender/recipient wallets, value sent, fees.

- Part C – CoT Audit
  - Logs the audit decision by another agent or validator (CoT verified, verdict, notes).

- Metadata
  - Includes strategy references, hashes, URLs, and optional NFT IDs.

---

## 🧱 Ledger Lifecycle

### ➕ Memo Creation
```bash
node creatememoledger.js --input ./input/rebalance_001.json
```
Generates a unique memo file and memo hash.

### 🌀 Run Ledger
```bash
node scripts/runledger.js
```
- Adds memo to `memo_ledger.json`
- Computes Merkle root and proof
- After 10 memos, creates a block
- Appends block to `portfolio_balancer_ledger.json`

---

## 📁 Files

- `memo_ledger.json` – stores all memo entries
- `portfolio_balancer_ledger.json` – stores finalized blocks and state
- `input/` – optional raw inputs for memo creation
- `output/` – proof objects and NFTs

---

## 🔐 Merkle Proofs and Their Role

Each memo and block undergoes deterministic hashing of all fields, which are used as leaves in a Merkle tree. 

### 🔁 Proof Generation Includes:

- Hashing every field (e.g., `ledger_transaction_id`, `memo_id`, `part_a_model_used`, etc.)

- Creating a Merkle root for each memo

- Attaching the root, nonce, and proofHash to the memo

- After 10 memos, grouping them into a block with a new Merkle root over all 10 entries

### ✅ Contribution of Merkle Proofs

- Tamper-Proof: Any change to a field will invalidate the proof.

- Verifiable: Users and auditors can validate a single memo or the entire block independently.

- ZK-Level Assurance: While not using traditional zero-knowledge circuits, this system achieves equivalent verifiability and traceability through deterministic hashing and Merkle tree proofs. It's more flexible, transparent, and suited for real-time audit logging without requiring heavy cryptographic computation.
- **Chain of Custody**: Memos act as signed records in time, allowing AI agents' decisions to be traced back to provable context.

---

## 🌐 Use Cases

- ⚡ Efficient Alternative to ZKPs: Traditional zero-knowledge proofs (ZKPs) are computationally expensive and unsuitable for large or frequently updated datasets. This system provides equivalent verifiability and traceability at scale using Merkle proofs—making it far more appropriate for high-frequency, real-time AI audit logging.

- ✅ Transparent AI trading strategies
- ✅ AI reasoning chain logs (CoT)
- ✅ Validator audit trails for agents
- ✅ Verifiable decision compliance (via hashes/Merkle)

---

## 📦 Example Commands
```bash
# Create a memo with model decision
node scripts/creatememoledger.js 

# Run ledger system (append memos, generate block)
node scripts/runledger.js
```


---

## Polyform License (Commercial)

- A purpose-built license family that supports non-commercial open development but restricts commercial use.

✅ Polyform Noncommercial

- Use allowed only for non-commercial purposes.

✅ Polyform Small Business

- Free use for small teams under a revenue cap.

--- 

## 📣 Coming Soon

🧪 Beta Test Program – Be the first to explore the CoT Audit Ledger in action

📦 NPM & Binary Access – Lightweight CLI tools and modules for builders

🧭 Block Explorer UI – Visualize your memo blocks and Merkle proofs

👉 Sign up for early access:

[![Join the Beta](https://img.shields.io/badge/Beta%20Signup-Available-blue?style=for-the-badge)](https://www.cotledger.com)


---

## ✨ Built For Builders
This system is modular, hash-consistent, and audit-ready. Whether you’re logging AI thoughts or bridging them cross-chain, CoT auditing begins with truth you can prove.

---

## ✨ Work Flow example for Balancing a Crypto Portfolio 
This workflow is an example of capturing decision by the AI to rebalance a portfolio using MACD and sentiment analysis.
- How data is analysed and sorted
- How data is stored in Nodes
- How data can be used for reinforcement learning and training other models
- How the data can be used to create long and short term memory to assist with more accurate decisions


<img width="5024" alt="CoT_Memory_Labelled_Data_Node_Data_Storage" src="https://github.com/user-attachments/assets/059bee91-7fc4-4109-8fc4-96956a0bff40" />
