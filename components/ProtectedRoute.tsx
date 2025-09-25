import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-brand-light-gray text-brand-text overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light-gray p-4 sm:p-8">
                <Outlet />
            </main>
        </div>
    </div>
  );
};

export default ProtectedRoute;