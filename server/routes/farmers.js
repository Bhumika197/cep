const express = require('express');
const router = express.Router();
const { getFarmers, createFarmer, getFarmerById } = require('../controllers/farmerController');

// GET /api/farmers - Get all farmers
router.get('/', getFarmers);

// POST /api/farmers - Create new farmer
router.post('/', createFarmer);

// GET /api/farmers/:id - Get farmer by ID
router.get('/:id', getFarmerById);

module.exports = router;
