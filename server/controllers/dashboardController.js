const ProductionLog = require('../models/ProductionLog');
const WasteRecord = require('../models/WasteRecord');
const Farmer = require('../models/Farmer');

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const { farmerId, days = 7 } = req.query;
    
    let matchQuery = {};
    if (farmerId) {
      matchQuery.farmerId = farmerId;
    }

    // Date range for the last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    matchQuery.date = { $gte: startDate };

    // Total yield, revenue, and profit
    const totals = await ProductionLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalVermicompostYield: { $sum: '$vermicompostYield' },
          totalBiopesticideVolume: { $sum: '$biopesticideVolume' },
          totalRevenue: { $sum: { $add: ['$vermicompostRevenue', '$biopesticideRevenue'] } },
          totalProfit: { $sum: '$dailyProfit' },
          totalInputCost: { $sum: '$inputCost' },
          totalLaborCost: { $sum: '$laborCost' }
        }
      }
    ]);

    // Daily revenue trend for the last 7 days
    const revenueTrend = await ProductionLog.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          dailyRevenue: { $sum: { $add: ['$vermicompostRevenue', '$biopesticideRevenue'] } },
          dailyProfit: { $sum: '$dailyProfit' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Today's summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySummary = await ProductionLog.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: { $add: ['$vermicompostRevenue', '$biopesticideRevenue'] } },
          todayProfit: { $sum: '$dailyProfit' },
          todayVermicompost: { $sum: '$vermicompostYield' },
          todayBiopesticide: { $sum: '$biopesticideVolume' }
        }
      }
    ]);

    // Farmer statistics
    const farmerStats = await Farmer.aggregate([
      ...(farmerId ? [{ $match: { _id: farmerId } }] : []),
      {
        $group: {
          _id: null,
          totalFarmers: { $sum: 1 },
          totalCows: { $sum: '$numberOfCows' }
        }
      }
    ]);

    const summary = {
      totals: totals[0] || {
        totalVermicompostYield: 0,
        totalBiopesticideVolume: 0,
        totalRevenue: 0,
        totalProfit: 0,
        totalInputCost: 0,
        totalLaborCost: 0
      },
      revenueTrend,
      today: todaySummary[0] || {
        todayRevenue: 0,
        todayProfit: 0,
        todayVermicompost: 0,
        todayBiopesticide: 0
      },
      farmerStats: farmerStats[0] || {
        totalFarmers: 0,
        totalCows: 0
      }
    };

    res.json({
      success: true,
      data: summary,
      message: 'Dashboard summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardSummary
};
