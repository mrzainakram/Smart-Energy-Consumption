import React from 'react';
import { motion } from 'framer-motion';

/**
 * Universal Responsive Wrapper Component
 * Automatically adapts to ALL device types and screen sizes
 * Provides professional responsive behavior without limitations
 */
const UniversalResponsiveWrapper = ({ 
  children, 
  className = '', 
  animation = true,
  responsiveClass = 'responsive-container',
  ...props 
}) => {
  // Device detection and responsive class application
  const getResponsiveClasses = () => {
    const baseClasses = [
      responsiveClass,
      'w-full',
      'transition-all',
      'duration-300',
      'ease-in-out'
    ];
    
    return baseClasses.join(' ');
  };

  // Universal responsive animation variants
  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (animation) {
    return (
      <motion.div
        className={`${getResponsiveClasses()} ${className}`}
        initial="hidden"
        animate="visible"
        variants={animationVariants}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${getResponsiveClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Universal Grid Component
 * Automatically adjusts columns based on device size
 */
export const UniversalGrid = ({ 
  children, 
  className = '', 
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  ultraWideCols = 4,
  gap = 'responsive',
  ...props 
}) => {
  const getGridClasses = () => {
    const baseClasses = [
      'grid',
      'w-full',
      'transition-all',
      'duration-300'
    ];

    // Responsive gap system
    if (gap === 'responsive') {
      baseClasses.push('gap-3 sm:gap-4 md:gap-6 lg:gap-8');
    } else {
      baseClasses.push(gap);
    }

    // Responsive column system
    baseClasses.push(`grid-cols-${mobileCols}`);
    baseClasses.push(`sm:grid-cols-${Math.min(tabletCols, 2)}`);
    baseClasses.push(`md:grid-cols-${tabletCols}`);
    baseClasses.push(`lg:grid-cols-${desktopCols}`);
    baseClasses.push(`xl:grid-cols-${ultraWideCols}`);

    return baseClasses.join(' ');
  };

  return (
    <div className={`${getGridClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Universal Card Component
 * Professional card design that adapts to all devices
 */
export const UniversalCard = ({ 
  children, 
  className = '', 
  hover = true,
  glassmorphism = true,
  padding = 'responsive',
  ...props 
}) => {
  const getCardClasses = () => {
    const baseClasses = [
      'card-universal',
      'w-full',
      'transition-all',
      'duration-300',
      'ease-in-out'
    ];

    if (glassmorphism) {
      baseClasses.push('backdrop-blur-md bg-white/10 border-white/20');
    }

    if (hover) {
      baseClasses.push('hover:transform hover:-translate-y-2 hover:shadow-2xl');
    }

    if (padding === 'responsive') {
      baseClasses.push('p-4 sm:p-6 lg:p-8');
    } else {
      baseClasses.push(padding);
    }

    return baseClasses.join(' ');
  };

  return (
    <div className={`${getCardClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Universal Button Component
 * Touch-friendly and responsive across all devices
 */
export const UniversalButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'responsive',
  fullWidth = false,
  disabled = false,
  ...props 
}) => {
  const getButtonClasses = () => {
    const baseClasses = [
      'btn-universal',
      'font-semibold',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2'
    ];

    // Variant styles
    switch (variant) {
      case 'primary':
        baseClasses.push('bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500');
        break;
      case 'secondary':
        baseClasses.push('bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500');
        break;
      case 'success':
        baseClasses.push('bg-green-600 hover:bg-green-700 text-white focus:ring-green-500');
        break;
      case 'danger':
        baseClasses.push('bg-red-600 hover:bg-red-700 text-white focus:ring-red-500');
        break;
      case 'outline':
        baseClasses.push('border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500');
        break;
      default:
        baseClasses.push('bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500');
    }

    // Size system
    if (size === 'responsive') {
      baseClasses.push('h-10 sm:h-12 lg:h-14 px-4 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg');
    } else {
      baseClasses.push(size);
    }

    if (fullWidth) {
      baseClasses.push('w-full');
    }

    if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    }

    return baseClasses.join(' ');
  };

  return (
    <button 
      className={`${getButtonClasses()} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Universal Text Component
 * Responsive typography that scales perfectly on all devices
 */
export const UniversalText = ({ 
  children, 
  className = '', 
  variant = 'body',
  responsive = true,
  ...props 
}) => {
  const getTextClasses = () => {
    const baseClasses = ['transition-all duration-300'];

    if (responsive) {
      switch (variant) {
        case 'h1':
          baseClasses.push('text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold');
          break;
        case 'h2':
          baseClasses.push('text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold');
          break;
        case 'h3':
          baseClasses.push('text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold');
          break;
        case 'h4':
          baseClasses.push('text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold');
          break;
        case 'body':
          baseClasses.push('text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl');
          break;
        case 'caption':
          baseClasses.push('text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600');
          break;
        default:
          baseClasses.push('text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl');
      }
    } else {
      baseClasses.push(variant);
    }

    return baseClasses.join(' ');
  };

  return (
    <div className={`${getTextClasses()} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Universal Input Component
 * Responsive input fields optimized for all devices
 */
export const UniversalInput = ({ 
  className = '', 
  size = 'responsive',
  fullWidth = true,
  ...props 
}) => {
  const getInputClasses = () => {
    const baseClasses = [
      'input-universal',
      'transition-all',
      'duration-300',
      'focus:ring-2',
      'focus:ring-blue-500'
    ];

    if (size === 'responsive') {
      baseClasses.push('h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg');
    } else {
      baseClasses.push(size);
    }

    if (fullWidth) {
      baseClasses.push('w-full');
    }

    return baseClasses.join(' ');
  };

  return (
    <input 
      className={`${getInputClasses()} ${className}`} 
      {...props}
    />
  );
};

export default UniversalResponsiveWrapper; 