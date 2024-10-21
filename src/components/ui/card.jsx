// src/components/ui/card.jsx
import React from 'react';

const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`card p-4 shadow-md rounded-md bg-white ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// Définir une exportation par défaut ainsi que des exportations nommées pour `CardHeader`, `CardContent`, et `CardFooter`
export { CardHeader, CardContent, CardFooter };
export default Card;
