import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewFeedback from './pages/NewFeedback';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import Structure from './pages/Structure';
import Configuration from './pages/Configuration';
import Login from './pages/Login';
import EmployeeDossier from './pages/EmployeeDossier';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    // Define role-based access
    const hasAdminAccess = user?.role === 'RH' || user?.role === 'Diretor';

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feedback" element={<NewFeedback />} />
                {hasAdminAccess && (
                    <>
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/employees/:employeeId" element={<EmployeeDossier />} />
                        <Route path="/structure" element={<Structure />} />
                        <Route path="/configuration" element={<Configuration />} />
                    </>
                )}
                {/* Add a fallback route for users trying to access restricted pages or non-existent ones */}
                <Route path="*" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;