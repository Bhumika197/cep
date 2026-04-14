// Mock API - Frontend-only solution
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

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Authentication
  login: async (phoneNumber, name) => {
    await delay(500); // Simulate network delay
    
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
    
    return {
      success: true,
      data: {
        user,
        isNewUser: !users.find(u => u.phone === phoneNumber && u.name === name),
        message: 'Welcome!'
      }
    };
  },

  // Dashboard
  getDashboardSummary: async (userId) => {
    await delay(300);
    
    const userLogs = productionLogs.filter(log => log.userId === userId);
    const user = users.find(u => u._id === userId);
    
    const totals = userLogs.reduce((acc, log) => {
      acc.totalVermicompostYield += log.vermicompostYield || 0;
      acc.totalBiopesticideVolume += log.biopesticideVolume || 0;
      acc.totalRevenue += (log.vermicompostRevenue || 0) + (log.biopesticideRevenue || 0);
      acc.totalProfit += log.dailyProfit || 0;
      return acc;
    }, { totalVermicompostYield: 0, totalBiopesticideVolume: 0, totalRevenue: 0, totalProfit: 0 });
    
    return {
      success: true,
      data: {
        totals,
        revenueTrend: [],
        today: { todayRevenue: 0, todayProfit: 0, todayVermicompost: 0, todayBiopesticide: 0 },
        farmerStats: { totalFarmers: 1, totalCows: user?.numberOfCows || 0 }
      }
    };
  },

  // Waste Entry
  saveWasteEntry: async (data) => {
    await delay(400);
    
    const { dungCollected, urineCollected, laborHours, inputCost, userId } = data;
    
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
    
    return {
      success: true,
      data: { production: productionLog },
      message: 'Success'
    };
  },

  // Production History
  getProductionHistory: async (userId) => {
    await delay(300);
    
    const userLogs = productionLogs.filter(log => log.userId === userId);
    
    return {
      success: true,
      data: {
        logs: userLogs.reverse(),
        pagination: { page: 1, limit: 10, total: userLogs.length, pages: 1 }
      }
    };
  },

  // Waste Convert
  calculateConversion: async (data) => {
    await delay(200);
    
    const { dungCollected, urineCollected, laborHours, inputCost } = data;
    
    const vermicompostYield = dungCollected * 0.6;
    const biopesticideVolume = urineCollected * 0.8;
    const vermicompostRevenue = vermicompostYield * 8;
    const biopesticideRevenue = biopesticideVolume * 15;
    const laborCost = laborHours * 50;
    const totalRevenue = vermicompostRevenue + biopesticideRevenue;
    const dailyProfit = totalRevenue - inputCost - laborCost;
    
    return {
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
    };
  },

  // Health check
  health: async () => {
    await delay(100);
    return { success: true, message: 'Mock API running' };
  }
};
