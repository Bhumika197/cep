const Farmer = require('../models/Farmer');

// Get all farmers
const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: farmers,
      message: 'Farmers retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new farmer
const createFarmer = async (req, res) => {
  try {
    const { name, phone, numberOfCows, primaryGoal, languagePreference } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ phone });
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this phone number already exists'
      });
    }

    const farmer = new Farmer({
      name,
      phone,
      numberOfCows,
      primaryGoal,
      languagePreference: languagePreference || 'hi'
    });

    await farmer.save();

    res.status(201).json({
      success: true,
      data: farmer,
      message: 'Farmer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get farmer by ID
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.json({
      success: true,
      data: farmer,
      message: 'Farmer retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getFarmers,
  createFarmer,
  getFarmerById
};
