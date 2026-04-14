const ProductionLog = require('../models/ProductionLog');

// Get all production logs
const getProductionLogs = async (req, res) => {
  try {
    const { farmerId, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (farmerId) {
      query.farmerId = farmerId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;
    
    const productionLogs = await ProductionLog.find(query)
      .populate('wasteRecordId', 'dungCollected urineCollected laborHours')
      .populate('farmerId', 'name phone')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProductionLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs: productionLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      message: 'Production logs retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get production log by ID
const getProductionLogById = async (req, res) => {
  try {
    const productionLog = await ProductionLog.findById(req.params.id)
      .populate('wasteRecordId', 'dungCollected urineCollected laborHours')
      .populate('farmerId', 'name phone');
    
    if (!productionLog) {
      return res.status(404).json({
        success: false,
        message: 'Production log not found'
      });
    }

    res.json({
      success: true,
      data: productionLog,
      message: 'Production log retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProductionLogs,
  getProductionLogById
};
