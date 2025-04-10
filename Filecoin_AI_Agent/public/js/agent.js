document.addEventListener('DOMContentLoaded', () => {
    const agentOutput = document.getElementById('agentOutput');
    const userInput = document.getElementById('userInput');
    const sendInputBtn = document.getElementById('sendInput');
  
    const fileInput = document.getElementById('jsonFile');
    const connectBtn = document.getElementById('connectWallet');
    const compileButton = document.getElementById('compileContractButton');
    const deployButton = document.getElementById('deployContractButton');
  
    const uploadSection = document.getElementById('uploadSection');
    const walletSection = document.getElementById('walletSection');
    const contractPreviewSection = document.getElementById('contractPreviewSection');
    const summarySection = document.getElementById('summarySection');
  
    const summaryOutput = document.getElementById('summaryOutput');
    const contractSourcePreview = document.getElementById('contractSourcePreview');
    const resultBox = document.getElementById('resultBox');
    const txHashOutput = document.getElementById('txHashOutput');
    const contractAddressOutput = document.getElementById('contractAddressOutput');
    const cidOutput = document.getElementById('cidOutput');
    const metadataHashOutput = document.getElementById('metadataHashOutput');
  
    const compileStatus = document.getElementById('compileStatus');
    const compileStatusText = document.getElementById('compileStatusText');
  
    const metadataOutputSection = document.getElementById('metadataOutputSection');
    const metadataJsonOutput = document.getElementById('metadataJsonOutput');
    const downloadButton = document.getElementById('downloadMetadataButton');
  
    let hasUploadedFile = false;
    let isWalletConnected = false;
    let latestUploadData = null;
    let contractSource = "";
    let compiledAbi = null;
    let compiledBytecode = null;
    let deployedContractAddress = null;
  
    const compilerWorker = new Worker('/js/solc-worker.js');
  
    function agentSay(text) {
      const message = document.createElement('div');
      message.className = 'agent-message';
      message.innerText = text;
      agentOutput.appendChild(message);
      agentOutput.scrollTop = agentOutput.scrollHeight;
    }
  
    function showCompileStatus(message, success = true) {
      compileStatus.style.display = 'block';
      compileStatusText.style.color = success ? 'green' : 'red';
      compileStatusText.innerText = message;
    }
  
    function logStep(label, data = null) {
      console.log(`%c[AGENT] ${label}`, "color: limegreen; font-weight: bold;");
      if (data) console.log(data);
    }
  
    function logError(label, error = null) {
      console.error(`%c[AGENT ERROR] ${label}`, "color: red; font-weight: bold;");
      if (error) console.error(error);
    }
  
    async function waitForEthers(timeout = 3000, interval = 100) {
      let waited = 0;
      while (
        (
          typeof window.ethers === 'undefined' ||
          typeof window.ethers.providers === 'undefined' ||
          typeof window.ethers.ContractFactory === 'undefined'
        ) &&
        waited < timeout
      ) {
        await new Promise(res => setTimeout(res, interval));
        waited += interval;
      }
  
      const isReady = (
        typeof window.ethers !== 'undefined' &&
        typeof window.ethers.providers !== 'undefined' &&
        typeof window.ethers.ContractFactory !== 'undefined'
      );
  
      console.log("[waitForEthers] Ready:", isReady, "| Waited:", waited, "ms");
      return isReady;
    }
  
    // 1️⃣ Upload intent
    sendInputBtn.addEventListener('click', () => {
      const value = userInput.value.trim().toLowerCase();
      if (value.includes('upload') && value.includes('filecoin')) {
        agentSay("📁 Please upload your JSON file to get started.");
        uploadSection.style.display = 'block';
        userInput.disabled = true;
        sendInputBtn.style.display = 'none';
        logStep("User intent recognized: upload to Filecoin");
      } else {
        agentSay("💬 Try saying: 'I want to upload data to Filecoin.'");
      }
      userInput.value = '';
    });
  
    // 2️⃣ Upload file + AI summary
    fileInput.addEventListener('change', async () => {
      if (!fileInput.files[0]) return;
  
      agentSay("🧠 Processing your file...");
      logStep("Processing uploaded file...");
  
      const formData = new FormData();
      formData.append('jsonFile', fileInput.files[0]);
  
      try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        const data = await response.json();
  
        latestUploadData = data;
        hasUploadedFile = true;
  
        summaryOutput.innerText = data.summary;
        summarySection.style.display = 'block';
        uploadSection.style.display = 'none';
  
        agentSay("🔐 Please connect your MetaMask wallet.");
        walletSection.style.display = 'block';
        logStep("File uploaded and summarized", data);
      } catch (err) {
        agentSay("❌ Failed to process file.");
        logError("Failed to upload/summarize file", err);
      }
    });
  
    // 3️⃣ Wallet connected → generate contract
    window.addEventListener('walletConnected', () => {
      isWalletConnected = true;
      walletSection.style.display = 'none';
  
      if (!hasUploadedFile) {
        agentSay("⚠️ Wallet connected, but no file uploaded.");
        return;
      }
  
      const summary = latestUploadData.summary.replace(/["']/g, '');
      contractSource = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  contract FileUploadLogger {
    struct File {
      address uploader;
      string cid;
      string metadataHash;
      string summary;
      uint256 timestamp;
    }
  
    event FileUploaded(address indexed user, string cid, string metadataHash, string summary, uint256 timestamp);
  
    mapping(string => File) public uploads;
  
    function logUpload(
      string memory cid,
      string memory metadataHash,
      string memory summary
    ) public {
      uploads[cid] = File(msg.sender, cid, metadataHash, summary, block.timestamp);
      emit FileUploaded(msg.sender, cid, metadataHash, summary, block.timestamp);
    }
  }`;
  
      contractSourcePreview.value = contractSource;
      contractPreviewSection.style.display = 'block';
      compileButton.style.display = 'inline-block';
      agentSay("📜 Contract ready. Click 'Compile Contract' to continue.");
      logStep("Contract generated from AI summary");
    });
  
    // 4️⃣ Compile
    compileButton.addEventListener('click', () => {
      agentSay("⚙️ Starting compilation...");
      showCompileStatus("🟡 Compiling contract...", true);
      compilerWorker.postMessage({ command: 'loadCompiler' });
    });
  
    compilerWorker.onmessage = (event) => {
      const { status, message, abi, bytecode, error } = event.data;
  
      if (status === 'loaded') {
        agentSay("✅ Compiler loaded. Now compiling...");
        showCompileStatus("🟡 Compiling contract...", true);
        compilerWorker.postMessage({
          command: 'compile',
          data: { contractSource }
        });
        logStep("Compiler loaded");
      }
  
      if (status === 'compiled') {
        compiledAbi = abi;
        compiledBytecode = bytecode;
        agentSay("✅ Compilation complete. Click 'Deploy Contract' to continue.");
        showCompileStatus("✅ Compilation successful! Ready to deploy.", true);
        deployButton.style.display = 'inline-block';
        logStep("Compilation successful", { abi, bytecode });
      }
  
      if (status === 'error') {
        compiledAbi = null;
        compiledBytecode = null;
        agentSay(`❌ Compilation error: ${message}`);
        showCompileStatus(`❌ Compilation failed: ${message}`, false);
        logError("Compilation failed", error);
      }
    };
  
    // 5️⃣ Deploy + output metadata summary
    deployButton.addEventListener('click', async () => {
      if (!compiledAbi || !compiledBytecode) {
        agentSay("❌ Please compile the contract first.");
        return;
      }
  
      const ready = await waitForEthers();
      if (!ready) {
        agentSay("❌ ethers.js is not available. Please refresh and try again.");
        logError("ethers.js did not initialize");
        return;
      }
  
      try {
        const provider = new window.ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        agentSay("🦊 Deploying contract via MetaMask...");
        logStep("Deploying contract...");
  
        const factory = new window.ethers.ContractFactory(compiledAbi, compiledBytecode, signer);
        const deployed = await factory.deploy();
        await deployed.deployed();
  
        deployedContractAddress = deployed.address;
        window.contractAddress = deployed.address;
        window.contractAbi = compiledAbi;
  
        contractAddressOutput.innerText = deployed.address;
        agentSay(`✅ Contract deployed at:\n${deployed.address}`);
        resultBox.style.display = 'block';
  
        logStep("Contract deployed", deployed.address);
  
        // ✅ Generate metadata summary JSON output
        const { cid, metadataHash, summary } = latestUploadData;
        const metadata = {
          cid,
          metadataHash,
          summary,
          contractAddress: deployed.address,
          timestamp: new Date().toISOString(),
          source: "Filecoin AI Upload Agent"
        };
  
        const jsonString = JSON.stringify(metadata, null, 2);
        metadataJsonOutput.innerText = jsonString;
        metadataOutputSection.style.display = 'block';
  
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        downloadButton.href = url;
        downloadButton.download = `filecoin-metadata-${cid.slice(0, 6)}.json`;
        downloadButton.onclick = () => setTimeout(() => URL.revokeObjectURL(url), 2000);
  
        logStep("Metadata summary ready for download", metadata);
      } catch (err) {
        agentSay("❌ Deployment failed.");
        logError("Deployment failed", err);
      }
    });
  });
  