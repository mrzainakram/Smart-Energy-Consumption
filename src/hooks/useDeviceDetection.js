import { useState, useEffect } from 'react';

/**
 * Universal Device Detection Hook
 * Automatically detects device type and provides responsive behavior
 * Supports ALL devices: phones, tablets, laptops, desktops, ultrawide
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'unknown',
    screenSize: 'unknown',
    orientation: 'portrait',
    isTouch: false,
    isHighDPI: false,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    isUltraWide: false,
    breakpoint: 'xs'
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Device type detection
      let type = 'unknown';
      let screenSize = 'unknown';
      let breakpoint = 'xs';
      let isMobile = false;
      let isTablet = false;
      let isLaptop = false;
      let isDesktop = false;
      let isUltraWide = false;

      // Breakpoint system
      if (width <= 320) {
        breakpoint = 'xs';
        type = 'phone';
        screenSize = 'extra-small';
        isMobile = true;
      } else if (width <= 480) {
        breakpoint = 'sm';
        type = 'phone';
        screenSize = 'small';
        isMobile = true;
      } else if (width <= 768) {
        breakpoint = 'md';
        type = 'tablet';
        screenSize = 'medium';
        isTablet = true;
      } else if (width <= 1024) {
        breakpoint = 'lg';
        type = 'laptop';
        screenSize = 'large';
        isLaptop = true;
      } else if (width <= 1440) {
        breakpoint = 'xl';
        type = 'desktop';
        screenSize = 'extra-large';
        isDesktop = true;
      } else if (width <= 1920) {
        breakpoint = '2xl';
        type = 'desktop';
        screenSize = '2x-large';
        isDesktop = true;
      } else {
        breakpoint = '3xl';
        type = 'ultrawide';
        screenSize = 'ultra-wide';
        isUltraWide = true;
      }

      // Touch detection
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // High DPI detection
      const isHighDPI = window.devicePixelRatio > 1;

      setDeviceInfo({
        type,
        screenSize,
        orientation,
        isTouch,
        isHighDPI,
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
        isUltraWide,
        breakpoint,
        width,
        height,
        pixelRatio: window.devicePixelRatio
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize and orientation changes
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  // Responsive utility functions
  const isBreakpoint = (breakpoint) => deviceInfo.breakpoint === breakpoint;
  const isBreakpointOrAbove = (breakpoint) => {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    const currentIndex = breakpoints.indexOf(deviceInfo.breakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  };
  const isBreakpointOrBelow = (breakpoint) => {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    const currentIndex = breakpoints.indexOf(deviceInfo.breakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex <= targetIndex;
  };

  // Device-specific recommendations
  const getOptimalSettings = () => {
    if (deviceInfo.isMobile) {
      return {
        gridCols: 1,
        buttonSize: 'large',
        fontSize: 'medium',
        spacing: 'compact',
        animations: 'reduced'
      };
    } else if (deviceInfo.isTablet) {
      return {
        gridCols: 2,
        buttonSize: 'medium',
        fontSize: 'large',
        spacing: 'balanced',
        animations: 'moderate'
      };
    } else if (deviceInfo.isLaptop) {
      return {
        gridCols: 3,
        buttonSize: 'medium',
        fontSize: 'large',
        spacing: 'comfortable',
        animations: 'full'
      };
    } else if (deviceInfo.isDesktop) {
      return {
        gridCols: 4,
        buttonSize: 'medium',
        fontSize: 'large',
        spacing: 'spacious',
        animations: 'full'
      };
    } else if (deviceInfo.isUltraWide) {
      return {
        gridCols: 5,
        buttonSize: 'large',
        fontSize: 'extra-large',
        spacing: 'very-spacious',
        animations: 'full'
      };
    }
    
    return {
      gridCols: 1,
      buttonSize: 'medium',
      fontSize: 'medium',
      spacing: 'balanced',
      animations: 'moderate'
    };
  };

  // Responsive class generator
  const getResponsiveClasses = (baseClass, variants = {}) => {
    const classes = [baseClass];
    
    // Add responsive variants
    Object.entries(variants).forEach(([breakpoint, variant]) => {
      if (isBreakpointOrAbove(breakpoint)) {
        classes.push(variant);
      }
    });
    
    return classes.join(' ');
  };

  return {
    ...deviceInfo,
    isBreakpoint,
    isBreakpointOrAbove,
    isBreakpointOrBelow,
    getOptimalSettings,
    getResponsiveClasses
  };
};

/**
 * Responsive Breakpoint Hook
 * Provides simple breakpoint checking
 */
export const useBreakpoint = () => {
  const deviceInfo = useDeviceDetection();
  
  return {
    isXs: deviceInfo.breakpoint === 'xs',
    isSm: deviceInfo.breakpoint === 'sm',
    isMd: deviceInfo.breakpoint === 'md',
    isLg: deviceInfo.breakpoint === 'lg',
    isXl: deviceInfo.breakpoint === 'xl',
    is2xl: deviceInfo.breakpoint === '2xl',
    is3xl: deviceInfo.breakpoint === '3xl',
    breakpoint: deviceInfo.breakpoint
  };
};

/**
 * Touch Device Hook
 * Detects touch capabilities
 */
export const useTouchDevice = () => {
  const deviceInfo = useDeviceDetection();
  
  return {
    isTouch: deviceInfo.isTouch,
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    hasTouch: deviceInfo.isTouch
  };
};

/**
 * Screen Size Hook
 * Provides screen size information
 */
export const useScreenSize = () => {
  const deviceInfo = useDeviceDetection();
  
  return {
    width: deviceInfo.width,
    height: deviceInfo.height,
    orientation: deviceInfo.orientation,
    isLandscape: deviceInfo.orientation === 'landscape',
    isPortrait: deviceInfo.orientation === 'portrait',
    aspectRatio: deviceInfo.width / deviceInfo.height
  };
};

export default useDeviceDetection; 