const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockData = {
  farmers: [
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
    },
    {
      _id: '2',
      userId: '1',
      vermicompostYield: 15,
      biopesticideVolume: 20,
      vermicompostRevenue: 120,
      biopesticideRevenue: 300,
      inputCost: 50,
      laborCost: 100,
      dailyProfit: 270,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    }
  ]
};

// Authentication endpoint - simplified and error-free
app.post('/api/auth/login', (req, res) => {
  try {
    const { phoneNumber, name } = req.body;
    
    // Use mock data for reliable operation
    const existingFarmer = mockData.farmers.find(f => f.phone === phoneNumber);
    
    if (existingFarmer) {
      // Existing user - return their data
      res.json({
        success: true,
        data: {
          user: existingFarmer,
          isNewUser: false,
          message: 'Welcome back!'
        }
      });
    } else {
      // New user - create user record
      const newMockUser = {
        _id: Date.now().toString(),
        name,
        phone: phoneNumber,
        numberOfCows: 0,
        primaryGoal: 'both',
        languagePreference: 'hi',
        createdAt: new Date()
      };
      
      mockData.farmers.push(newMockUser);
      
      res.json({
        success: true,
        data: {
          user: newMockUser,
          isNewUser: true,
          message: 'Welcome to Smart Gaushala!'
        }
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

// Dashboard endpoint - simplified and reliable
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const { userId } = req.query;
    
    // Use mock data for reliability
    const userLogs = mockData.productionLogs.filter(log => log.userId === userId);
    const user = mockData.farmers.find(f => f._id === userId);
    
    // Calculate user-specific totals
    const totals = userLogs.reduce((acc, log) => {
      acc.totalVermicompostYield += log.vermicompostYield;
      acc.totalBiopesticideVolume += log.biopesticideVolume;
      acc.totalRevenue += log.vermicompostRevenue + log.biopesticideRevenue;
      acc.totalProfit += log.dailyProfit;
      acc.totalInputCost += log.inputCost;
      acc.totalLaborCost += log.laborCost;
      return acc;
    }, {
      totalVermicompostYield: 0,
      totalBiopesticideVolume: 0,
      totalRevenue: 0,
      totalProfit: 0,
      totalInputCost: 0,
      totalLaborCost: 0
    });
    
    // Generate revenue trend for last 7 days
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = userLogs.filter(log => 
        log.date.toISOString().split('T')[0] === dateStr
      );
      
      const dayRevenue = dayLogs.reduce((sum, log) => 
        sum + log.vermicompostRevenue + log.biopesticideRevenue, 0
      );
      
      const dayProfit = dayLogs.reduce((sum, log) => 
        sum + log.dailyProfit, 0
      );
      
      revenueTrend.push({
        _id: dateStr,
        dailyRevenue: dayRevenue,
        dailyProfit: dayProfit
      });
    }
    
    // Today's summary
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = userLogs.filter(log => 
      log.date.toISOString().split('T')[0] === today
    );
    const todaySummary = todayLogs.length > 0 ? todayLogs.reduce((acc, log) => {
      acc.todayRevenue += log.vermicompostRevenue + log.biopesticideRevenue;
      acc.todayProfit += log.dailyProfit;
      acc.todayVermicompost += log.vermicompostYield;
      acc.todayBiopesticide += log.biopesticideVolume;
      return acc;
    }, {
      todayRevenue: 0,
      todayProfit: 0,
      todayVermicompost: 0,
      todayBiopesticide: 0
    }) : {
      todayRevenue: 0,
      todayProfit: 0,
      todayVermicompost: 0,
      todayBiopesticide: 0
    };
    
    res.json({
      success: true,
      data: {
        totals,
        revenueTrend,
        today: todaySummary,
        farmerStats: {
          totalFarmers: 1,
          totalCows: user?.numberOfCows || 0
        }
      },
      message: 'Dashboard summary retrieved successfully'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

app.get('/api/farmers', (req, res) => {
  res.json({
    success: true,
    data: mockData.farmers,
    message: 'Farmers retrieved successfully'
  });
});

app.post('/api/waste', (req, res) => {
  try {
    const { dungCollected, urineCollected, laborHours, inputCost, userId } = req.body;
    
    // Calculate conversion
    const vermicompostYield = dungCollected * 0.6;
    const biopesticideVolume = urineCollected * 0.8;
    const vermicompostRevenue = vermicompostYield * 8;
    const biopesticideRevenue = biopesticideVolume * 15;
    const laborCost = laborHours * 50;
    const totalRevenue = vermicompostRevenue + biopesticideRevenue;
    const dailyProfit = totalRevenue - inputCost - laborCost;
    
    // Create waste record
    const wasteRecord = {
      _id: Date.now().toString(),
      userId: userId,
      dungCollected,
      urineCollected,
      laborHours,
      date: new Date()
    };
    
    // Create production log
    const productionLog = {
      _id: (Date.now() + 1).toString(),
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
    
    // Store in mock data
    mockData.productionLogs.push(productionLog);
    
    res.json({
      success: true,
      data: {
        wasteRecord,
        production: productionLog
      },
      message: 'Waste record and production log created successfully'
    });
  } catch (error) {
    console.error('Waste entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save waste record'
    });
  }
});

app.post('/api/waste/convert', (req, res) => {
  try {
    const { dungCollected, urineCollected, laborHours, inputCost } = req.body;
    
    // Calculate conversion
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
      },
      message: 'Conversion calculated successfully'
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate conversion'
    });
  }
});

app.get('/api/production', (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get user-specific production logs from mock data
    const userLogs = mockData.productionLogs.filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .reverse()
      .slice(0, 10);
    
    const totalCount = mockData.productionLogs.filter(log => log.userId === userId).length;
    
    res.json({
      success: true,
      data: {
        logs: userLogs,
        pagination: {
          page: 1,
          limit: 10,
          total: totalCount,
          pages: Math.ceil(totalCount / 10)
        }
      },
      message: 'Production logs retrieved successfully'
    });
  } catch (error) {
    console.error('Production logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load production logs'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Auto-restart mechanism
let server;
let restartCount = 0;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    restartCount = 0;
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use, trying to kill existing process...`);
      const { exec } = require('child_process');
      exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
        if (stdout) {
          const lines = stdout.split('\n');
          lines.forEach(line => {
            const match = line.match(/\s+(\d+)/);
            if (match) {
              const pid = match[1];
              console.log(`Killing process ${pid}`);
              exec(`taskkill /f /pid ${pid}`, () => {
                setTimeout(startServer, 2000);
              });
            }
          });
        }
      });
    } else {
      // Auto-restart on other errors
      restartCount++;
      if (restartCount < 5) {
        console.log(`Restarting server (attempt ${restartCount}/5)...`);
        setTimeout(startServer, 3000);
      } else {
        console.error('Server failed to start after 5 attempts');
        process.exit(1);
      }
    }
  });

  server.on('close', () => {
    console.log('Server closed, restarting...');
    setTimeout(startServer, 2000);
  });
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});

// Start the server
startServer();
