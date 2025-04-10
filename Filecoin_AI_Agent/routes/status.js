// routes/status.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const WEB3_STORAGE_TOKEN = 'YOUR_WEB3_STORAGE_API_TOKEN';

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const response = await axios.get(`https://api.web3.storage/status/${cid}`, {
      headers: {
        Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Status check failed:', err);
    res.status(500).json({ error: 'Failed to fetch CID status' });
  }
});

module.exports = router;
