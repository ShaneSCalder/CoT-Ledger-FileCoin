# 🛰️ Filecoin AI Upload Agent

A guided assistant to upload, summarize, compile, and deploy metadata to the Filecoin Calibration testnet — powered by AI and smart contract automation.

---

## 🚀 Overview

This app allows users to:

- 📁 Upload a JSON file
- 🧠 Generate a summary using AI
- 🔐 Connect MetaMask and switch to Filecoin Calibration testnet
- 📜 Compile and deploy a smart contract to store references to the data (CID, metadata hash, summary)
- 💾 Generate and download a `metadata.json` file
- 🎉 Get confirmation of deployed contract and transaction

The UI is presented in a clean **modal-style interface** for easy interaction and presentation.

---

## 📂 File Structure

```bash
.
├── public/
│   ├── js/
│   │   ├── agent.js             # Handles AI + contract logic
│   │   ├── wallet.js            # MetaMask integration + transaction logic
│   │   └── solc-worker.js       # Web worker for compiling Solidity contracts
│   └── css/
│       └── styles.css           # Optional custom styling
├── views/
│   ├── index.ejs                # Main UI view
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── app.js / server.js           # Express setup
├── package.json
└── README.md
```

---

## 🛠 Features

✅ Upload .json data file

✅ Generate summary, cid, and metadataHash

✅ Connect and verify MetaMask network (Filecoin Calibration)

✅ Compile Solidity smart contract via solc-js in browser

✅ Deploy contract via MetaMask

✅ Generate downloadable metadata.json

✅ Display debug logs and contract deployment info

---

## 🔗 Technologies Used

Node.js + Express

EJS Templates

ethers.js

MetaMask

IPFS

solc-js (in-browser)

Filecoin Calibration Testnet

---

## 📥 Metadata Example

```
{
  "cid": "bafy...",
  "metadataHash": "f83c7b...",
  "summary": "This JSON contains multiple memo entries...",
  "contractAddress": "0x123456...",
  "timestamp": "2024-04-25T17:00:00Z",
  "source": "Filecoin AI Upload Agent"
}
```

---

## 💡 Notes
Contract source is AI-generated per file summary.

All logic runs in the browser (no backend contract deployment needed).

Uses solc-js in a secure Web Worker to compile Solidity in-browser.

---

## 🛡️ Security
All transactions require user approval via MetaMask.

Contracts are deployed to Filecoin Calibration testnet only.

CIDs and metadata are immutable and viewable on IPFS.

---

## 🧪 Future Ideas
AI chat interface for follow-up questions

Verifiable metadata explorer

On-chain proof-of-upload via EAS or attestation layer

IPFS pinning checker

---


## 📦 IPFS Integration (Production Note)

In this example, the Filecoin Calibration Testnet is used to demonstrate the AI upload, smart contract deployment, and metadata handling process.

### 📌 In a production environment:

- You would incorporate IPFS (e.g., via [Web3.Storage](https://web3.storage) or [Pinata](https://pinata.cloud)) to upload and store files persistently.
- The real CID (Content Identifier) returned from IPFS would be used for smart contract logging.
- This ensures decentralized and verifiable access to the uploaded data across the Filecoin/IPFS network.

> ⚠️ For demo purposes, CIDs and metadata are simulated. In production, the upload flow should include actual IPFS integration for long-term storage and public access.

---
