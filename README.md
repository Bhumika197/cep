# Smart Gaushala Assistant (SGA)

An AI-powered platform for rural Indian farmers to convert cow dung and urine into profitable products like Vermicompost and Bio-pesticide.

## 🌟 Features

- **Phone OTP Authentication** - Simple Firebase-based login for rural users
- **Dashboard Analytics** - Real-time insights with charts and summaries
- **Waste Entry System** - Log daily cow dung and urine collection
- **Profit Tracking** - Detailed profit analysis and breakdown
- **Production History** - Paginated records with filtering
- **Mobile-First Design** - Responsive UI optimized for rural users
- **Real-time Calculations** - Live profit preview as you type

## 🛠 Tech Stack

### Frontend
- React.js 18 with Vite
- Tailwind CSS for styling
- Chart.js for data visualization
- React Router v6 for navigation
- Firebase Authentication (Phone OTP)
- Axios for API calls
- Lucide React Icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- RESTful API architecture
- Firebase Admin SDK
- Async/await error handling

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account
- Firebase project with Phone Auth enabled

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd smart-gaushala

# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Environment Configuration

#### Backend Environment (server/.env)
```env
MONGO_URI=mongodb+srv://24reddyc_db_user:yDwq51DKNwL7WAOi@cluster0.ioefoog.mongodb.net/gaushala
FIREBASE_PROJECT_ID=smart-gaushala
PORT=5000
```

#### Frontend Environment (client/.env)
```env
VITE_FIREBASE_API_KEY=AIzaSyC_KjR0sXAXm97uFGsy0LObdNvfkSPZx2Q
VITE_FIREBASE_AUTH_DOMAIN=smart-gaushala.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=smart-gaushala
VITE_FIREBASE_STORAGE_BUCKET=smart-gaushala.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=418539506019
VITE_FIREBASE_APP_ID=1:418539506019:web:df49c5943e96356119eb56
```

### 3. Firebase Setup

1. Go to Firebase Console
2. Create a new project or use existing one
3. Enable Authentication → Phone Sign-in
4. Add your domain to authorized domains (localhost for development)
5. Copy Firebase config to client/.env
6. Download service account key and place in server/

### 4. Run the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
# Backend only
npm run server

# Frontend only  
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
smart-gaushala/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/    # Reusable components
│   │   ├── contexts/     # React contexts
│   │   └── firebase.js   # Firebase config
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── middleware/       # Custom middleware
│   ├── engine/           # Business logic
│   └── index.js         # Server entry point
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Farmers
- `GET /api/farmers` - Get all farmers
- `POST /api/farmers` - Create new farmer
- `GET /api/farmers/:id` - Get farmer by ID

### Waste Records
- `GET /api/waste` - Get all waste records
- `POST /api/waste` - Create waste record
- `POST /api/waste/convert` - Calculate conversion

### Production Logs
- `GET /api/production` - Get production logs with pagination
- `GET /api/production/:id` - Get production log by ID

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary data

## 📊 Conversion Formulas

- **Vermicompost Yield (kg)** = dungCollected × 0.6
- **Bio-pesticide Volume (L)** = urineCollected × 0.8
- **Vermicompost Revenue (Rs)** = yield × 8
- **Bio-pesticide Revenue (Rs)** = volume × 15
- **Daily Profit (Rs)** = Total Revenue - inputCost - laborCost

## 🎨 UI Features

- **Mobile-First Design**: Optimized for smartphones and tablets
- **Rural-Friendly**: Simple interface with large touch targets
- **Real-Time Feedback**: Live profit calculations
- **Data Visualization**: Interactive charts and graphs
- **Responsive Layout**: Works on all screen sizes

## 🔐 Authentication

- Firebase Phone OTP authentication
- Secure session management
- Automatic logout on token expiry
- Phone number verification

## 📱 Pages

1. **Login** - Phone OTP authentication
2. **Dashboard** - Overview with charts and quick actions
3. **Waste Entry** - Form with real-time profit preview
4. **Profit View** - Detailed profit analysis
5. **History** - Paginated production records

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGO_URI in server/.env
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP

2. **Firebase OTP Not Working**
   - Verify Firebase project settings
   - Check phone number format (+91 prefix)
   - Ensure domain is authorized in Firebase

3. **CORS Issues**
   - Backend runs on port 5000, frontend on 3000
   - Vite proxy configuration handles CORS in development

4. **Build Errors**
   - Run `npm run install-all` to install all dependencies
   - Check Node.js version (16+ required)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- Create an issue in the repository
- Contact the development team

---

**Smart Gaushala Assistant** - Empowering rural farmers with technology 🚜🌱
