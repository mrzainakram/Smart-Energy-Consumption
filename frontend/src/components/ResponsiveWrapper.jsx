import React, { useState, useEffect } from 'react';

const ResponsiveWrapper = ({ 
  children, 
  className = '', 
  deviceType = 'auto',
  enableTouch = true,
  optimizeFor3D = true 
}) => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenSize: 'lg',
    orientation: 'portrait'
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Device detection
      const isMobile = width < 768 || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Screen size classification
      let screenSize = 'xs';
      if (width >= 640) screenSize = 'sm';
      if (width >= 768) screenSize = 'md';
      if (width >= 1024) screenSize = 'lg';
      if (width >= 1280) screenSize = 'xl';
      if (width >= 1536) screenSize = '2xl';
      
      // Orientation
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenSize,
        orientation,
        width,
        height
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  const getResponsiveClasses = () => {
    const baseClasses = [
      'responsive-wrapper',
      'w-full',
      'min-h-screen',
      'relative',
      'overflow-x-hidden'
    ];

    // Device-specific classes
    if (deviceInfo.isMobile) {
      baseClasses.push(
        'mobile-optimized',
        'px-4',
        'py-2',
        enableTouch ? 'touch-manipulation' : '',
        optimizeFor3D ? 'reduce-motion' : ''
      );
    } else if (deviceInfo.isTablet) {
      baseClasses.push(
        'tablet-optimized',
        'px-6',
        'py-4'
      );
    } else {
      baseClasses.push(
        'desktop-optimized',
        'px-8',
        'py-6'
      );
    }

    // Orientation classes
    baseClasses.push(`orientation-${deviceInfo.orientation}`);

    // Performance classes
    if (deviceInfo.isMobile && optimizeFor3D) {
      baseClasses.push('gpu-accelerated');
    }

    return baseClasses.filter(Boolean).join(' ');
  };

  return (
    <div 
      className={`${getResponsiveClasses()} ${className}`}
      data-device-type={deviceType}
      data-screen-size={deviceInfo.screenSize}
      data-orientation={deviceInfo.orientation}
      style={{
        '--viewport-width': `${deviceInfo.width}px`,
        '--viewport-height': `${deviceInfo.height}px`
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveWrapper; 