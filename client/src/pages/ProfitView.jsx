import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, Package, Clock, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfitView = () => {
  const { currentUser } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfitData();
  }, [currentUser]);

  // Add refresh mechanism - check for new data every 5 seconds
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        fetchProfitData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchProfitData = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.get(`http://localhost:5002/api/dashboard/summary?userId=${currentUser._id}`);
      const data = response.data.data;
      
      setTodayData(data.today);
      setWeeklyData(data.totals);
    } catch (error) {
      setError('Failed to load profit data');
      console.error('Profit view error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
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
        <div className="text-red-600 mb-4 flex items-center justify-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button onClick={fetchProfitData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Profit Analysis</h1>
        <div className="text-sm text-gray-600">
          Financial performance overview
        </div>
      </div>

      {/* Today's Profit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`card ${todayData?.todayProfit >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Profit</p>
              <p className={`text-2xl font-bold mt-1 ${todayData?.todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(todayData?.todayProfit || 0)}
              </p>
            </div>
            {todayData?.todayProfit >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-600" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(todayData?.todayRevenue || 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vermicompost</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {todayData?.todayVermicompost?.toFixed(1) || 0} kg
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bio-pesticide</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {todayData?.todayBiopesticide?.toFixed(1) || 0} L
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Weekly Summary (Last 7 Days)</span>
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm font-medium text-primary-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(weeklyData?.totalRevenue || 0)}
                </p>
              </div>
              
              <div className={`rounded-lg p-4 ${weeklyData?.totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${weeklyData?.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Total Profit
                </p>
                <p className={`text-xl font-bold mt-1 ${weeklyData?.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(weeklyData?.totalProfit || 0)}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Yield</span>
                <span className="font-semibold">
                  {weeklyData?.totalVermicompostYield?.toFixed(1) || 0} kg
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Volume</span>
                <span className="font-semibold">
                  {weeklyData?.totalBiopesticideVolume?.toFixed(1) || 0} L
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Total Labor Cost</span>
                </span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(weeklyData?.totalLaborCost || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Input Cost</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(weeklyData?.totalInputCost || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profit Breakdown</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Vermicompost Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(weeklyData?.totalRevenue * 0.6 || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Bio-pesticide Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(weeklyData?.totalRevenue * 0.4 || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-earth-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Costs</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency((weeklyData?.totalLaborCost || 0) + (weeklyData?.totalInputCost || 0))}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Net Profit Margin</span>
                <span className={`font-semibold ${weeklyData?.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyData?.totalRevenue > 0 
                    ? `${((weeklyData?.totalProfit / weeklyData?.totalRevenue) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Profit Tip</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Focus on increasing vermicompost production as it generates 60% of your revenue.
                    Optimize labor hours to improve profit margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitView;
