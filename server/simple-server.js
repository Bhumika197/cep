const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Simple mock data
let users = [
  { _id: '1', name: 'Ramesh Kumar', phone: '+919876543210', numberOfCows: 5, primaryGoal: 'vermicompost', languagePreference: 'hi', createdAt: new Date() },
  { _id: '2', name: 'Sita Devi', phone: '+919812345678', numberOfCows: 3, primaryGoal: 'biopesticide', languagePreference: 'hi', createdAt: new Date() }
];

let productionLogs = [
  {
    _id: '1',
    userId: '1',
    vermicompostYield: 12,
    biopesticideVolume: 16,
    vermicompostRevenue: 96,
    biopesticideRevenue: 240,
    inputCost: 40,
    laborCost: 120,
    dailyProfit: 176,
    date: new Date()
  }
];

// Authentication
app.post('/api/auth/login', (req, res) => {
  try {
    const { phoneNumber, name } = req.body;
    let user = users.find(u => u.phone === phoneNumber);
    
    if (!user) {
      user = {
        _id: Date.now().toString(),
        name,
        phone: phoneNumber,
        numberOfCows: 0,
        primaryGoal: 'both',
        languagePreference: 'hi',
        createdAt: new Date()
      };
      users.push(user);
    }
    
    res.json({
      success: true,
      data: {
        user,
        isNewUser: !users.find(u => u.phone === phoneNumber && u.name === name),
        message: user._id < Date.now().toString() ? 'Welcome back!' : 'Welcome to Smart Gaushala!'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Dashboard
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const { userId } = req.query;
    const userLogs = productionLogs.filter(log => log.userId === userId);
    const user = users.find(u => u._id === userId);
    
    const totals = userLogs.reduce((acc, log) => {
      acc.totalVermicompostYield += log.vermicompostYield;
      acc.totalBiopesticideVolume += log.biopesticideVolume;
      acc.totalRevenue += log.vermicompostRevenue + log.biopesticideRevenue;
      acc.totalProfit += log.dailyProfit;
      return acc;
    }, {
      totalVermicompostYield: 0,
      totalBiopesticideVolume: 0,
      totalRevenue: 0,
      totalProfit: 0
    });
    
    // Generate revenue trend from user logs
    const revenueTrend = userLogs.map(log => ({
      _id: log.date.toISOString().split('T')[0],
      dailyRevenue: log.vermicompostRevenue + log.biopesticideRevenue,
      dailyProfit: log.dailyProfit
    }));

    // Calculate today's performance
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = userLogs.filter(log => log.date.toISOString().split('T')[0] === today);
    const todayTotals = todayLogs.reduce((acc, log) => {
      acc.todayRevenue += log.vermicompostRevenue + log.biopesticideRevenue;
      acc.todayProfit += log.dailyProfit;
      acc.todayVermicompost += log.vermicompostYield;
      acc.todayBiopesticide += log.biopesticideVolume;
      return acc;
    }, { todayRevenue: 0, todayProfit: 0, todayVermicompost: 0, todayBiopesticide: 0 });

    res.json({
      success: true,
      data: {
        totals,
        revenueTrend,
        today: todayTotals,
        farmerStats: { totalFarmers: 1, totalCows: user?.numberOfCows || 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Waste Entry
app.post('/api/waste', (req, res) => {
  try {
    const { dungCollected, urineCollected, laborHours, inputCost, userId } = req.body;
    
    const vermicompostYield = dungCollected * 0.6;
    const biopesticideVolume = urineCollected * 0.8;
    const vermicompostRevenue = vermicompostYield * 8;
    const biopesticideRevenue = biopesticideVolume * 15;
    const laborCost = laborHours * 50;
    const totalRevenue = vermicompostRevenue + biopesticideRevenue;
    const dailyProfit = totalRevenue - inputCost - laborCost;
    
    const productionLog = {
      _id: Date.now().toString(),
      userId: userId,
      vermicompostYield: Math.round(vermicompostYield * 100) / 100,
      biopesticideVolume: Math.round(biopesticideVolume * 100) / 100,
      vermicompostRevenue: Math.round(vermicompostRevenue * 100) / 100,
      biopesticideRevenue: Math.round(biopesticideRevenue * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      dailyProfit: Math.round(dailyProfit * 100) / 100,
      inputCost: Math.round(inputCost * 100) / 100,
      date: new Date()
    };
    
    productionLogs.push(productionLog);
    console.log('Waste entry saved:', productionLog);
    console.log('Total production logs:', productionLogs.length);
    
    res.json({
      success: true,
      data: { production: productionLog },
      message: 'Success'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Production History
app.get('/api/production', (req, res) => {
  try {
    const { userId } = req.query;
    const userLogs = productionLogs.filter(log => log.userId === userId);
    
    res.json({
      success: true,
      data: {
        logs: userLogs.reverse(),
        pagination: { page: 1, limit: 10, total: userLogs.length, pages: 1 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Waste Convert
app.post('/api/waste/convert', (req, res) => {
  try {
    const { dungCollected, urineCollected, laborHours, inputCost } = req.body;
    
    const vermicompostYield = dungCollected * 0.6;
    const biopesticideVolume = urineCollected * 0.8;
    const vermicompostRevenue = vermicompostYield * 8;
    const biopesticideRevenue = biopesticideVolume * 15;
    const laborCost = laborHours * 50;
    const totalRevenue = vermicompostRevenue + biopesticideRevenue;
    const dailyProfit = totalRevenue - inputCost - laborCost;
    
    res.json({
      success: true,
      data: {
        vermicompostYield: Math.round(vermicompostYield * 100) / 100,
        biopesticideVolume: Math.round(biopesticideVolume * 100) / 100,
        vermicompostRevenue: Math.round(vermicompostRevenue * 100) / 100,
        biopesticideRevenue: Math.round(biopesticideRevenue * 100) / 100,
        laborCost: Math.round(laborCost * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        dailyProfit: Math.round(dailyProfit * 100) / 100,
        inputCost: Math.round(inputCost * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
