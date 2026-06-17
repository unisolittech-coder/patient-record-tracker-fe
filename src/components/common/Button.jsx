import React from 'react';
import { Button as PrimeButton } from 'primereact/button';

export default function Button({ label, icon, onClick, type = 'button', variant = 'primary', className = '', loading = false, disabled = false, ...props }) {

  const baseClasses = "py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm border focus:ring-2 focus:ring-offset-1 focus:outline-none";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/20 scale-[1.02]",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-500",
    text: "bg-transparent hover:bg-gray-100 text-blue-600 border-transparent shadow-none"
  };

  return (
    <PrimeButton
      label={label}
      icon={icon}
      onClick={onClick}
      type={type}
      loading={loading}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      pt={{
        label: { className: 'font-semibold' },
        icon: { className: 'text-sm' }
      }}
      {...props}
    />
  );
}
