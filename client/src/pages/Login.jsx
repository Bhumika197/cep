import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Shield, ArrowRight, Loader, User, Key } from 'lucide-react';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (phoneNumber.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      // Mock OTP generation
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setMockOtp(generatedOtp);
      
      console.log(`Mock OTP for ${phoneNumber}: ${generatedOtp}`);
      
      // Show OTP input immediately
      setShowOtp(true);
      setLoading(false);

    } catch (error) {
      setError(error.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (otp !== mockOtp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // Login with complete user data
      const userData = {
        phoneNumber: `+91${phoneNumber}`,
        name: name.trim()
      };

      const authResult = await login(userData);
      
      // Navigate immediately to dashboard
      navigate('/dashboard');

    } catch (error) {
      setError(error.message || 'OTP verification failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-earth-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Gaushala Assistant
          </h1>
          <p className="text-gray-600">
            Transform cow waste into profitable products
          </p>
        </div>

        <div className="card">
          {!showOtp ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="input-field pl-10"
                    maxLength={10}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 10-digit mobile number
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  OTP sent to +91{phoneNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Check console for mock OTP
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="input-field pl-10"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full btn-secondary"
              >
                Back
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <div className="text-center text-sm text-gray-600">
            <p>Mock OTP system - Check browser console for OTP</p>
          </div>
          
          {/* Quick Login Options */}
          <div className="border-t pt-4">
            <p className="text-center text-xs text-gray-500 mb-3">Quick Test Options:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setName('Ramesh Kumar');
                  setPhoneNumber('9876543210');
                }}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100 transition-colors"
              >
                Existing User
              </button>
              <button
                type="button"
                onClick={() => {
                  setName('Test User');
                  setPhoneNumber('9999999999');
                }}
                className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded hover:bg-green-100 transition-colors"
              >
                New User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
