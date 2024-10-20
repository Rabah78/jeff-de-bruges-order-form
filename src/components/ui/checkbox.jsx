// src/components/ui/Checkbox.jsx
import React from 'react';

const Checkbox = ({ className = "", ...props }) => (
  <input type="checkbox" className={`checkbox ${className}`} {...props} />
);

export default Checkbox;

