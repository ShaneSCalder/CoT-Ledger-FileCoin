let userWalletAddress = null;
let contractAddress = null;
let contractAbi = null;

// Filecoin Calibration Testnet Chain ID
const FILECOIN_CALIBRATION_CHAIN_ID = '0x4cb2f';

// ✅ Connect to MetaMask and ensure we're on the Filecoin Calibration testnet
async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not found.");

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userWalletAddress = accounts[0];
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    if (chainId !== FILECOIN_CALIBRATION_CHAIN_ID) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: FILECOIN_CALIBRATION_CHAIN_ID }]
      }).catch(async (error) => {
        if (error.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: FILECOIN_CALIBRATION_CHAIN_ID,
              chainName: "Filecoin Calibration Testnet",
              rpcUrls: ["https://api.calibration.node.glif.io/rpc/v1"],
              nativeCurrency: {
                name: "Test FIL",
                symbol: "tFIL",
                decimals: 18
              },
              blockExplorerUrls: ["https://calibration.filfox.info/en"]
            }]
          });
        } else {
          alert("Switch network manually in MetaMask.");
          return;
        }
      });
    }

    const walletStatus = document.getElementById('walletStatus');
    if (walletStatus) {
      walletStatus.innerText = `Connected: ${userWalletAddress}`;
    }

    window.dispatchEvent(new Event('walletConnected'));

  } catch (err) {
    console.error("❌ Wallet connection error:", err);
  }
}

// ✅ (Optional) Compile & Deploy via solc-js in browser (used only if not via Remix)
async function deployContractLive(contractSource) {
  const compiler = await setupSolidityCompiler();

  const input = {
    language: "Solidity",
    sources: {
      "FileUploadLogger.sol": { content: contractSource }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"]
        }
      }
    }
  };

  const output = JSON.parse(compiler.compile(JSON.stringify(input)));
  const contract = output.contracts["FileUploadLogger.sol"]["FileUploadLogger"];
  const abi = contract.abi;
  const bytecode = "0x" + contract.evm.bytecode.object;

  contractAbi = abi;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const deployed = await factory.deploy();
  await deployed.deployed();

  contractAddress = deployed.address;
  return deployed.deployTransaction.hash;
}

// ✅ Setup solc-js (only used for deployContractLive if needed)
async function setupSolidityCompiler() {
  const solc = await window.solc.setupMethods(window.Module);
  return solc;
}

// ✅ Send metadata transaction to the deployed contract (now fixed to include summary)
async function sendUploadTransaction(cid, metadataHash, summary) {
  const finalAddress = window.contractAddress || contractAddress;
  const finalAbi = window.contractAbi || contractAbi;

  if (!finalAddress || !finalAbi) {
    return alert("Contract not available. Please deploy first.");
  }

  try {
    const provider = new window.ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new window.ethers.Contract(finalAddress, finalAbi, signer);

    const tx = await contract.logUpload(cid, metadataHash, summary); // ✅ Now passing all 3 required args
    const receipt = await tx.wait();

    return receipt.transactionHash;

  } catch (err) {
    console.error("❌ Transaction failed:", err);
    throw err;
  }
}
