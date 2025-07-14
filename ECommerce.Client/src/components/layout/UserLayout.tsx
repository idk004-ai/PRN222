import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserHeader } from './UserHeader';

export const UserLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <UserHeader />
            <Outlet />
        </div>
    );
};
