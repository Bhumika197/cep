import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { PlusCircle, TrendingUp, History, Package, DollarSign, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  // Add refresh mechanism - check for new data every 5 seconds
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/dashboard/summary?userId=${currentUser._id}`);
      setSummary(response.data.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const chartData = {
    labels: summary?.revenueTrend?.map(item => {
      const date = new Date(item._id);
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: summary?.revenueTrend?.map(item => item.dailyRevenue) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Daily Profit',
        data: summary?.revenueTrend?.map(item => item.dailyProfit) || [],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={fetchDashboardData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {currentUser?.isNewUser !== undefined && (
        <div className={`p-4 rounded-lg ${
          currentUser.isNewUser 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${
                currentUser.isNewUser ? 'text-green-800' : 'text-blue-800'
              }`}>
                {currentUser.isNewUser ? 'Welcome to Smart Gaushala!' : 'Welcome back!'}
              </h2>
              <p className={`text-sm mt-1 ${
                currentUser.isNewUser ? 'text-green-700' : 'text-blue-700'
              }`}>
                {currentUser.isNewUser 
                  ? `Hello ${currentUser.name}! Start by logging your first waste entry to begin your journey.`
                  : `Hello ${currentUser.name}! Here's your production overview.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last 7 days performance
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total Yield</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.totals?.totalVermicompostYield?.toFixed(1) || 0} kg
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Vermicompost
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary?.totals?.totalBiopesticideVolume?.toFixed(1) || 0} L
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Bio-pesticide
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(summary?.totals?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Last 7 days
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(summary?.totals?.totalProfit || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Last 7 days
              </p>
            </div>
            {summary?.totals?.totalProfit >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold">{formatCurrency(summary?.today?.todayRevenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit</span>
              <span className={`font-semibold ${summary?.today?.todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary?.today?.todayProfit || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vermicompost</span>
              <span className="font-semibold">{summary?.today?.todayVermicompost?.toFixed(1) || 0} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bio-pesticide</span>
              <span className="font-semibold">{summary?.today?.todayBiopesticide?.toFixed(1) || 0} L</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/entry" className="btn-primary flex items-center justify-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>Log Waste</span>
            </Link>
            <Link to="/profit" className="btn-secondary flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>View Profit</span>
            </Link>
            <Link to="/history" className="btn-secondary flex items-center justify-center space-x-2 col-span-2">
              <History className="w-4 h-4" />
              <span>View History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h2>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
