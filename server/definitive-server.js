const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file
let data = {
  users: [
    { _id: '1', name: 'Ramesh Kumar', phone: '+919876543210', numberOfCows: 5, primaryGoal: 'vermicompost', languagePreference: 'hi', createdAt: new Date() },
    { _id: '2', name: 'Sita Devi', phone: '+919812345678', numberOfCows: 3, primaryGoal: 'biopesticide', languagePreference: 'hi', createdAt: new Date() }
  ],
  productionLogs: [
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
  ]
};

// Save data to file
const saveData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load data from file
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Load initial data
loadData();

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { phoneNumber, name } = req.body;
    let user = data.users.find(u => u.phone === phoneNumber);
    
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
      data.users.push(user);
      saveData();
    }
    
    res.json({
      success: true,
      data: {
        user,
        isNewUser: !data.users.find(u => u.phone === phoneNumber && u.name === name),
        message: 'Welcome!'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Dashboard endpoint
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const { userId } = req.query;
    const userLogs = data.productionLogs.filter(log => log.userId === userId);
    const user = data.users.find(u => u._id === userId);
    
    const totals = userLogs.reduce((acc, log) => {
      acc.totalVermicompostYield += log.vermicompostYield || 0;
      acc.totalBiopesticideVolume += log.biopesticideVolume || 0;
      acc.totalRevenue += (log.vermicompostRevenue || 0) + (log.biopesticideRevenue || 0);
      acc.totalProfit += log.dailyProfit || 0;
      return acc;
    }, { totalVermicompostYield: 0, totalBiopesticideVolume: 0, totalRevenue: 0, totalProfit: 0 });
    
    res.json({
      success: true,
      data: {
        totals,
        revenueTrend: [],
        today: { todayRevenue: 0, todayProfit: 0, todayVermicompost: 0, todayBiopesticide: 0 },
        farmerStats: { totalFarmers: 1, totalCows: user?.numberOfCows || 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Waste entry endpoint
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
    
    data.productionLogs.push(productionLog);
    saveData();
    
    res.json({
      success: true,
      data: { production: productionLog },
      message: 'Success'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Production history endpoint
app.get('/api/production', (req, res) => {
  try {
    const { userId } = req.query;
    const userLogs = data.productionLogs.filter(log => log.userId === userId);
    
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

// Waste convert endpoint
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Definitive server running on port ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
