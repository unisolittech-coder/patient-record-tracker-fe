// src/routes/RoleProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleProtectedRoute({
    allowedRoles,
    children
}) {
    const role = sessionStorage.getItem("role");

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
}