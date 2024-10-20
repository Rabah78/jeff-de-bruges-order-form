// src/components/ui/alert.jsx
import React from 'react';

export const Alert = ({ children, className = "", ...props }) => (
  <div className={`alert p-4 border rounded bg-yellow-100 ${className}`} {...props}>
    {children}
  </div>
);

export const AlertDescription = ({ children, className = "", ...props }) => (
  <p className={`alert-description ${className}`} {...props}>
    {children}
  </p>
);

// No default export here, only named exports
