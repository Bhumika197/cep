import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Calculator, Save, TrendingUp, Package, DollarSign, Clock, AlertCircle } from 'lucide-react';

const WasteEntry = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    dungCollected: '',
    urineCollected: '',
    laborHours: '',
    inputCost: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    calculateConversion();
  }, [formData.dungCollected, formData.urineCollected, formData.laborHours, formData.inputCost]);

  const calculateConversion = async () => {
    const dung = parseFloat(formData.dungCollected) || 0;
    const urine = parseFloat(formData.urineCollected) || 0;
    const labor = parseFloat(formData.laborHours) || 0;
    const input = parseFloat(formData.inputCost) || 0;

    if (dung === 0 && urine === 0 && labor === 0) {
      setConversion(null);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/waste/convert`, {
        dungCollected: dung,
        urineCollected: urine,
        laborHours: labor,
        inputCost: input
      });
      setConversion(response.data.data);
    } catch (error) {
      console.error('Conversion calculation error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        userId: currentUser._id,
        dungCollected: parseFloat(formData.dungCollected),
        urineCollected: parseFloat(formData.urineCollected),
        laborHours: parseFloat(formData.laborHours),
        inputCost: parseFloat(formData.inputCost) || 0
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/waste`, payload);
      setSuccess('Waste record saved successfully!');
      
      // Reset form
      setFormData({
        dungCollected: '',
        urineCollected: '',
        laborHours: '',
        inputCost: '',
        date: new Date().toISOString().split('T')[0]
      });
      setConversion(null);

      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save waste record');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Log Waste</h1>
        <p className="text-gray-600">Enter daily waste collection data</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Waste Collection Data</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cow Dung Collected (kg)
              </label>
              <input
                type="number"
                name="dungCollected"
                value={formData.dungCollected}
                onChange={handleInputChange}
                placeholder="0"
                step="0.1"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cow Urine Collected (litres)
              </label>
              <input
                type="number"
                name="urineCollected"
                value={formData.urineCollected}
                onChange={handleInputChange}
                placeholder="0"
                step="0.1"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labor Hours
              </label>
              <input
                type="number"
                name="laborHours"
                value={formData.laborHours}
                onChange={handleInputChange}
                placeholder="0"
                step="0.5"
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Input Cost (Rs)
              </label>
              <input
                type="number"
                name="inputCost"
                value={formData.inputCost}
                onChange={handleInputChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Record</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time Preview */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Profit Preview</span>
          </h2>

          {conversion ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-600">Vermicompost</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {conversion.vermicompostYield.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(conversion.vermicompostRevenue)}
                  </p>
                </div>

                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-600">Bio-pesticide</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {conversion.biopesticideVolume.toFixed(1)} L
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(conversion.biopesticideRevenue)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Total Revenue</span>
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(conversion.totalRevenue)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Labor Cost</span>
                  </span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(conversion.laborCost)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Input Cost</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(parseFloat(formData.inputCost) || 0)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Daily Profit</span>
                    <span className={`text-xl font-bold ${
                      conversion.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(conversion.dailyProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Enter waste data to see profit preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteEntry;
