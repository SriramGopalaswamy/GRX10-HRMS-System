
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmployeeProvider } from './contexts/EmployeeContext';
import { RegularizationProvider } from './contexts/RegularizationContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Attendance } from './pages/Attendance';
import { Leaves } from './pages/Leaves';
import { Payroll } from './pages/Payroll';
import { PolicyChat } from './pages/PolicyChat';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
      <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
      <Route path="/assistant" element={<PrivateRoute><PolicyChat /></PrivateRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <EmployeeProvider>
      <RegularizationProvider>
        <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AuthProvider>
      </RegularizationProvider>
    </EmployeeProvider>
  );
}
