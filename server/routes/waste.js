const express = require('express');
const router = express.Router();
const { getWasteRecords, createWasteRecord, convertWaste } = require('../controllers/wasteController');

// GET /api/waste - Get all waste records
router.get('/', getWasteRecords);

// POST /api/waste - Create new waste record
router.post('/', createWasteRecord);

// POST /api/waste/convert - Convert waste to products calculation
router.post('/convert', convertWaste);

module.exports = router;
