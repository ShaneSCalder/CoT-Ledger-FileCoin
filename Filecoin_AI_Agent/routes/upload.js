const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { OpenAI } = require('openai');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', upload.single('jsonFile'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jsonContent = fs.readFileSync(filePath, 'utf8');

    // 1. Get summary from ChatGPT
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: `Summarize this JSON:\n${jsonContent}` }]
    });
    const summary = chat.choices[0].message.content;

    // 2. Fake a CID (IPFS-like format)
    const cid = 'bafy' + crypto.randomBytes(32).toString('hex').slice(0, 59);

    // 3. Create metadata hash (summary + fake cid)
    const metadataHash = crypto
      .createHash('sha256')
      .update(summary + cid)
      .digest('hex');

    res.json({
      cid,
      summary,
      metadataHash
    });

    fs.unlinkSync(filePath); // optional: clean up temp file

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;



