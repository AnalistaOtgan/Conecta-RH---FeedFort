import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Sidebar from './Sidebar';
import Header from './Header';

const FullPageLoader: React.FC = () => (
    <div className="flex h-screen w-screen items-center justify-center bg-brand-light-gray">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-blue"></div>
    </div>
);


const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const { loading: isDataLoading } = useData();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (isDataLoading) {
    return <FullPageLoader />;
  }

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