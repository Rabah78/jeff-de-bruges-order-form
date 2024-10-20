// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, className = "", ...props }) => (
  <button className={`button bg-blue-500 text-white p-2 rounded ${className}`} {...props}>
    {children}
  </button>
);

export default Button;

