import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WasteEntry from './pages/WasteEntry';
import ProfitView from './pages/ProfitView';
import History from './pages/History';
import Navbar from './components/Navbar';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && <Navbar />}
      <main className={`container mx-auto px-4 py-6 ${!currentUser ? 'flex items-center justify-center min-h-screen' : ''}`}>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/entry" element={currentUser ? <WasteEntry /> : <Navigate to="/login" replace />} />
          <Route path="/profit" element={currentUser ? <ProfitView /> : <Navigate to="/login" replace />} />
          <Route path="/history" element={currentUser ? <History /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
