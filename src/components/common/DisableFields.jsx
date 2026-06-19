import React from 'react';

export default function DisableFields({ disabled, children }) {
  if (!disabled) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="absolute inset-0 z-10 bg-gray-150/50 cursor-not-allowed rounded-lg" title="These fields are disabled"></div>
      <div className="pointer-events-none opacity-60 transition-opacity">
        {children}
      </div>
    </div>
  );
}
