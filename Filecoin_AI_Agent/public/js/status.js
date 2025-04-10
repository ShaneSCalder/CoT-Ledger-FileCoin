// public/js/status.js

async function checkFilecoinStatus(cid, token) {
    const statusOutput = document.getElementById('statusOutput');
  
    try {
      const response = await fetch(`https://api.web3.storage/status/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      const pinStatus = data.pin.status;
      const dealStatus = data.deals.length > 0 ? data.deals[0].status : 'no active deals';
  
      statusOutput.innerHTML = `
        <p><strong>Pin Status:</strong> ${pinStatus}</p>
        <p><strong>Deal Status:</strong> ${dealStatus}</p>
        <p><a href="https://ipfs.io/ipfs/${cid}" target="_blank">Open IPFS File</a></p>
      `;
    } catch (err) {
      console.error("Error checking status:", err);
      statusOutput.innerHTML = `<p style="color: red;">Failed to fetch status for CID: ${cid}</p>`;
    }
  }
  