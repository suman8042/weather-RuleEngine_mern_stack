const express = require('express');
const router = express.Router();
const { createRule, evaluateRule, combineRules } = require('../controllers/ruleEngineController');

// Routes
router.post('/create', createRule);
router.post('/evaluate', evaluateRule);
router.post('/combine', combineRules);

module.exports = router;
