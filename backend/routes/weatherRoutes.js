const express = require('express');
const { getDailySummary } = require('../controllers/weatherController');
const router = express.Router();

// GET: Daily weather summary
router.get('/daily-summary', getDailySummary);

module.exports = router;
