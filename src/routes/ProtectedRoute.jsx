import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../state/auth/authState';

const ProtectedRoute = () => {
    const isAuthenticated = useRecoilValue(authAtom).isAuthenticated;
    const token = sessionStorage.getItem("token");

    if (!isAuthenticated && !token) {
        return <Navigate to="/" />;
    }

    return (
        <Outlet />
    );
};

export default ProtectedRoute;