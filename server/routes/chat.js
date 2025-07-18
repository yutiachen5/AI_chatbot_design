const express = require('express');
const { callDeepseek } = require('../deepseekClient');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("📨 Message received:", req.body.message);

    const reply = await callDeepseek(req.body.message);

    console.log("✅ Reply from Deepseek:", reply);
    res.json({ reply });
  } catch (e) {
    console.error("❌ Error calling Deepseek:", e);
    res.status(500).json({ error: 'LLM error' });
  }
});

module.exports = router;