const WasteRecord = require('../models/WasteRecord');
const { calculateConversion } = require('../engine/conversionEngine');
const ProductionLog = require('../models/ProductionLog');

// Get all waste records
const getWasteRecords = async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = {};
    
    if (farmerId) {
      query.farmerId = farmerId;
    }

    const wasteRecords = await WasteRecord.find(query)
      .populate('farmerId', 'name phone')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: wasteRecords,
      message: 'Waste records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new waste record
const createWasteRecord = async (req, res) => {
  try {
    const { farmerId, dungCollected, urineCollected, laborHours, inputCost } = req.body;

    // Create waste record
    const wasteRecord = new WasteRecord({
      farmerId,
      dungCollected,
      urineCollected,
      laborHours,
      date: new Date()
    });

    await wasteRecord.save();

    // Calculate conversion
    const conversion = calculateConversion(dungCollected, urineCollected, laborHours, inputCost || 0);

    // Create production log
    const productionLog = new ProductionLog({
      wasteRecordId: wasteRecord._id,
      farmerId,
      vermicompostYield: conversion.vermicompostYield,
      biopesticideVolume: conversion.biopesticideVolume,
      vermicompostRevenue: conversion.vermicompostRevenue,
      biopesticideRevenue: conversion.biopesticideRevenue,
      inputCost: inputCost || 0,
      laborCost: conversion.laborCost,
      dailyProfit: conversion.dailyProfit,
      date: new Date()
    });

    await productionLog.save();

    res.status(201).json({
      success: true,
      data: {
        wasteRecord,
        production: conversion,
        productionLog
      },
      message: 'Waste record and production log created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Convert waste to products (separate endpoint)
const convertWaste = async (req, res) => {
  try {
    const { dungCollected, urineCollected, laborHours, inputCost } = req.body;

    const conversion = calculateConversion(dungCollected, urineCollected, laborHours, inputCost || 0);

    res.json({
      success: true,
      data: conversion,
      message: 'Conversion calculated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getWasteRecords,
  createWasteRecord,
  convertWaste
};
