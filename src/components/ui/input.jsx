// src/components/ui/input.jsx
import React from 'react';

const Input = ({ className = "", ...props }) => (
  <input className={`input p-2 border rounded ${className}`} {...props} />
);

export default Input;
