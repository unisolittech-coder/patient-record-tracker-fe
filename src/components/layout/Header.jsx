import React from 'react';

export default function Header() {
  const userRole = sessionStorage.getItem('role') || '';
  const userName = sessionStorage.getItem('name') || '';

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Patient Record Tracker</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {userName?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">{userName}</span>
            {userName && <span className="text-xs text-gray-500">{userRole}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
