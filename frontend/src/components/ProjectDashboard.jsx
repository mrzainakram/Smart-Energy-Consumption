import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

const ProjectDashboard = ({ onLogout, user, theme = 'dark' }) => {
  // State variables
  const [billData, setBillData] = useState({
    consumedUnits: 0,
    billPrice: 0
  });
  const [predictions, setPredictions] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [applianceData, setApplianceData] = useState({
    ac: '',
    refrigerator: '',
    oven: '',
    washingMachine: '',
    tv: ''
  });
  const [seasonalFactors, setSeasonalFactors] = useState(null);
  const [houseComparison, setHouseComparison] = useState(null);
  const [house1Data, setHouse1Data] = useState({
    occupants: 4,
    square_feet: 1500,
    appliance_age: 'medium',
    insulation: 'good',
    ac_units: 1,
    solar_panels: false
  });
  const [house2Data, setHouse2Data] = useState({
    occupants: 3,
    square_feet: 1200,
    appliance_age: 'new',
    insulation: 'excellent',
    ac_units: 1,
    solar_panels: true
  });
  const [showSeasonalAnalysis, setShowSeasonalAnalysis] = useState(false);
  const [showHouseComparison, setShowHouseComparison] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Functions
  const calculateSlabWiseBill = (units) => {
    let bill = 0;
    if (units <= 100) {
      bill = units * 3.95;
    } else if (units <= 200) {
      bill = 100 * 3.95 + (units - 100) * 7.34;
    } else if (units <= 300) {
      bill = 100 * 3.95 + 100 * 7.34 + (units - 200) * 10.06;
    } else if (units <= 400) {
      bill = 100 * 3.95 + 100 * 7.34 + 100 * 10.06 + (units - 300) * 16.10;
    } else if (units <= 500) {
      bill = 100 * 3.95 + 100 * 7.34 + 100 * 10.06 + 100 * 16.10 + (units - 400) * 20.00;
    } else {
      bill = 100 * 3.95 + 100 * 7.34 + 100 * 10.06 + 100 * 16.10 + 100 * 20.00 + (units - 500) * 22.00;
    }
    return Math.round(bill);
  };

  const getOffPeakRecommendations = () => {
    return [
      "Use heavy appliances during off-peak hours (10 PM - 6 AM)",
      "Set AC temperature to 26°C for optimal efficiency",
      "Unplug chargers when not in use",
      "Use LED bulbs instead of incandescent",
      "Regular maintenance of AC filters"
    ];
  };

  const handlePrediction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8001/api/predict/energy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consumed_units: parseInt(billData.consumedUnits),
          appliance_data: applianceData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPredictions(data);
      } else {
        setError(data.message || 'Prediction failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8001/api/ocr/scan-bill/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setOcrResult(data);
        setBillData({
          consumedUnits: data.consumed_units || 0,
          billPrice: data.bill_price || 0
        });
      } else {
        setError(data.message || 'OCR scanning failed. Please try manual input.');
      }
    } catch (error) {
      setError('Network error. Please try manual input.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSeasonalFactors = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/seasonal-factors/');
      if (response.ok) {
        const data = await response.json();
        setSeasonalFactors(data);
      }
    } catch (error) {
      console.error('Error fetching seasonal factors:', error);
    }
  };

  const performHouseComparison = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/enhanced-compare-houses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          house1: house1Data,
          house2: house2Data
        })
      });
      if (response.ok) {
        const data = await response.json();
        setHouseComparison(data);
      }
    } catch (error) {
      console.error('Error comparing houses:', error);
    }
  };

  const updateHouseData = (houseNumber, field, value) => {
    if (houseNumber === 1) {
      setHouse1Data(prev => ({ ...prev, [field]: value }));
    } else {
      setHouse2Data(prev => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentSeason = () => {
    const month = currentTime.getMonth() + 1;
    if (month >= 3 && month <= 8) return 'summer';
    return 'winter';
  };

  const getPeakHours = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour <= 10) return 'peak';
    if (hour >= 18 && hour <= 22) return 'peak';
    if (hour >= 22 || hour <= 6) return 'off-peak';
    return 'normal';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} text-white p-6 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with 3D Effects */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <h1 className="text-5xl font-bold text-cyan-300 mb-4 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
              ⚡ Smart Energy Dashboard
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 blur-xl opacity-30 -z-10"></div>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            AI-Powered Energy Consumption Prediction & Optimization
          </p>
          
          {/* User Status & Time */}
          <div className="flex justify-center items-center space-x-6 mb-4">
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-3 border border-cyan-400/30">
              <span className="text-cyan-300 font-semibold">👤 {user?.email ? user.email.split('@')[0] : 'User'}</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-3 border border-green-400/30">
              <span className="text-green-300 font-semibold">🕐 {currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-3 border border-purple-400/30">
              <span className="text-purple-300 font-semibold">🌤️ {getCurrentSeason().charAt(0).toUpperCase() + getCurrentSeason().slice(1)}</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-3 border border-yellow-400/30">
              <span className="text-yellow-300 font-semibold">⚡ {getPeakHours() === 'peak' ? 'Peak Hours' : getPeakHours() === 'off-peak' ? 'Off-Peak' : 'Normal'}</span>
            </div>
          </div>

          {/* Theme Toggle & Logout */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button
            onClick={onLogout}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
              🚪 Logout
            </button>
          </div>
        </motion.div>

        {/* Bill Scanning & Manual Input Section */}
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">Energy Bill Analysis & Prediction</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bill Scanning & OCR */}
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200">
              <label htmlFor="bill-upload" className="cursor-pointer text-center">
                <div className="text-gray-400 text-6xl mb-3">📸</div>
                <p className="text-blue-600 font-semibold mb-2">Scan Bill</p>
                <p className="text-sm text-gray-500">Click to upload bill image</p>
              <input
                  id="bill-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                  className="hidden"
              />
              </label>
              {uploadedImage && (
                <img src={uploadedImage} alt="Uploaded Bill" className="mt-4 max-h-48 rounded-lg shadow-md" />
              )}
              {ocrResult && (
                <div className="mt-4 text-sm text-gray-700 text-center">
                  <p><strong>OCR Result:</strong></p>
                  <p>Consumed Units: {ocrResult.consumed_units}</p>
                  <p>Bill Price: Rs. {ocrResult.bill_price}</p>
                </div>
              )}
            </div>

            {/* Manual Input */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Manual Input</h3>
              <div>
                <label htmlFor="consumedUnits" className="block text-sm font-medium text-gray-700 mb-1">Consumed Units</label>
                <input
                  type="number"
                  id="consumedUnits"
                  value={billData.consumedUnits}
                  onChange={(e) => setBillData(prev => ({ ...prev, consumedUnits: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="e.g., 300"
                />
              </div>
              <div>
                <label htmlFor="billPrice" className="block text-sm font-medium text-gray-700 mb-1">Bill Price (Rs.)</label>
                <input
                  type="number"
                  id="billPrice"
                  value={billData.billPrice}
                  onChange={(e) => setBillData(prev => ({ ...prev, billPrice: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="e.g., 5000"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Appliance Usage (Units)</h3>
              <div className="grid grid-cols-2 gap-4">
              {Object.entries(applianceData).map(([appliance, value]) => (
                <div key={appliance}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {appliance.replace(/([A-Z])/g, ' $1').trim()}: 
                  </label>
                  <input
                    type="number"
                    value={value}
                      onChange={(e) => setApplianceData(prev => ({ ...prev, [appliance]: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g., 10"
                  />
                </div>
              ))}
              </div>
            </div>
            </div>

          <div className="text-center mt-6">
            <button
              onClick={handlePrediction}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Prediction...
                </div>
              ) : (
                'Get Energy Prediction'
              )}
            </button>
          </div>
          </motion.div>

        {/* Seasonal Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="text-blue-600 mr-2">🌤️</span>
              Seasonal Energy Analysis
            </h3>
            <div className="flex gap-2">
              <button
                onClick={fetchSeasonalFactors}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Seasonal Analysis
              </button>
              <button
                onClick={() => setShowSeasonalAnalysis(!showSeasonalAnalysis)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showSeasonalAnalysis ? 'Hide Analysis' : 'Show Analysis'}
              </button>
            </div>
          </div>
          
          {showSeasonalAnalysis && (
            <div>
              {seasonalFactors ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      Current Season: {getCurrentSeason().charAt(0).toUpperCase() + getCurrentSeason().slice(1)}
                    </h4>
                    <p className="text-gray-600">
                      {getCurrentSeason() === 'summer' 
                        ? '🌞 Summer: Higher energy consumption due to AC usage. Expected 20-30% increase in bills.'
                        : '❄️ Winter: Lower energy consumption. Expected 15-25% decrease in bills.'
                      }
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Peak vs Off-Peak Hours</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-red-600">Peak Hours (6-10 AM, 6-10 PM)</p>
                        <p className="text-sm text-gray-600">Higher rates, avoid heavy appliances</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-600">Off-Peak Hours (10 PM - 6 AM)</p>
                        <p className="text-sm text-gray-600">Lower rates, best for heavy appliances</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🌤️</div>
                  <p className="text-gray-600">Click "Get Seasonal Analysis" to see detailed breakdown</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* House Comparison Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="text-green-600 mr-2">🏠</span>
              House Energy Efficiency Comparison
            </h3>
            <button
              onClick={() => setShowHouseComparison(!showHouseComparison)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {showHouseComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>
          
          {showHouseComparison && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* House 1 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">🏠 House 1 Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Number of Occupants</label>
                      <input
                        type="number"
                        value={house1Data.occupants}
                        onChange={(e) => updateHouseData(1, 'occupants', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="4"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Square Feet</label>
                      <input
                        type="number"
                        value={house1Data.square_feet}
                        onChange={(e) => updateHouseData(1, 'square_feet', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Appliance Age</label>
                      <select
                        value={house1Data.appliance_age}
                        onChange={(e) => updateHouseData(1, 'appliance_age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">New (0-2 years)</option>
                        <option value="medium">Medium (3-7 years)</option>
                        <option value="old">Old (8+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Insulation Quality</label>
                      <select
                        value={house1Data.insulation}
                        onChange={(e) => updateHouseData(1, 'insulation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="standard">Standard</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">AC Units</label>
                      <input
                        type="number"
                        value={house1Data.ac_units}
                        onChange={(e) => updateHouseData(1, 'ac_units', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={house1Data.solar_panels}
                        onChange={(e) => updateHouseData(1, 'solar_panels', e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-600">Solar Panels</label>
                    </div>
                  </div>
                </div>

                {/* House 2 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">🏠 House 2 Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Number of Occupants</label>
                      <input
                        type="number"
                        value={house2Data.occupants}
                        onChange={(e) => updateHouseData(2, 'occupants', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Square Feet</label>
                      <input
                        type="number"
                        value={house2Data.square_feet}
                        onChange={(e) => updateHouseData(2, 'square_feet', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Appliance Age</label>
                      <select
                        value={house2Data.appliance_age}
                        onChange={(e) => updateHouseData(2, 'appliance_age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="new">New (0-2 years)</option>
                        <option value="medium">Medium (3-7 years)</option>
                        <option value="old">Old (8+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Insulation Quality</label>
                      <select
                        value={house2Data.insulation}
                        onChange={(e) => updateHouseData(2, 'insulation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="standard">Standard</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">AC Units</label>
                      <input
                        type="number"
                        value={house2Data.ac_units}
                        onChange={(e) => updateHouseData(2, 'ac_units', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={house2Data.solar_panels}
                        onChange={(e) => updateHouseData(2, 'solar_panels', e.target.checked)}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-600">Solar Panels</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Button */}
              <div className="text-center mb-6">
                <button
                  onClick={performHouseComparison}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-medium"
                >
                  🔍 Compare Houses
                </button>
              </div>
              
              {houseComparison ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Comparison Results</h4>
                    <p className="text-gray-600">House comparison analysis completed. Check detailed results below.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">🏠</div>
                  <p className="text-gray-600">Fill in house details and click "Compare Houses" to see analysis</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Predictions Display Section */}
        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-6"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">Predictions & Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Consumption & Prediction */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Current & Predicted</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Units:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.current_consumption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Bill:</span>
                    <span className="text-cyan-300 font-semibold">Rs. {predictions.current_bill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Next Month:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.next_month_prediction} units</span>
                    </div>
                </div>
              </div>

              {/* Slab-wise Billing */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Slab-wise Billing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Slab:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.slab_wise_billing?.current_slab}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rate per Unit:</span>
                    <span className="text-cyan-300 font-semibold">Rs. {predictions.slab_wise_billing?.current_rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Cost:</span>
                    <span className="text-cyan-300 font-semibold">Rs. {predictions.slab_wise_billing?.total_cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Gov Charges:</span>
                    <span className="text-cyan-300 font-semibold">Rs. {predictions.slab_wise_billing?.gov_charges}</span>
                  </div>
                </div>
              </div>

              {/* Energy Analysis */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Energy Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Consumption Level:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.energy_analysis?.consumption_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Potential Savings:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.energy_analysis?.potential_savings?.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Units Saved:</span>
                    <span className="text-cyan-300 font-semibold">{predictions.energy_analysis?.potential_savings?.units_saved}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Predictions */}
            {predictions.future_predictions && (
              <div className="mt-6 bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Future Predictions (2025-2030)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(predictions.future_predictions).map(([year, data]) => (
                    <div key={year} className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-cyan-300">{year}</div>
                      <div className="text-sm text-gray-300">{data.consumption} units</div>
                      <div className="text-xs text-gray-400">Rs. {data.estimated_bill}</div>
                      <div className="text-xs text-green-400">+{data.growth_rate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {predictions.energy_analysis?.recommendations && (
              <div className="mt-6 bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Energy Saving Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictions.energy_analysis.recommendations.slice(0, 6).map((rec, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="text-sm text-gray-300">{rec}</div>
                    </div>
                  ))}
              </div>
            </div>
            )}
          </motion.div>
        )}

        {/* History Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-300"
          >
            {showHistory ? 'Hide History' : 'Show Prediction History'}
          </button>
        </motion.div>

        {/* History Section */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-purple-300 mb-6">Prediction History</h2>
              <div className="text-center text-gray-400">
                <p>No prediction history available yet.</p>
                <p>Make your first prediction to see history here.</p>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot */}
        <div className="mt-8">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard; 