import React from 'react';

const ResponsiveWrapper = ({ children, className = '', deviceType = 'auto' }) => {
  return (
    <div className={`responsive-wrapper ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveWrapper; 