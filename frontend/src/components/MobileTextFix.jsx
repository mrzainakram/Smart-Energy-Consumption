import React, { useEffect, useState } from 'react';

// Mobile text fix component for iOS gradient text issues
const MobileTextFix = ({ children, className = '', gradientColors = ['#FFCC80', '#FFA500', '#FF8C00'], fallbackColor = '#FFA500', ...props }) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  const getTextStyles = () => {
    const baseStyles = {
      fontFamily: "'Bungee Spice', cursive, sans-serif",
      fontWeight: 'bold',
      ...props.style
    };

    if (isIOS) {
      // iOS-specific styles with better fallback
      return {
        ...baseStyles,
        color: fallbackColor,
        background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        // Force hardware acceleration
        transform: 'translateZ(0)',
        willChange: 'transform',
        // Better text rendering on iOS
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      };
    }

    // Non-iOS devices
    return {
      ...baseStyles,
      background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
    };
  };

  return (
    <span 
      className={`mobile-text-fix ${className}`}
      style={getTextStyles()}
      {...props}
    >
      {children}
    </span>
  );
};

export default MobileTextFix;