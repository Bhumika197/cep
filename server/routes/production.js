const express = require('express');
const router = express.Router();
const { getProductionLogs, getProductionLogById } = require('../controllers/productionController');

// GET /api/production - Get all production logs
router.get('/', getProductionLogs);

// GET /api/production/:id - Get production log by ID
router.get('/:id', getProductionLogById);

module.exports = router;
