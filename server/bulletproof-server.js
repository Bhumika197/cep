const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

// Static data storage
let users = [
  { _id: '1', name: 'Ramesh Kumar', phone: '+919876543210', numberOfCows: 5, primaryGoal: 'vermicompost', languagePreference: 'hi', createdAt: new Date() },
  { _id: '2', name: 'Sita Devi', phone: '+919812345678', numberOfCows: 3, primaryGoal: 'biopesticide', languagePreference: 'hi', createdAt: new Date() }
];

let productionLogs = [];

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
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
      message: 'Welcome!'
    }
  });
});

// Dashboard endpoint
app.get('/api/dashboard/summary', (req, res) => {
  const { userId } = req.query;
  const userLogs = productionLogs.filter(log => log.userId === userId);
  const user = users.find(u => u._id === userId);
  
  const totals = userLogs.reduce((acc, log) => {
    acc.totalVermicompostYield += log.vermicompostYield || 0;
    acc.totalBiopesticideVolume += log.biopesticideVolume || 0;
    acc.totalRevenue += (log.vermicompostRevenue || 0) + (log.biopesticideRevenue || 0);
    acc.totalProfit += log.dailyProfit || 0;
    return acc;
  }, { totalVermicompostYield: 0, totalBiopesticideVolume: 0, totalRevenue: 0, totalProfit: 0 });
  
  res.json({
    success: true,
    data: { totals, revenueTrend: [], today: { todayRevenue: 0, todayProfit: 0, todayVermicompost: 0, todayBiopesticide: 0 }, farmerStats: { totalFarmers: 1, totalCows: user?.numberOfCows || 0 } }
  });
});

// Waste entry endpoint
app.post('/api/waste', (req, res) => {
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
  
  res.json({
    success: true,
    data: { production: productionLog },
    message: 'Success'
  });
});

// Production history endpoint
app.get('/api/production', (req, res) => {
  const { userId } = req.query;
  const userLogs = productionLogs.filter(log => log.userId === userId);
  
  res.json({
    success: true,
    data: {
      logs: userLogs.reverse(),
      pagination: { page: 1, limit: 10, total: userLogs.length, pages: 1 }
    }
  });
});

// Waste convert endpoint
app.post('/api/waste/convert', (req, res) => {
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
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', port: PORT });
});

// Start server - bulletproof
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bulletproof server running on port ${PORT}`);
});

// Handle all possible errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', () => {
  console.log('Server closed');
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('SIGTERM received');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('SIGINT received');
    process.exit(0);
  });
});
