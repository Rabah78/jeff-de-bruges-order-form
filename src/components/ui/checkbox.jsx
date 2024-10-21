// src/components/ui/checkbox.jsx
import React from 'react';

const Checkbox = ({ className = "", ...props }) => (
  <input type="checkbox" className={`checkbox ${className}`} {...props} />
);

export default Checkbox;
