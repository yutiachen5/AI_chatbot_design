const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { sku, model } = req.query;
  res.json({ compatible: true, note: 'Fits compatible models.' });
});

module.exports = router;