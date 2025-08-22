import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CleanNavbar from './CleanNavbar';
import { useLanguage } from '../contexts/LanguageContext';

const EnhancedPredictionDashboard = ({ user, onLogout }) => {
  const { language, translate } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFuturePredictions, setShowFuturePredictions] = useState(false);
  const [showAppliances, setShowAppliances] = useState(true);
  const [showHouseComparison, setShowHouseComparison] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingManual, setIsLoadingManual] = useState(false);
  const [isLoadingAppliance, setIsLoadingAppliance] = useState(false);
  const [isLoadingHouse, setIsLoadingHouse] = useState(false);
  const [manualPredictions, setManualPredictions] = useState(null);
  const [appliancePredictions, setAppliancePredictions] = useState(null);
  const [housePredictions, setHousePredictions] = useState(null);
  const [error, setError] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const [billData, setBillData] = useState({
    consumedUnits: '',
    billPrice: '',
    selectedMonth: 1
  });

  const [billImage, setBillImage] = useState(null);
  const [scanningBill, setScanningBill] = useState(false);

  const [appliances, setAppliances] = useState([
    { id: 1, name: 'Refrigerator', category: 'Kitchen', efficiency: 'High', isSelected: false, quantity: 1, wattage: 150, hours: 24, icon: '❄️', energyRating: 'A++', monthlyCost: 0, recommendations: [] },
    { id: 2, name: 'Air Conditioner', category: 'Cooling', efficiency: 'Medium', isSelected: false, quantity: 1, wattage: 1500, hours: 8, icon: '❄️', energyRating: 'B', monthlyCost: 0, recommendations: [] },
    { id: 3, name: 'Washing Machine', category: 'Laundry', efficiency: 'High', isSelected: false, quantity: 1, wattage: 500, hours: 2, icon: '🧺', energyRating: 'A+', monthlyCost: 0, recommendations: [] },
    { id: 4, name: 'Microwave', category: 'Kitchen', efficiency: 'High', isSelected: false, quantity: 1, wattage: 1000, hours: 1, icon: '🍽️', energyRating: 'A', monthlyCost: 0, recommendations: [] },
    { id: 5, name: 'Television', category: 'Entertainment', efficiency: 'Medium', isSelected: false, quantity: 1, wattage: 200, hours: 6, icon: '📺', energyRating: 'B+', monthlyCost: 0, recommendations: [] },
    { id: 6, name: 'Computer', category: 'Office', efficiency: 'Medium', isSelected: false, quantity: 1, wattage: 300, hours: 8, icon: '💻', energyRating: 'B', monthlyCost: 0, recommendations: [] },
    { id: 7, name: 'Water Heater', category: 'Bathroom', efficiency: 'Low', isSelected: false, quantity: 1, wattage: 2000, hours: 2, icon: '🚿', energyRating: 'C', monthlyCost: 0, recommendations: [] },
    { id: 8, name: 'Dishwasher', category: 'Kitchen', efficiency: 'High', isSelected: false, quantity: 1, wattage: 1800, hours: 1, icon: '🍽️', energyRating: 'A', monthlyCost: 0, recommendations: [] },
    { id: 9, name: 'Dryer', category: 'Laundry', efficiency: 'Low', isSelected: false, quantity: 1, wattage: 3000, hours: 1, icon: '👕', energyRating: 'C', monthlyCost: 0, recommendations: [] },
    { id: 10, name: 'Oven', category: 'Kitchen', efficiency: 'Medium', isSelected: false, quantity: 1, wattage: 2400, hours: 2, icon: '🔥', energyRating: 'B', monthlyCost: 0, recommendations: [] },
    { id: 11, name: 'Blender', category: 'Kitchen', efficiency: 'High', isSelected: false, quantity: 1, wattage: 300, hours: 0.5, icon: '🥤', energyRating: 'A+', monthlyCost: 0, recommendations: [] },
    { id: 12, name: 'Fan', category: 'Cooling', efficiency: 'High', isSelected: false, quantity: 1, wattage: 75, hours: 12, icon: '💨', energyRating: 'A++', monthlyCost: 0, recommendations: [] }
  ]);

  const [applianceInputs, setApplianceInputs] = useState({});
  const [applianceResults, setApplianceResults] = useState(null);

  const [houses, setHouses] = useState([
    { id: 1, name: 'House 1', units: 500, price: 3000, month: 'January', solarPanels: false, acUnits: 2 }
  ]);

  // SECPARS Modal State
  const [showSECPARSModal, setShowSECPARSModal] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Timer for current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load/Save prediction history
  useEffect(() => {
    const saved = localStorage.getItem('predictionHistory');
    if (saved) {
      setPredictionHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
  }, [predictionHistory]);

  // Apply theme on component mount
  useEffect(() => {
    setTimeout(() => forceApplyTheme(), 500); // Apply theme after component is fully rendered
  }, []);

  // Force apply theme to ALL elements including navbar
  const forceApplyTheme = () => {
    console.log('Force applying theme to ALL elements:', isDarkMode ? 'Light (Pure White)' : 'Dark (Original)');
    
    if (isDarkMode) {
      // Light Mode - Pure White to ALL elements including navbar
      console.log('Applying pure white light theme to ALL elements including navbar...');
      
      // Target ALL dashboard cards, sections, and navbar - Pure White
      const allDashboardElements = document.querySelectorAll('.bg-gray-900\\/60, .bg-gray-800\\/50, .bg-gray-900\\/80, .bg-gray-800, .bg-gray-900, .bg-black, .bg-gray-800\\/30, .bg-gray-700, .bg-gray-600');
      allDashboardElements.forEach(el => {
        el.style.backgroundColor = '#ffffff'; // Pure white
        el.style.color = '#000000'; // Pure black
        el.style.borderColor = '#d1d5db'; // Light gray border
        console.log('Applied pure white theme to:', el.className);
      });
      
      // Target ALL text elements including navbar - Pure Black
      const allTextElements = document.querySelectorAll('.text-white, .text-gray-300, .text-gray-400, .text-gray-200, .text-gray-100');
      allTextElements.forEach(el => {
        el.style.color = '#000000'; // Pure black text
        console.log('Applied pure black text to:', el.className);
      });
      
      // Target ALL input fields - Pure White
      const allInputElements = document.querySelectorAll('input, select, textarea');
      allInputElements.forEach(el => {
        el.style.backgroundColor = '#ffffff'; // Pure white
        el.style.color = '#000000'; // Pure black
        el.style.borderColor = '#d1d5db'; // Light gray border
        console.log('Applied pure white theme to input:', el.tagName);
      });
      
      // Target ALL elements with any gray or black classes - Pure White
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const className = el.className || '';
        
        if (className.includes('bg-gray-') || className.includes('bg-black')) {
          el.style.backgroundColor = '#ffffff'; // Pure white
          el.style.color = '#000000'; // Pure black
          if (el.style.borderColor) {
            el.style.borderColor = '#d1d5db'; // Light gray border
          }
        }
        
        if (className.includes('text-white') || className.includes('text-gray-')) {
          el.style.color = '#000000'; // Pure black
        }
      });
      
      // Special targeting for navbar elements
      const navbarElements = document.querySelectorAll('nav, .navbar, [class*="nav"]');
      navbarElements.forEach(el => {
        if (el.style.backgroundColor && (el.style.backgroundColor.includes('gray') || el.style.backgroundColor.includes('black'))) {
          el.style.backgroundColor = '#ffffff'; // Pure white
        }
        if (el.style.color && (el.style.color.includes('white') || el.style.color.includes('gray'))) {
          el.style.color = '#000000'; // Pure black
        }
      });
      
    } else {
      // Dark Mode (Original) - Reset ALL elements to original
      console.log('Resetting ALL elements to original dark theme...');
      
      // Reset ALL dashboard elements
      const allDashboardElements = document.querySelectorAll('.bg-gray-900\\/60, .bg-gray-800\\/50, .bg-gray-900\\/80, .bg-gray-800, .bg-gray-900, .bg-black, .bg-gray-800\\/30, .bg-gray-700, .bg-gray-600');
      allDashboardElements.forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.borderColor = '';
      });
      
      // Reset ALL text elements
      const allTextElements = document.querySelectorAll('.text-white, .text-gray-300, .text-gray-400, .text-gray-200, .text-gray-100');
      allTextElements.forEach(el => {
        el.style.color = '';
      });
      
      // Reset ALL input fields
      const allInputElements = document.querySelectorAll('input, select, textarea');
      allInputElements.forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.borderColor = '';
      });
      
      // Reset ALL elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const className = el.className || '';
        
        if (className.includes('bg-gray-') || className.includes('bg-black')) {
          el.style.backgroundColor = '';
          el.style.color = '';
          if (el.style.borderColor) {
            el.style.borderColor = '';
          }
        }
        
        if (className.includes('text-white') || className.includes('text-gray-')) {
          el.style.color = '';
        }
      });
      
      // Reset navbar elements
      const navbarElements = document.querySelectorAll('nav, .navbar, [class*="nav"]');
      navbarElements.forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
      });
    }
  };

  // Theme effect
  useEffect(() => {
    console.log('Theme changed to:', isDarkMode ? 'Light' : 'Dark (Default)'); // Debug log
    
    if (isDarkMode) {
      // Light Mode - Professional implementation
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      
      // Set CSS custom properties for light theme
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-input', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#1e293b');
      document.documentElement.style.setProperty('--text-secondary', '#475569');
      document.documentElement.style.setProperty('--border-color', '#e2e8f0');
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      
      // Apply light theme globally
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e293b';
      
    } else {
      // Dark Mode (Default) - Professional implementation
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      
      // Set CSS custom properties for dark theme
      document.documentElement.style.setProperty('--bg-primary', '#000000');
      document.documentElement.style.setProperty('--bg-secondary', '#111827');
      document.documentElement.style.setProperty('--bg-card', '#1f2937');
      document.documentElement.style.setProperty('--bg-input', '#374151');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#d1d5db');
      document.documentElement.style.setProperty('--border-color', '#374151');
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
      
      // Apply dark theme globally
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    }
    
    // Add smooth transitions
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Show theme change notification
    const notification = document.createElement('div');
    notification.textContent = `Theme changed to ${isDarkMode ? 'Light' : 'Dark (Default)'} mode`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isDarkMode ? '#ffffff' : '#1f2937'};
      color: ${isDarkMode ? '#1e293b' : '#ffffff'};
      padding: 12px 20px;
      border-radius: 8px;
      border: 1px solid ${isDarkMode ? '#e2e8f0' : '#374151'};
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 6px ${isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)'};
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
    
  }, [isDarkMode]);

  // Language effect
  useEffect(() => {
    console.log('Language changed to:', language); // Debug log
    document.documentElement.lang = language;
    
    // Apply language-specific styles if needed
    if (language === 'urdu') {
      document.documentElement.style.direction = 'rtl';
      document.body.style.fontFamily = 'Arial, sans-serif';
    } else {
      document.documentElement.style.direction = 'ltr';
      document.body.style.fontFamily = 'Inter, system-ui, sans-serif';
    }
  }, [language]);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettings && !event.target.closest('.settings-panel')) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeasonalColor = (season) => {
    return season === 'summer' ? 'text-orange-400' : 'text-blue-400';
  };

  const toggleApplianceSelection = (id) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, isSelected: !app.isSelected } : app
    ));
  };

  const updateApplianceInput = (id, field, value) => {
    setApplianceInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const calculateApplianceConsumption = (appliance) => {
    const inputs = applianceInputs[appliance.id] || {};
    const quantity = inputs.quantity || appliance.quantity;
    const wattage = inputs.wattage || appliance.wattage;
    const hours = inputs.hours || appliance.hours;
    
    const dailyKWh = (wattage * hours * quantity) / 1000;
    const monthlyKWh = dailyKWh * 30;
    
    // Calculate monthly cost based on LESCO rates
    let monthlyCost = 0;
    if (monthlyKWh <= 100) {
      monthlyCost = monthlyKWh * 3.95;
    } else if (monthlyKWh <= 200) {
      monthlyCost = (100 * 3.95) + ((monthlyKWh - 100) * 7.34);
    } else if (monthlyKWh <= 300) {
      monthlyCost = (100 * 3.95) + (100 * 7.34) + ((monthlyKWh - 200) * 10.06);
    } else if (monthlyKWh <= 400) {
      monthlyCost = (100 * 3.95) + (100 * 7.34) + (100 * 10.06) + ((monthlyKWh - 300) * 15.28);
    } else {
      monthlyCost = (100 * 3.95) + (100 * 7.34) + (100 * 10.06) + (100 * 15.28) + ((monthlyKWh - 400) * 20.14);
    }
    
    return { 
      dailyKWh, 
      monthlyKWh, 
      monthlyCost: Math.round(monthlyCost),
      costPerUnit: monthlyCost / monthlyKWh
    };
  };

  const analyzeApplianceEfficiency = (appliance, consumption) => {
    const recommendations = [];
    const { monthlyKWh, monthlyCost, costPerUnit } = consumption;
    
    // High consumption warnings
    if (monthlyKWh > 200) {
      recommendations.push(`⚠️ HIGH CONSUMPTION: ${appliance.name} is consuming ${monthlyKWh.toFixed(1)} kWh/month`);
      recommendations.push(`💡 Consider reducing usage or upgrading to energy-efficient model`);
    }
    
    // Cost analysis
    if (monthlyCost > 1000) {
      recommendations.push(`💰 HIGH COST: Monthly bill for ${appliance.name} is PKR ${monthlyCost}`);
      recommendations.push(`💡 This appliance contributes significantly to your electricity bill`);
    }
    
    // Efficiency recommendations based on category
    if (appliance.category === 'Cooling') {
      if (appliance.name === 'Air Conditioner') {
        recommendations.push(`❄️ AC Tips: Set temperature to 24-26°C for optimal efficiency`);
        recommendations.push(`🌙 Use during off-peak hours (10 PM - 6 AM) to save money`);
        recommendations.push(`🧹 Clean AC filters monthly for better performance`);
      } else if (appliance.name === 'Fan') {
        recommendations.push(`💨 Fan is energy-efficient alternative to AC`);
        recommendations.push(`🔄 Use ceiling fans to circulate air effectively`);
      }
    }
    
    if (appliance.category === 'Kitchen') {
      if (appliance.name === 'Refrigerator') {
        recommendations.push(`❄️ Fridge Tips: Keep temperature at 2-4°C`);
        recommendations.push(`🚪 Don't leave door open, defrost regularly`);
        recommendations.push(`🌡️ Place away from heat sources`);
      } else if (appliance.name === 'Microwave') {
        recommendations.push(`🍽️ Microwave is more efficient than oven for small items`);
        recommendations.push(`⏰ Use timer to avoid overcooking`);
      }
    }
    
    if (appliance.category === 'Laundry') {
      if (appliance.name === 'Washing Machine') {
        recommendations.push(`🧺 Wash full loads to maximize efficiency`);
        recommendations.push(`🌡️ Use cold water when possible`);
        recommendations.push(`🔄 Use eco-mode for energy savings`);
      }
    }
    
    // General efficiency tips
    if (appliance.efficiency === 'Low') {
      recommendations.push(`🔴 LOW EFFICIENCY: Consider replacing ${appliance.name} with energy-efficient model`);
      recommendations.push(`💡 Look for appliances with A++ or A+ energy rating`);
    }
    
    // Peak hour recommendations
    recommendations.push(`⏰ Use ${appliance.name} during off-peak hours (10 PM - 6 AM) for lower rates`);
    
    return recommendations;
  };

  const generateOverallRecommendations = (selectedAppliances, totalConsumption) => {
    const recommendations = [];
    const { totalMonthlyKWh, totalMonthlyCost } = totalConsumption;
    
    // Overall consumption analysis
    if (totalMonthlyKWh > 500) {
      recommendations.push(`🚨 HIGH OVERALL CONSUMPTION: ${totalMonthlyKWh.toFixed(1)} kWh/month`);
      recommendations.push(`💡 Your total consumption is above average - immediate action needed`);
    } else if (totalMonthlyKWh > 300) {
      recommendations.push(`⚠️ MODERATE CONSUMPTION: ${totalMonthlyKWh.toFixed(1)} kWh/month`);
      recommendations.push(`💡 Room for improvement in energy efficiency`);
    } else {
      recommendations.push(`✅ GOOD CONSUMPTION: ${totalMonthlyKWh.toFixed(1)} kWh/month`);
      recommendations.push(`💡 You're managing energy well!`);
    }
    
    // Cost analysis
    if (totalMonthlyCost > 5000) {
      recommendations.push(`💰 HIGH MONTHLY COST: PKR ${totalMonthlyCost}`);
      recommendations.push(`💡 Focus on high-consumption appliances first`);
    }
    
    // Peak hour strategy
    recommendations.push(`🌙 OFF-PEAK STRATEGY: Use high-wattage appliances during 10 PM - 6 AM`);
    recommendations.push(`💡 This can save 20-30% on your electricity bill`);
    
    // Appliance prioritization
    const highConsumption = selectedAppliances.filter(app => {
      const consumption = calculateApplianceConsumption(app);
      return consumption.monthlyKWh > 100;
    });
    
    if (highConsumption.length > 0) {
      recommendations.push(`🎯 PRIORITY APPLIANCES: Focus on these high-consumption items:`);
      highConsumption.forEach(app => {
        const consumption = calculateApplianceConsumption(app);
        recommendations.push(`   • ${app.name}: ${consumption.monthlyKWh.toFixed(1)} kWh/month`);
      });
    }
    
    // Solar recommendations
    if (totalMonthlyCost > 3000) {
      recommendations.push(`☀️ SOLAR CONSIDERATION: With monthly costs of PKR ${totalMonthlyCost}, solar panels could pay for themselves in 3-5 years`);
    }
    
    return recommendations;
  };

  const handleAppliancePrediction = async () => {
    if (isLoadingAppliance) return; // Prevent multiple clicks
    
    const selectedAppliances = appliances.filter(app => app.isSelected);
    if (selectedAppliances.length === 0) {
      setError('Please select at least one appliance');
      return;
    }

    setIsLoadingAppliance(true);
    setError(null);
    setApplianceResults(null);
    setAppliancePredictions(null);

    try {
      console.log('Processing appliances:', selectedAppliances); // Debug log
      
      // Calculate local consumption first
      let totalDailyKWh = 0;
      let totalMonthlyKWh = 0;
      let totalMonthlyCost = 0;
      const applianceDetails = [];

      selectedAppliances.forEach(appliance => {
        const consumption = calculateApplianceConsumption(appliance);
        totalDailyKWh += consumption.dailyKWh;
        totalMonthlyKWh += consumption.monthlyKWh;
        totalMonthlyCost += consumption.monthlyCost;
        
        console.log(`${appliance.name} consumption:`, consumption); // Debug log
        
        // Generate appliance-specific recommendations
        const applianceRecommendations = analyzeApplianceEfficiency(appliance, consumption);
        
        applianceDetails.push({
          name: appliance.name,
          category: appliance.category,
          efficiency: appliance.efficiency,
          energyRating: appliance.energyRating,
          dailyKWh: consumption.dailyKWh.toFixed(2),
          monthlyKWh: consumption.monthlyKWh.toFixed(2),
          monthlyCost: consumption.monthlyCost,
          costPerUnit: consumption.costPerUnit.toFixed(2),
          icon: appliance.icon,
          recommendations: applianceRecommendations
        });
      });

      console.log('Total consumption:', { totalDailyKWh, totalMonthlyKWh, totalMonthlyCost }); // Debug log

      // Create local results
      const localResults = {
        totalDailyKWh: totalDailyKWh.toFixed(2),
        totalMonthlyKWh: totalMonthlyKWh.toFixed(2),
        totalMonthlyCost: totalMonthlyCost,
        applianceDetails,
        selectedMonth: billData.selectedMonth,
        overallRecommendations: generateOverallRecommendations(selectedAppliances, { totalMonthlyKWh, totalMonthlyCost }),
        peakHours: '2:00 PM - 6:00 PM',
        offPeakHours: '10:00 PM - 6:00 AM',
        potentialSavings: Math.round(totalMonthlyCost * 0.25) // 25% potential savings
      };

      console.log('Local results:', localResults); // Debug log
      
      setApplianceResults(localResults);
      setAppliancePredictions(localResults);

      // Also try API call for enhanced predictions
      try {
        const response = await fetch('http://localhost:8001/api/appliance-prediction/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appliances: selectedAppliances.map(app => ({
              ...app,
              ...applianceInputs[app.id]
            })),
            month: billData.selectedMonth
          }),
        });

        if (response.ok) {
          const apiResult = await response.json();
          console.log('API result:', apiResult); // Debug log
          // Merge API results with local results
          setApplianceResults({
            ...localResults,
            apiPredictions: apiResult
          });
        }
      } catch (apiError) {
        console.log('API call failed, using local calculations:', apiError);
      }

    } catch (err) {
      setError(err.message);
      console.error('Appliance prediction error:', err);
    } finally {
      setIsLoadingAppliance(false);
    }
  };

  const addHouse = () => {
    const newHouse = {
      id: houses.length + 1,
      occupants: 2,
      squareFootage: 1500,
      applianceAge: 3,
      insulation: 'Average',
      solarPanels: false,
      acUnits: 1
    };
    setHouses([...houses, newHouse]);
  };

  const removeHouse = (id) => {
    setHouses(houses.filter(house => house.id !== id));
  };

  const updateHouse = (id, field, value) => {
    setHouses(houses.map(house => 
      house.id === id ? { ...house, [field]: value } : house
    ));
  };

  const handlePrediction = async () => {
    if (isLoadingManual) return; // Prevent multiple clicks
    
    if (!billData.consumedUnits || !billData.billPrice) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoadingManual(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/api/predict/energy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consumed_units: parseFloat(billData.consumedUnits),
          bill_price: parseFloat(billData.billPrice),
          month: billData.selectedMonth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const result = await response.json();
      setManualPredictions(result);

      // Save to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        consumedUnits: billData.consumedUnits,
        billPrice: billData.billPrice,
        prediction: result
      };
      setPredictionHistory([historyEntry, ...predictionHistory]);

    } catch (err) {
      setError(err.message);
      console.error('Prediction error:', err);
    } finally {
      setIsLoadingManual(false);
    }
  };

  const handleHouseComparison = async () => {
    if (isLoadingHouse) return; // Prevent multiple clicks
    
    if (houses.length === 0) {
      setError('Please add at least one house');
      return;
    }

    setIsLoadingHouse(true);
    setError(null);
    setHousePredictions(null);

    try {
      // Create local house analysis first
      const houseAnalysis = houses.map(house => {
        const efficiencyScore = calculateHouseEfficiency(house);
        const estimatedConsumption = estimateHouseConsumption(house);
        const costPerUnit = house.price / house.units;
        
        return {
          ...house,
          efficiencyScore,
          estimatedConsumption,
          costPerUnit: costPerUnit.toFixed(2),
          grade: getEfficiencyGrade(efficiencyScore),
          recommendations: generateHouseRecommendations(house, efficiencyScore)
        };
      });

      const localResults = {
        houses: houseAnalysis,
        totalHouses: houses.length,
        averageEfficiency: (houseAnalysis.reduce((sum, h) => sum + h.efficiencyScore, 0) / houses.length).toFixed(1),
        comparison: generateComparisonSummary(houseAnalysis),
        totalUnits: houseAnalysis.reduce((sum, h) => sum + h.units, 0),
        totalPrice: houseAnalysis.reduce((sum, h) => sum + h.price, 0),
        averageCostPerUnit: (houseAnalysis.reduce((sum, h) => sum + (h.price / h.units), 0) / houses.length).toFixed(2)
      };

      setHousePredictions(localResults);

      // Also try API call for enhanced predictions
      try {
        const response = await fetch('http://localhost:8001/api/compare-houses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            houses: houses.map(house => ({
              units: house.units,
              price: house.price,
              occupants: house.occupants,
              squareFootage: house.squareFootage,
              applianceAge: house.applianceAge,
              insulation: house.insulation,
              solarPanels: house.solarPanels,
              acUnits: house.acUnits
            }))
          }),
        });

        if (response.ok) {
          const apiResult = await response.json();
          // Merge API results with local results
          setHousePredictions({
            ...localResults,
            apiPredictions: apiResult
          });
        }
      } catch (apiError) {
        console.log('API call failed, using local calculations:', apiError);
      }

    } catch (err) {
      setError(err.message);
      console.error('House comparison error:', err);
    } finally {
      setIsLoadingHouse(false);
    }
  };

  const calculateHouseEfficiency = (house) => {
    let score = 50; // Base score
    
    // Month factor (seasonal)
    const isSummer = ['May', 'June', 'July', 'August', 'September'].includes(house.month);
    const isWinter = ['November', 'December', 'January', 'February'].includes(house.month);
    
    if (isSummer) score += 10; // Summer months get bonus for AC usage
    else if (isWinter) score -= 5; // Winter months slightly penalized
    
    // Solar panels factor
    if (house.solarPanels) score += 25;
    
    // AC units factor
    if (house.acUnits <= 1) score += 10;
    else if (house.acUnits <= 2) score += 5;
    else score -= 15;
    
    // Cost per unit efficiency
    const costPerUnit = house.price / house.units;
    if (costPerUnit <= 5) score += 15; // Very efficient
    else if (costPerUnit <= 7) score += 10; // Efficient
    else if (costPerUnit <= 10) score += 5; // Average
    else score -= 10; // Inefficient
    
    return Math.max(0, Math.min(100, score));
  };

  const estimateHouseConsumption = (house) => {
    const baseConsumption = 300; // Base monthly consumption
    const month = house.month;
    
    // Seasonal adjustments
    let seasonalFactor = 1.0;
    if (['May', 'June', 'July', 'August', 'September'].includes(month)) {
      seasonalFactor = 1.3; // Summer - 30% increase
    } else if (['November', 'December', 'January', 'February'].includes(month)) {
      seasonalFactor = 0.8; // Winter - 20% decrease
    }
    
    // AC units impact
    const acFactor = house.acUnits * 80;
    
    // Solar panels impact
    const solarFactor = house.solarPanels ? -80 : 0;
    
    const adjustedConsumption = (baseConsumption + acFactor + solarFactor) * seasonalFactor;
    return Math.max(100, Math.round(adjustedConsumption));
  };

  const getEfficiencyGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-400' };
    if (score >= 80) return { grade: 'A', color: 'text-green-400' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-400' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-400' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-400' };
    return { grade: 'F', color: 'text-red-400' };
  };

  const generateHouseRecommendations = (house, efficiencyScore) => {
    const recommendations = [];
    
    if (efficiencyScore < 70) {
      recommendations.push('Consider upgrading to energy-efficient appliances');
      recommendations.push('Focus on reducing AC usage during peak hours');
    }
    
    if (!house.solarPanels && efficiencyScore < 80) {
      recommendations.push('Install solar panels to reduce energy costs');
    }
    
    if (house.acUnits > 2) {
      recommendations.push('Consider reducing AC units or using smart thermostats');
    }
    
    recommendations.push('Use programmable thermostats for better control');
    recommendations.push('Regular maintenance of HVAC systems');
    
    return recommendations;
  };

  const generateComparisonSummary = (houseAnalysis) => {
    const bestHouse = houseAnalysis.reduce((best, current) => 
      current.efficiencyScore > best.efficiencyScore ? current : best
    );
    
    const worstHouse = houseAnalysis.reduce((worst, current) => 
      current.efficiencyScore < worst.efficiencyScore ? current : worst
    );
    
    return {
      bestHouse: bestHouse.name || `House ${bestHouse.id}`,
      worstHouse: worstHouse.name || `House ${worstHouse.id}`,
      efficiencyGap: bestHouse.efficiencyScore - worstHouse.efficiencyScore,
      totalPotentialSavings: houseAnalysis.reduce((sum, house) => 
        sum + (100 - house.efficiencyScore) * 2, 0
      )
    };
  };

  const handleBillScan = async (file) => {
    if (!file) return;
    
    setBillImage(file);
    setScanningBill(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('bill_image', file);

      const response = await fetch('http://localhost:8001/api/ocr/scan-bill/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bill scanning failed');
      }

      const result = await response.json();
      
      // Update bill data with scanned values
      setBillData({
        ...billData,
        consumedUnits: result.consumed_units || '',
        billPrice: result.bill_price || ''
      });

      setError(null);
      console.log('Bill scanned successfully:', result);

    } catch (err) {
      setError(err.message);
      console.error('Bill scanning error:', err);
    } finally {
      setScanningBill(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleBillScan(file);
    }
  };

  const deleteHistoryEntry = (id) => {
    setPredictionHistory(predictionHistory.filter(entry => entry.id !== id));
  };



  const getSeasonalAnalysis = (house) => {
    const month = house.month;
    const isSummer = ['May', 'June', 'July', 'August', 'September'].includes(month);
    const isWinter = ['November', 'December', 'January', 'February'].includes(month);
    
    if (isSummer) {
      return {
        season: 'Summer',
        description: 'High energy consumption due to AC usage',
        peakHours: '2:00 PM - 6:00 PM',
        offPeakHours: '10:00 PM - 6:00 AM',
        recommendations: [
          'Use AC during off-peak hours (10 PM - 6 AM)',
          'Set AC temperature to 24-26°C for optimal efficiency',
          'Use ceiling fans to reduce AC dependency',
          'Close curtains during peak sun hours'
        ]
      };
    } else if (isWinter) {
      return {
        season: 'Winter',
        description: 'Lower energy consumption, heating needs',
        peakHours: '6:00 PM - 10:00 PM',
        offPeakHours: '12:00 AM - 6:00 AM',
        recommendations: [
          'Use heaters during off-peak hours',
          'Improve insulation to retain heat',
          'Use energy-efficient space heaters',
          'Seal windows and doors properly'
        ]
      };
    } else {
      return {
        season: 'Spring/Autumn',
        description: 'Moderate energy consumption',
        peakHours: '6:00 PM - 9:00 PM',
        offPeakHours: '11:00 PM - 6:00 AM',
        recommendations: [
          'Natural ventilation when possible',
          'Use fans instead of AC',
          'Optimal temperature settings',
          'Regular appliance maintenance'
        ]
      };
    }
  };

  const generateLESCORecommendations = (house) => {
    const units = house.units;
    const price = house.price;
    const costPerUnit = price / units;
    
    let slab = '';
    let recommendations = [];
    
    if (units <= 100) {
      slab = '1-100 units (PKR 3.95/unit)';
      recommendations.push('You are in the lowest slab - excellent!');
      recommendations.push('Consider solar panels for further savings');
    } else if (units <= 200) {
      slab = '101-200 units (PKR 7.34/unit)';
      recommendations.push('You are in the moderate slab');
      recommendations.push('Focus on reducing consumption to stay under 100 units');
    } else if (units <= 300) {
      slab = '201-300 units (PKR 10.06/unit)';
      recommendations.push('You are in the high consumption slab');
      recommendations.push('Immediate action needed to reduce consumption');
      recommendations.push('Consider energy audit and appliance upgrades');
    } else if (units <= 400) {
      slab = '301-400 units (PKR 15.28/unit)';
      recommendations.push('You are in the very high consumption slab');
      recommendations.push('Critical: Implement energy-saving measures immediately');
      recommendations.push('Consider solar installation for long-term savings');
    } else {
      slab = '400+ units (PKR 20.14/unit)';
      recommendations.push('You are in the highest consumption slab');
      recommendations.push('Emergency: Major energy efficiency overhaul required');
      recommendations.push('Solar installation highly recommended');
      recommendations.push('Professional energy audit mandatory');
    }
    
    return { slab, recommendations, costPerUnit: costPerUnit.toFixed(2) };
  };

  const addAppliance = () => {
    const newId = Math.max(...appliances.map(app => app.id)) + 1;
    const newAppliance = {
      id: newId,
      name: `Custom Appliance ${newId}`,
      category: 'Custom',
      efficiency: 'Medium',
      isSelected: false,
      quantity: 1,
      wattage: 500,
      hours: 2,
      icon: '⚡',
      energyRating: 'B',
      monthlyCost: 0,
      recommendations: []
    };
    setAppliances([...appliances, newAppliance]);
  };

  const removeAppliance = (id) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter(app => app.id !== id));
      // Also remove from inputs
      const newInputs = { ...applianceInputs };
      delete newInputs[id];
      setApplianceInputs(newInputs);
    }
  };

  const updateApplianceName = (id, newName) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, name: newName } : app
    ));
  };

  const updateApplianceCategory = (id, newCategory) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, category: newCategory } : app
    ));
  };

  // Simple theme toggle function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      // Light Mode - Apply to ALL elements
      console.log('Applying light mode to ALL elements...');
      
      // Apply to document and body
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      
      // Apply to ALL elements with specific classes
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const className = el.className || '';
        
        // Background elements - make white
        if (className.includes('bg-gray-') || className.includes('bg-black')) {
          el.style.backgroundColor = '#ffffff';
          el.style.color = '#000000';
        }
        
        // Text elements - make black
        if (className.includes('text-white') || className.includes('text-gray-')) {
          el.style.color = '#000000';
        }
        
        // Input elements - make white
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
          el.style.backgroundColor = '#ffffff';
          el.style.color = '#000000';
          el.style.borderColor = '#d1d5db';
        }
      });
      
      // Special targeting for navbar and title
      const navbarElements = document.querySelectorAll('nav, header, .bg-gray-800, .bg-gray-900');
      navbarElements.forEach(el => {
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#000000';
      });
      
      // Apply to body background
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      
    } else {
      // Dark Mode - Reset to original
      console.log('Resetting to original dark theme...');
      
      // Remove light theme classes
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      
      // Reset ALL elements to original
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.borderColor = '';
      });
      
      // Reset body
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  };

  // SECPARS Integration Function
  const openSECPARS = () => {
    const secparsUrl = 'http://localhost:8501';
    
    // Show notification
    const notification = document.createElement('div');
    notification.textContent = '🚀 Opening SECPARS AI Assistant...';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      border: 2px solid #34d399;
      z-index: 9999;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
      animation: slideInRight 0.5s ease-out;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Open SECPARS in new window
    const secparsWindow = window.open(secparsUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
    
    // Focus on the new window
    if (secparsWindow) {
      secparsWindow.focus();
    }
  };

  return (
    <div 
      className={`min-h-screen pt-48 px-6 pb-12 ${isDarkMode ? 'light-theme' : 'dark-theme'}`}
      style={{
        backgroundColor: isDarkMode ? '#ffffff' : '#000000',
        color: isDarkMode ? '#000000' : '#ffffff',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* CSS Styles for Light Theme */}
        <style jsx>{`
          .light-theme {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          
          .light-theme .bg-gray-900\\/60,
          .light-theme .bg-gray-800\\/50,
          .light-theme .bg-gray-900\\/80,
          .light-theme .bg-gray-800,
          .light-theme .bg-gray-900,
          .light-theme .bg-black,
          .light-theme .bg-gray-800\\/30,
          .light-theme .bg-gray-700,
          .light-theme .bg-gray-600 {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #d1d5db !important;
          }
          
          .light-theme .text-white,
          .light-theme .text-gray-300,
          .light-theme .text-gray-400,
          .light-theme .text-gray-200,
          .light-theme .text-gray-100 {
            color: #000000 !important;
          }
          
          .light-theme input,
          .light-theme select,
          .light-theme textarea {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #d1d5db !important;
          }
          
          /* Navbar specific light mode */
          .light-theme nav,
          .light-theme .navbar,
          .light-theme [class*="nav"] {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #d1d5db !important;
          }
          
          /* All dashboard sections light mode */
          .light-theme .bg-gray-800\\/30,
          .light-theme .bg-gray-800\\/20,
          .light-theme .bg-gray-800\\/10 {
            background-color: #ffffff !important;
            border-color: #d1d5db !important;
          }
          .light-theme textarea {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #d1d5db !important;
          }
          
          /* Navbar and header specific light mode */
          .light-theme nav,
          .light-theme header,
          .light-theme .bg-gray-800,
          .light-theme .bg-gray-900 {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #d1d5db !important;
          }
          
          /* Smart Energy Consumption title light mode */
          .light-theme .text-4xl,
          .light-theme .text-5xl,
          .light-theme .font-bold {
            color: #000000 !important;
          }
        `}</style>

        {/* Professional Background with Enhanced 3D Graphics */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
          
          {/* Enhanced 3D Floating Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>
          </div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse-glow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}></div>
          </div>
        </div>

        {/* Clean Navbar Component */}
        <CleanNavbar 
          user={user} 
          onLogout={onLogout} 
          openSECPARS={openSECPARS}
        />

        {/* Google Fonts Import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Nabla&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap" rel="stylesheet" />

        {/* Font CSS */}
        <style jsx>{`
          .bungee-spice-regular {
            font-family: "Bungee Spice", sans-serif;
            font-weight: 400;
            font-style: normal;
          }
          
          .metal-mania-ai {
            font-family: "Metal Mania", system-ui;
            font-weight: 400;
            font-style: normal;
          }
        `}</style>

        {/* Smart Energy Consumption Title - Normal Position */}
        <div className="relative z-10 bg-transparent mb-8">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-top justify-center space-x-8">
              <div className="w-20 h-20 bg-gradient-to-l from-orange-400 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-orange-500/50 transition-all duration-300">
                <span className="text-white font-black text-7xl drop-shadow-lg filter brightness-125">⚡</span>
              </div>
              <div className="text-center" style={{ marginTop:'1px' }}>
                <h1 className={`bungee-spice-regular bg-gradient-to-b from-orange-500 via-orange-500 to-red-600 bg-clip-text text-transparent leading-tight ${
                  language === 'english' ? 'text-7xl' : 'text-7xl'
                }`} style={{
                  fontSize: language === 'english' ? '64px' : '64px', 
                  letterSpacing: '0em', 
                  lineHeight: '1.0',
                  paddingBottom: language === 'urdu' ? '40px' : '20px',
                  marginBottom:'10px'
                }}>
                  {translate('Smart Energy Consumption')}
                </h1>
                <p className={`metal-mania-ai text-gray-100 font-black drop-shadow-lg filter brightness-110 leading-tight ${
                  language === 'english' ? 'text-5xl' : 'text-6xl'
                }`} style={{
                  lineHeight: '1.4',
                  fontSize: language === 'english' ? '38px' : '20px',
                  marginTop: '10px'
                }}>
                  {translate('AI-Powered Energy Management System')}
                </p>
              </div>
            </div>
          </div>
        </div>
              
        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          {/* SECPARS AI Assistant - Prominent Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 backdrop-blur-xl rounded-3xl border border-green-500/50 p-8 shadow-2xl hover:border-green-400/70 transition-all duration-300 card-3d glass-enhanced max-w-6xl mx-auto w-full mb-12"
          >
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center animate-pulse">
                  <span className="text-white text-3xl sm:text-4xl">🤖</span>
                    </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{translate('SECPARS AI Assistant')}</h2>
                  <p className="text-green-200 text-base sm:text-lg">{translate('Your Personal Energy Management Expert')}</p>
                  </div>
                  </div>

              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Get instant AI-powered insights about energy consumption, bill optimization, appliance efficiency, 
                and personalized recommendations. Chat with SECPARS to make smarter energy decisions!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button
                  onClick={openSECPARS}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25 border border-green-400/50 hover:border-green-300/50 transform hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3"
                  >
                  <span className="text-xl sm:text-2xl">🚀</span>
                  <span className="text-sm sm:text-base">CHAT WITH SECPARS</span>
                  </button>
                
                <div className="text-center sm:text-left space-y-1">
                  <div className="text-green-300 text-xs sm:text-sm font-medium">✨ AI-Powered Insights</div>
                  <div className="text-green-300 text-xs sm:text-sm font-medium">💡 Smart Recommendations</div>
                  <div className="text-green-300 text-xs sm:text-sm font-medium">📊 Real-time Analysis</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Professional Dashboard Grid - Vertical Layout */}
          <div className="grid grid-cols-1 gap-8 mb-12">
            
            {/* Manual Input Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 shadow-2xl hover:border-blue-400/50 transition-all duration-300 card-3d glass-enhanced max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h2 className="text-xl font-bold text-white">{translate('Manual Energy Input')}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-lg text-gray-300 mb-3 font-semibold">{translate('Consumed Units (kWh)')}</label>
                    <input
                      type="number"
                      value={billData.consumedUnits}
                      onChange={(e) => setBillData({...billData, consumedUnits: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder={translate('Enter units consumed')}
                    />
                  </div>
                  <div>
                    <label className="block text-lg text-gray-300 mb-3 font-semibold">{translate('Bill Price (PKR)')}</label>
                    <input
                      type="number"
                      value={billData.billPrice}
                      onChange={(e) => setBillData({...billData, billPrice: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder={translate('Enter bill amount')}
                    />
                  </div>
                  <div>
                    <label className="block text-lg text-gray-300 mb-3 font-semibold">{translate('Select Month for Prediction')}</label>
                    <select
                      value={billData.selectedMonth}
                      onChange={(e) => setBillData({...billData, selectedMonth: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      <option value={1}>{translate('January')} ☀️</option>
                      <option value={2}>{translate('February')} ☀️</option>
                      <option value={3}>{translate('March')} ☀️</option>
                      <option value={4}>{translate('April')} ☀️</option>
                      <option value={5}>{translate('May')} ☀️</option>
                      <option value={6}>{translate('June')} ☀️</option>
                      <option value={7}>{translate('July')} ☀️</option>
                      <option value={8}>{translate('August')} ☀️</option>
                      <option value={9}>{translate('September')} ☀️</option>
                      <option value={10}>{translate('October')} 🌙</option>
                      <option value={11}>{translate('November')} 🌙</option>
                      <option value={12}>{translate('December')} 🌙</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handlePrediction}
                    disabled={isLoadingManual}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingManual ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="loading-spinner"></div>
                        <span>{translate('Generating Prediction...')}</span>
                      </div>
                    ) : (
                      translate('Generate Prediction')
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Bill Scanner Section */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 shadow-2xl hover:border-purple-400/50 transition-all duration-300 card-3d glass-enhanced max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-3xl">📷</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Bill Scanner</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-purple-400/50 rounded-3xl p-12 text-center hover:border-purple-400/70 transition-all duration-300 bg-gray-800/30">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="bill-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="bill-upload" className="cursor-pointer">
                    {scanningBill ? (
                      <div>
                        <div className="text-purple-400 text-6xl mb-4 animate-spin">⏳</div>
                        <div className="text-white font-medium text-xl mb-3">Scanning Bill...</div>
                        <div className="text-lg text-gray-400">Please wait</div>
                      </div>
                    ) : billImage ? (
                      <div>
                        <div className="text-green-400 text-6xl mb-4">✅</div>
                        <div className="text-white font-medium text-xl mb-3">Bill Scanned Successfully!</div>
                        <div className="text-lg text-gray-400">Click to scan new bill</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-purple-400 text-6xl mb-4">📄</div>
                        <div className="text-white font-medium text-xl mb-3">Click to upload bill image</div>
                        <div className="text-lg text-gray-400">Supports: JPG, PNG, PDF</div>
                      </div>
                    )}
                  </label>
                </div>
                
                <div className="text-center">
                  <div className="text-lg text-gray-400 mb-3">Scan Progress</div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    {scanningBill ? (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full w-full animate-pulse"></div>
                    ) : billImage ? (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full w-full"></div>
                    ) : (
                      <div className="bg-gray-500 h-4 rounded-full w-0"></div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Appliances Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 shadow-2xl hover:border-green-400/50 transition-all duration-300 card-3d glass-enhanced max-w-4xl mx-auto w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-3xl">🔌</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Appliances Prediction</h2>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={addAppliance}
                    className="text-sm text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg transition-all duration-300 border border-green-500/30"
                  >
                    + Add Appliance
                  </button>
                  <button
                    onClick={() => setShowAppliances(!showAppliances)}
                    className="text-sm text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg transition-all duration-300 border border-green-500/30"
                  >
                    {showAppliances ? '👁️ Hide' : '👁️ Show'}
                  </button>
                </div>
              </div>
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
                  <div className="text-red-400 text-sm">{error}</div>
                </div>
              )}
              
              {showAppliances && (
                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                  {appliances.map((appliance) => {
                    const { dailyKWh, monthlyKWh } = calculateApplianceConsumption(appliance);
                    const inputs = applianceInputs[appliance.id] || {};
                    
                    return (
                      <div key={appliance.id} className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={appliance.isSelected}
                              onChange={() => toggleApplianceSelection(appliance.id)}
                              className="text-green-400 focus:ring-green-400 rounded w-5 h-5"
                            />
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{appliance.icon}</span>
                              <div>
                                <input
                                  type="text"
                                  value={appliance.name}
                                  onChange={(e) => updateApplianceName(appliance.id, e.target.value)}
                                  className="text-sm font-medium text-white bg-transparent border-b border-gray-600 focus:border-green-400 focus:outline-none px-1 py-1"
                                />
                                <div className="text-xs text-gray-400">
                                  <select
                                    value={appliance.category}
                                    onChange={(e) => updateApplianceCategory(appliance.id, e.target.value)}
                                    className="bg-transparent border-b border-gray-600 focus:border-green-400 focus:outline-none px-1 py-1 text-xs"
                                  >
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Cooling">Cooling</option>
                                    <option value="Laundry">Laundry</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Office">Office</option>
                                    <option value="Bathroom">Bathroom</option>
                                    <option value="Custom">Custom</option>
                                  </select>
                                  • {appliance.efficiency} Efficiency • {appliance.energyRating}
                                </div>
                              </div>
                            </div>
                          </div>
                          {appliances.length > 1 && (
                            <button
                              onClick={() => removeAppliance(appliance.id)}
                              className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-all duration-300"
                              title="Remove Appliance"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {appliance.isSelected && (
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={inputs.quantity || appliance.quantity}
                                onChange={(e) => updateApplianceInput(appliance.id, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Wattage</label>
                              <input
                                type="number"
                                min="50"
                                max="5000"
                                value={inputs.wattage || appliance.wattage}
                                onChange={(e) => updateApplianceInput(appliance.id, 'wattage', parseInt(e.target.value) || appliance.wattage)}
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Hours/Day</label>
                              <input
                                type="number"
                                min="0.5"
                                max="24"
                                step="0.5"
                                value={inputs.hours || appliance.hours}
                                onChange={(e) => updateApplianceInput(appliance.id, 'hours', parseFloat(e.target.value) || appliance.hours)}
                                className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400/20"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-green-400">
                            Daily: {dailyKWh.toFixed(2)} kWh | Monthly: {monthlyKWh.toFixed(2)} kWh
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            appliance.efficiency === 'High' ? 'bg-green-500/20 text-green-400' :
                            appliance.efficiency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {appliance.efficiency}
                          </div>
                        </div>
                        
                        {/* Energy Rating Badge */}
                        <div className="mt-2 flex justify-center">
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            appliance.energyRating === 'A++' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            appliance.energyRating === 'A+' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            appliance.energyRating === 'A' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            appliance.energyRating === 'B+' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            appliance.energyRating === 'B' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            Energy Rating: {appliance.energyRating}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAppliancePrediction}
                disabled={isLoadingAppliance}
                className="w-full py-4 mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoadingAppliance ? 'Predicting...' : '🔮 Predict Appliance Energy'}
              </motion.button>
            </motion.div>

            {/* House Comparison Section */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-8 shadow-2xl hover:border-yellow-400/50 transition-all duration-300 card-3d glass-enhanced max-w-4xl mx-auto w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-3xl">🏠</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">House Comparison</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={addHouse}
                    className="text-sm text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1 rounded-lg transition-all duration-300"
                  >
                    + Add House
                  </button>
                  <button
                    onClick={() => setShowHouseComparison(!showHouseComparison)}
                    className="text-sm text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1 rounded-lg transition-all duration-300"
                  >
                    {showHouseComparison ? '👁️ Hide' : '👁️ Show'}
                  </button>
                </div>
              </div>
              
              {showHouseComparison && (
                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                  {houses.map((house) => (
                    <div key={house.id} className="bg-gray-800/50 rounded-2xl p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🏠</span>
                          <div>
                            <div className="text-sm font-medium text-white">House {house.id}</div>
                            <div className="text-xs text-gray-400">Click to edit details</div>
                          </div>
                        </div>
                        {houses.length > 1 && (
                          <button
                            onClick={() => removeHouse(house.id)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Units (kWh)</label>
                          <input
                            type="number"
                            min="100"
                            max="10000"
                            value={house.units}
                            onChange={(e) => updateHouse(house.id, 'units', parseInt(e.target.value) || 100)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Price (PKR)</label>
                          <input
                            type="number"
                            min="100"
                            max="50000"
                            value={house.price}
                            onChange={(e) => updateHouse(house.id, 'price', parseInt(e.target.value) || 100)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Month</label>
                          <select
                            value={house.month}
                            onChange={(e) => updateHouse(house.id, 'month', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                          >
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">AC Units</label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={house.acUnits}
                            onChange={(e) => updateHouse(house.id, 'acUnits', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <label className="block text-xs text-gray-400">Solar Panels</label>
                          <input
                            type="checkbox"
                            checked={house.solarPanels}
                            onChange={(e) => updateHouse(house.id, 'solarPanels', e.target.checked)}
                            className="text-yellow-400 focus:ring-yellow-400 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400">Cost per Unit</div>
                        <div className="text-sm font-semibold text-yellow-400">
                          PKR {(house.price / house.units).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHouseComparison}
                disabled={isLoadingHouse}
                className="w-full py-4 mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoadingHouse ? 'Comparing...' : '🏠 Compare Houses & Analyze'}
              </motion.button>
            </motion.div>
          </div>

          {/* Separate Prediction Display Sections */}
          
          {/* Manual Energy Predictions */}
          {manualPredictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 shadow-2xl mb-8 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-3xl">📊</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Manual Energy Input</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Current Month</div>
                  <div className="text-3xl font-bold text-white">{billData.consumedUnits || 0} kWh</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Next Month</div>
                  <div className="text-3xl font-bold text-green-400">
                    {manualPredictions?.next_month_units ? `${manualPredictions.next_month_units} kWh` : 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Estimated Bill</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {manualPredictions?.estimated_bill ? `PKR ${manualPredictions.estimated_bill}` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Seasonal Information */}
              {manualPredictions?.current_season && (
                <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Current Season</div>
                      <div className={`text-2xl font-bold ${getSeasonalColor(manualPredictions.current_season)}`}>
                        {manualPredictions.current_season.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Peak Hours</div>
                      <div className="text-xl font-semibold text-yellow-400">
                        {manualPredictions?.peak_hours || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Future Predictions Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFuturePredictions(!showFuturePredictions)}
                className="w-full py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 rounded-2xl transition-all duration-300 border border-blue-500/30 mb-8 font-semibold"
              >
                {showFuturePredictions ? 'Hide' : 'Show'} 2025-2030 Predictions
              </motion.button>

              {/* Future Predictions Display */}
              <AnimatePresence>
                {showFuturePredictions && manualPredictions?.future_predictions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-white">Future Predictions (2025-2030)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(manualPredictions.future_predictions).map(([year, data]) => (
                        <div key={year} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                          <h4 className="text-xl font-semibold text-white mb-3">{year}</h4>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div>Avg Units: {data?.annual_average_units || 'N/A'} kWh</div>
                            <div>Avg Bill: PKR {data?.annual_average_bill || 'N/A'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recommendations */}
              {manualPredictions?.recommendations && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {manualPredictions.recommendations.immediate_actions && (
                      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                        <h4 className="text-xl font-semibold text-yellow-400 mb-3">Immediate Actions</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {manualPredictions.recommendations.immediate_actions.map((action, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-400 mr-3 text-lg">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {manualPredictions.recommendations.cost_savings && (
                      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                        <h4 className="text-xl font-semibold text-green-400 mb-3">Potential Savings</h4>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Monthly:</span>
                            <span className="text-green-400 font-semibold">PKR {manualPredictions.recommendations.cost_savings.potential_monthly_savings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual:</span>
                            <span className="text-green-400 font-semibold">PKR {manualPredictions.recommendations.cost_savings.annual_savings}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Appliance Predictions */}
          {appliancePredictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 shadow-2xl mb-8 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">🔌</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Appliance Energy Predictions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Total Daily</div>
                  <div className="text-3xl font-bold text-white">{appliancePredictions.totalDailyKWh} kWh</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Total Monthly</div>
                  <div className="text-3xl font-bold text-green-400">{appliancePredictions.totalMonthlyKWh} kWh</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Monthly Cost</div>
                  <div className="text-3xl font-bold text-cyan-400">PKR {appliancePredictions.totalMonthlyCost}</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Potential Savings</div>
                  <div className="text-3xl font-bold text-yellow-400">PKR {appliancePredictions.potentialSavings}</div>
                </div>
              </div>

              {/* Peak Hours Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                  <div className="text-sm text-red-400 mb-2 font-semibold">Peak Hours (High Rates)</div>
                  <div className="text-2xl font-bold text-red-400">{appliancePredictions.peakHours}</div>
                  <div className="text-sm text-gray-300 mt-2">Avoid using high-wattage appliances during these hours</div>
                </div>
                <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                  <div className="text-sm text-green-400 mb-2 font-semibold">Off-Peak Hours (Low Rates)</div>
                  <div className="text-2xl font-bold text-green-400">{appliancePredictions.offPeakHours}</div>
                  <div className="text-sm text-gray-300 mt-2">Best time to use energy-intensive appliances</div>
                </div>
              </div>

              {/* Appliance Details */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Individual Appliance Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appliancePredictions.applianceDetails.map((appliance, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{appliance.icon}</span>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{appliance.name}</h4>
                          <div className="text-sm text-gray-400">{appliance.category}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <div className="flex justify-between">
                          <span>Daily:</span>
                          <span className="text-green-400 font-semibold">{appliance.dailyKWh} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly:</span>
                          <span className="text-green-400 font-semibold">{appliance.monthlyKWh} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Cost:</span>
                          <span className="text-cyan-400 font-semibold">PKR {appliance.monthlyCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost/Unit:</span>
                          <span className="text-yellow-400 font-semibold">PKR {appliance.costPerUnit}</span>
                        </div>
                      </div>
                      
                      {/* Energy Rating */}
                      <div className="mb-3">
                        <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                          appliance.energyRating === 'A++' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          appliance.energyRating === 'A+' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          appliance.energyRating === 'A' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          appliance.energyRating === 'B+' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          appliance.energyRating === 'B' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          Energy Rating: {appliance.energyRating}
                        </div>
                      </div>
                      
                      {/* Appliance Recommendations */}
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-2 font-semibold">Key Recommendations</div>
                        <ul className="space-y-1 text-xs text-gray-300 max-h-32 overflow-y-auto">
                          {appliance.recommendations.slice(0, 4).map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Recommendations */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Overall Energy Strategy</h3>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <ul className="space-y-3 text-sm text-gray-300">
                    {appliancePredictions.overallRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-3 text-lg">•</span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* House Comparison Results */}
          {housePredictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-8 shadow-2xl mb-8 hover:border-yellow-400/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl">🏠</span>
                </div>
                <h2 className="text-3xl font-bold text-white">House Comparison Results</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Total Houses</div>
                  <div className="text-3xl font-bold text-white">{housePredictions.totalHouses}</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Total Units</div>
                  <div className="text-3xl font-bold text-green-400">{housePredictions.totalUnits} kWh</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Total Price</div>
                  <div className="text-3xl font-bold text-cyan-400">PKR {housePredictions.totalPrice}</div>
                </div>
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-2">Avg Cost/Unit</div>
                  <div className="text-3xl font-bold text-yellow-400">PKR {housePredictions.averageCostPerUnit}</div>
                </div>
              </div>

              {/* House Details */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Individual House Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {housePredictions.houses.map((house, index) => {
                    const seasonalAnalysis = getSeasonalAnalysis(house);
                    const lescoAnalysis = generateLESCORecommendations(house);
                    
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">{house.name}</h4>
                          <div className={`text-lg font-bold ${house.grade.color}`}>{house.grade.grade}</div>
                        </div>
                        
                        <div className="space-y-3 text-sm text-gray-300 mb-4">
                          <div>Units: {house.units} kWh</div>
                          <div>Price: PKR {house.price}</div>
                          <div>Cost/Unit: PKR {house.costPerUnit}</div>
                          <div>Efficiency: {house.efficiencyScore}/100</div>
                          <div>Month: {house.month}</div>
                        </div>
                        
                        {/* Seasonal Analysis */}
                        <div className="bg-blue-500/10 rounded-lg p-3 mb-3 border border-blue-500/20">
                          <div className="text-xs text-blue-400 mb-2 font-semibold">Seasonal Analysis</div>
                          <div className="text-xs text-gray-300 mb-1">{seasonalAnalysis.season}</div>
                          <div className="text-xs text-gray-400 mb-2">{seasonalAnalysis.description}</div>
                          <div className="text-xs text-gray-300">
                            <div>Peak: {seasonalAnalysis.peakHours}</div>
                            <div>Off-Peak: {seasonalAnalysis.offPeakHours}</div>
                          </div>
                        </div>
                        
                        {/* LESCO Analysis */}
                        <div className="bg-green-500/10 rounded-lg p-3 mb-3 border border-green-500/20">
                          <div className="text-xs text-green-400 mb-2 font-semibold">LESCO Billing</div>
                          <div className="text-xs text-gray-300 mb-1">{lescoAnalysis.slab}</div>
                          <div className="text-xs text-gray-400">Cost/Unit: PKR {lescoAnalysis.costPerUnit}</div>
                        </div>
                        
                        {/* Recommendations */}
                        <div className="bg-gray-700/30 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-2">Key Recommendations</div>
                          <ul className="space-y-1 text-xs text-gray-300">
                            {house.recommendations.slice(0, 3).map((rec, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seasonal Recommendations */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Seasonal Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {housePredictions.houses.map((house, index) => {
                    const seasonalAnalysis = getSeasonalAnalysis(house);
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                        <h4 className="text-lg font-semibold text-white mb-3">{house.name} - {seasonalAnalysis.season}</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Peak Hours</div>
                            <div className="text-lg font-semibold text-red-400">{seasonalAnalysis.peakHours}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Off-Peak Hours</div>
                            <div className="text-lg font-semibold text-green-400">{seasonalAnalysis.offPeakHours}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Recommendations</div>
                            <ul className="space-y-1 text-sm text-gray-300">
                              {seasonalAnalysis.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-blue-400 mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LESCO Recommendations */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">LESCO Slab Analysis & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {housePredictions.houses.map((house, index) => {
                    const lescoAnalysis = generateLESCORecommendations(house);
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                        <h4 className="text-lg font-semibold text-white mb-3">{house.name}</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Current Slab</div>
                            <div className="text-lg font-semibold text-yellow-400">{lescoAnalysis.slab}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Cost per Unit</div>
                            <div className="text-lg font-semibold text-cyan-400">PKR {lescoAnalysis.costPerUnit}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Action Items</div>
                            <ul className="space-y-1 text-sm text-gray-300">
                              {lescoAnalysis.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-400 mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-red-400 mb-8 backdrop-blur-xl"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <span className="text-lg font-semibold">{error}</span>
              </div>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:border-gray-600/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Prediction History</h2>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300 border border-yellow-500/30 font-semibold hover:bg-yellow-500/40"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
            
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {predictionHistory.length === 0 ? (
                    <div className="text-gray-400 text-center py-12 text-lg">No prediction history yet</div>
                  ) : (
                    predictionHistory.map((entry) => (
                      <div key={entry.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-2">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                            <div className="text-white font-semibold text-lg mb-2">
                              Units: {entry.consumedUnits} kWh | Bill: PKR {entry.billPrice}
                            </div>
                            {entry.prediction && (
                              <div className="text-sm text-gray-300">
                                Next Month: {entry.prediction.next_month_units} kWh
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteHistoryEntry(entry.id)}
                            className="text-red-400 hover:text-red-300 ml-4 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>


        </main>
      </div>
    </div>
  );
};

export default EnhancedPredictionDashboard; 