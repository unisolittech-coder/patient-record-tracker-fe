import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/auth/useLogin';
import { ROLES } from '../../constants/roles';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { resetAdminRes, logout } = useLogin();
  // Assuming you have a useLogin hook to reset adminRes
  const userRole = sessionStorage.getItem('role') || '';
  const userName = sessionStorage.getItem('name') || '';

  const superAdminMenus = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/dashboard"
    },
    {
      label: "Data Entry Operator Mgmt",
      icon: "pi pi-users",
      path: "/receptionist-management"
    },
    {
      label: "Patient Data",
      icon: "pi pi-folder",
      path: "/patient-data"
    },
    {
      label: "Patient Registration",
      icon: "pi pi-user-plus",
      path: "/patient-registration"
    },
    {
      label: "Analytics",
      icon: "pi pi-chart-bar",
      path: "/analytics"
    },
  ];

  const receptionistMenus = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/dashboard"
    },
    {
      label: "Patient Data",
      icon: "pi pi-folder",
      path: "/patient-data"
    },
    {
      label: "Patient Registration",
      icon: "pi pi-user-plus",
      path: "/patient-registration"
    }
  ];

  const menuItems =
    userRole === ROLES.SUPER_ADMIN
      ? superAdminMenus
      : receptionistMenus;

  const handleLogout = () => {
    logout();
    sessionStorage.clear();
    resetAdminRes();
    navigate('/');
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-2xl border-r border-white/10 relative`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-slate-800 border border-white/10 text-gray-400 hover:text-white transition-all w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-700 z-10"
      >
        <i className={`pi ${isCollapsed ? 'pi-angle-right' : 'pi-angle-left'} text-xs`}></i>
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-[1.02]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full shadow-lg shadow-blue-400/50"></div>
                )}

                {/* Icon with background */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive
                  ? 'bg-white/20 shadow-inner'
                  : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                  <i className={`${item.icon} text-lg ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}></i>
                </div>

                {!isCollapsed && (
                  <>
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>

                    {/* Hover arrow */}
                    <div className={`ml-auto transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}>
                      <i className="pi pi-chevron-right text-xs text-blue-300"></i>
                    </div>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <span className="text-xs font-bold">{userName?.charAt(0)?.toUpperCase()}</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userRole === 'super_admin' ? 'Super Admin' : 'Data Entry Operator'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-400 hover:text-white transition-all p-2 rounded-lg hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/10 group shrink-0"
          >
            <i className="pi pi-sign-out text-lg group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}