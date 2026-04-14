const http = require('http');
const url = require('url');

const PORT = 5005;

// Data storage
let users = [
  { _id: '1', name: 'Ramesh Kumar', phone: '+919876543210', numberOfCows: 5, primaryGoal: 'vermicompost', languagePreference: 'hi', createdAt: new Date() },
  { _id: '2', name: 'Sita Devi', phone: '+919812345678', numberOfCows: 3, primaryGoal: 'biopesticide', languagePreference: 'hi', createdAt: new Date() }
];

let productionLogs = [];

// CORS headers
const setCORS = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Parse request body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });
};

// Handle requests
const handleRequest = async (req, res) => {
  setCORS(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  try {
    // Auth endpoint
    if (path === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { phoneNumber, name } = body;
      
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
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          user,
          isNewUser: !users.find(u => u.phone === phoneNumber && u.name === name),
          message: 'Welcome!'
        }
      }));
      return;
    }
    
    // Dashboard endpoint
    if (path === '/api/dashboard/summary' && method === 'GET') {
      const { userId } = parsedUrl.query;
      const userLogs = productionLogs.filter(log => log.userId === userId);
      const user = users.find(u => u._id === userId);
      
      const totals = userLogs.reduce((acc, log) => {
        acc.totalVermicompostYield += log.vermicompostYield || 0;
        acc.totalBiopesticideVolume += log.biopesticideVolume || 0;
        acc.totalRevenue += (log.vermicompostRevenue || 0) + (log.biopesticideRevenue || 0);
        acc.totalProfit += log.dailyProfit || 0;
        return acc;
      }, { totalVermicompostYield: 0, totalBiopesticideVolume: 0, totalRevenue: 0, totalProfit: 0 });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          totals,
          revenueTrend: [],
          today: { todayRevenue: 0, todayProfit: 0, todayVermicompost: 0, todayBiopesticide: 0 },
          farmerStats: { totalFarmers: 1, totalCows: user?.numberOfCows || 0 }
        }
      }));
      return;
    }
    
    // Waste entry endpoint
    if (path === '/api/waste' && method === 'POST') {
      const body = await parseBody(req);
      const { dungCollected, urineCollected, laborHours, inputCost, userId } = body;
      
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
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: { production: productionLog },
        message: 'Success'
      }));
      return;
    }
    
    // Production history endpoint
    if (path === '/api/production' && method === 'GET') {
      const { userId } = parsedUrl.query;
      const userLogs = productionLogs.filter(log => log.userId === userId);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          logs: userLogs.reverse(),
          pagination: { page: 1, limit: 10, total: userLogs.length, pages: 1 }
        }
      }));
      return;
    }
    
    // Waste convert endpoint
    if (path === '/api/waste/convert' && method === 'POST') {
      const body = await parseBody(req);
      const { dungCollected, urineCollected, laborHours, inputCost } = body;
      
      const vermicompostYield = dungCollected * 0.6;
      const biopesticideVolume = urineCollected * 0.8;
      const vermicompostRevenue = vermicompostYield * 8;
      const biopesticideRevenue = biopesticideVolume * 15;
      const laborCost = laborHours * 50;
      const totalRevenue = vermicompostRevenue + biopesticideRevenue;
      const dailyProfit = totalRevenue - inputCost - laborCost;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
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
      }));
      return;
    }
    
    // Health check
    if (path === '/api/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Server running', port: PORT }));
      return;
    }
    
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Not found' }));
    
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Server error' }));
  }
};

// Create server
const server = http.createServer(handleRequest);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple HTTP server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});
