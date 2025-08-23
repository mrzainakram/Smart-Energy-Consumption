import React from 'react';
import { motion } from 'framer-motion';
import useDeviceDetection from '../hooks/useDeviceDetection';
import UniversalResponsiveWrapper, { 
  UniversalGrid, 
  UniversalCard, 
  UniversalButton, 
  UniversalText,
  UniversalInput 
} from './UniversalResponsiveWrapper';

/**
 * Responsive Demo Component
 * Showcases the universal responsive system working on ALL devices
 */
const ResponsiveDemo = () => {
  const deviceInfo = useDeviceDetection();
  const optimalSettings = deviceInfo.getOptimalSettings();

  return (
    <UniversalResponsiveWrapper className="py-8">
      {/* Device Information Display */}
      <UniversalCard className="mb-8 text-center">
        <UniversalText variant="h1" className="mb-4">
          🚀 Universal Responsive System
        </UniversalText>
        <UniversalText variant="body" className="mb-6">
          This website automatically adapts to ALL devices without limitations
        </UniversalText>
        
        {/* Device Info Grid */}
        <UniversalGrid 
          mobileCols={1} 
          tabletCols={2} 
          desktopCols={3} 
          ultraWideCols={4}
          className="mb-6"
        >
          <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
            <UniversalText variant="h4" className="text-blue-400 mb-2">
              📱 Device Type
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)}
            </UniversalText>
          </div>
          
          <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
            <UniversalText variant="h4" className="text-green-400 mb-2">
              📏 Screen Size
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.width} × {deviceInfo.height}
            </UniversalText>
          </div>
          
          <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
            <UniversalText variant="h4" className="text-purple-400 mb-2">
              🎯 Breakpoint
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.breakpoint.toUpperCase()}
            </UniversalText>
          </div>
          
          <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/30">
            <UniversalText variant="h4" className="text-orange-400 mb-2">
              🔄 Orientation
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.orientation.charAt(0).toUpperCase() + deviceInfo.orientation.slice(1)}
            </UniversalText>
          </div>
        </UniversalGrid>

        {/* Optimal Settings */}
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
          <UniversalText variant="h3" className="mb-4 text-cyan-400">
            ⚙️ Optimal Settings for {deviceInfo.type}
          </UniversalText>
          <UniversalGrid 
            mobileCols={1} 
            tabletCols={2} 
            desktopCols={4} 
            ultraWideCols={5}
            gap="gap-4"
          >
            <div className="text-center">
              <UniversalText variant="h4" className="text-yellow-400 mb-1">
                Grid Columns
              </UniversalText>
              <UniversalText variant="body" className="text-white">
                {optimalSettings.gridCols}
              </UniversalText>
            </div>
            <div className="text-center">
              <UniversalText variant="h4" className="text-yellow-400 mb-1">
                Button Size
              </UniversalText>
              <UniversalText variant="body" className="text-white">
                {optimalSettings.buttonSize}
              </UniversalText>
            </div>
            <div className="text-center">
              <UniversalText variant="h4" className="text-yellow-400 mb-1">
                Font Size
              </UniversalText>
              <UniversalText variant="body" className="text-white">
                {optimalSettings.fontSize}
              </UniversalText>
            </div>
            <div className="text-center">
              <UniversalText variant="h4" className="text-yellow-400 mb-1">
                Spacing
              </UniversalText>
              <UniversalText variant="body" className="text-white">
                {optimalSettings.spacing}
              </UniversalText>
            </div>
            <div className="text-center">
              <UniversalText variant="h4" className="text-yellow-400 mb-1">
                Animations
              </UniversalText>
              <UniversalText variant="body" className="text-white">
                {optimalSettings.animations}
              </UniversalText>
            </div>
          </UniversalGrid>
        </div>
      </UniversalCard>

      {/* Interactive Demo Section */}
      <UniversalCard className="mb-8">
        <UniversalText variant="h2" className="mb-6 text-center text-green-400">
          🎮 Interactive Responsive Demo
        </UniversalText>
        
        {/* Responsive Form */}
        <UniversalGrid 
          mobileCols={1} 
          tabletCols={2} 
          desktopCols={3} 
          ultraWideCols={4}
          className="mb-6"
        >
          <div>
            <UniversalText variant="h4" className="mb-2 text-blue-400">
              Name
            </UniversalText>
            <UniversalInput 
              placeholder="Enter your name"
              className="w-full"
            />
          </div>
          
          <div>
            <UniversalText variant="h4" className="mb-2 text-blue-400">
              Email
            </UniversalText>
            <UniversalInput 
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
          </div>
          
          <div>
            <UniversalText variant="h4" className="mb-2 text-blue-400">
              Phone
            </UniversalText>
            <UniversalInput 
              type="tel"
              placeholder="Enter your phone"
              className="w-full"
            />
          </div>
          
          <div>
            <UniversalText variant="h4" className="mb-2 text-blue-400">
              Age
            </UniversalText>
            <UniversalInput 
              type="number"
              placeholder="Enter your age"
              className="w-full"
            />
          </div>
        </UniversalGrid>

        {/* Responsive Buttons */}
        <UniversalGrid 
          mobileCols={1} 
          tabletCols={2} 
          desktopCols={4} 
          ultraWideCols={5}
          className="mb-6"
        >
          <UniversalButton variant="primary" fullWidth>
            🚀 Primary Action
          </UniversalButton>
          
          <UniversalButton variant="secondary" fullWidth>
            ⚙️ Secondary Action
          </UniversalButton>
          
          <UniversalButton variant="success" fullWidth>
            ✅ Success Action
          </UniversalButton>
          
          <UniversalButton variant="danger" fullWidth>
            🚨 Danger Action
          </UniversalButton>
          
          <UniversalButton variant="outline" fullWidth>
            📝 Outline Action
          </UniversalButton>
        </UniversalGrid>
      </UniversalCard>

      {/* Feature Cards Demo */}
      <UniversalCard>
        <UniversalText variant="h2" className="mb-6 text-center text-purple-400">
          ✨ Feature Cards - Responsive Layout
        </UniversalText>
        
        <UniversalGrid 
          mobileCols={1} 
          tabletCols={2} 
          desktopCols={3} 
          ultraWideCols={4}
          gap="gap-6"
        >
          {[
            { icon: '🎯', title: 'AI Predictions', desc: 'Smart energy consumption forecasting' },
            { icon: '📸', title: 'Bill Scanner', desc: 'OCR-powered bill analysis' },
            { icon: '🤖', title: 'AI Assistant', desc: '24/7 energy optimization help' },
            { icon: '⚡', title: 'Real-time Data', desc: 'Live energy consumption monitoring' },
            { icon: '📊', title: 'Analytics', desc: 'Detailed energy usage insights' },
            { icon: '🌍', title: 'Eco Tips', desc: 'Environment-friendly recommendations' },
            { icon: '💰', title: 'Cost Savings', desc: 'Money-saving energy strategies' },
            { icon: '🏠', title: 'Home Comparison', desc: 'Compare with similar households' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 text-center">{feature.icon}</div>
              <UniversalText variant="h4" className="mb-2 text-center text-white">
                {feature.title}
              </UniversalText>
              <UniversalText variant="body" className="text-center text-gray-300">
                {feature.desc}
              </UniversalText>
            </motion.div>
          ))}
        </UniversalGrid>
      </UniversalCard>

      {/* Device Capabilities */}
      <UniversalCard className="mt-8">
        <UniversalText variant="h2" className="mb-6 text-center text-cyan-400">
          🔍 Device Capabilities
        </UniversalText>
        
        <UniversalGrid 
          mobileCols={1} 
          tabletCols={2} 
          desktopCols={3} 
          ultraWideCols={4}
        >
          <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <UniversalText variant="h4" className="text-blue-400 mb-2">
              Touch Support
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.isTouch ? '✅ Supported' : '❌ Not Supported'}
            </UniversalText>
          </div>
          
          <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
            <UniversalText variant="h4" className="text-green-400 mb-2">
              High DPI
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.isHighDPI ? '✅ Retina/4K' : '❌ Standard'}
            </UniversalText>
          </div>
          
          <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <UniversalText variant="h4" className="text-purple-400 mb-2">
              Pixel Ratio
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.pixelRatio}x
            </UniversalText>
          </div>
          
          <div className="text-center p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
            <UniversalText variant="h4" className="text-orange-400 mb-2">
              Screen Size
            </UniversalText>
            <UniversalText variant="body" className="text-white">
              {deviceInfo.screenSize}
            </UniversalText>
          </div>
        </UniversalGrid>
      </UniversalCard>

      {/* Responsive Text Demo */}
      <UniversalCard className="mt-8">
        <UniversalText variant="h2" className="mb-6 text-center text-yellow-400">
          📝 Responsive Typography Demo
        </UniversalText>
        
        <div className="space-y-4">
          <UniversalText variant="h1" className="text-center">
            This is H1 - Scales from 2xl to 6xl
          </UniversalText>
          <UniversalText variant="h2" className="text-center">
            This is H2 - Scales from xl to 5xl
          </UniversalText>
          <UniversalText variant="h3" className="text-center">
            This is H3 - Scales from lg to 4xl
          </UniversalText>
          <UniversalText variant="body" className="text-center">
            This is body text - Scales from sm to 2xl
          </UniversalText>
          <UniversalText variant="caption" className="text-center">
            This is caption text - Scales from xs to xl
          </UniversalText>
        </div>
      </UniversalCard>
    </UniversalResponsiveWrapper>
  );
};

export default ResponsiveDemo; 