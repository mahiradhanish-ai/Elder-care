import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ElderlyDashboard from './pages/ElderlyDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import MedicationManagementPage from './pages/MedicationManagementPage';
import AppointmentManagementPage from './pages/AppointmentManagementPage';
import CareTeamPage from './pages/CareTeamPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ActivityTimelinePage from './pages/ActivityTimelinePage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import PublicConfirmationPage from './pages/PublicConfirmationPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading ElderCare Connect...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dynamic Role-based Dashboard Switcher
const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'elderly':
      return <ElderlyDashboard />;
    case 'caretaker':
      return <CaretakerDashboard />;
    case 'family':
      return <FamilyDashboard />;
    default:
      return <ElderlyDashboard />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-dose/:token" element={<PublicConfirmationPage />} />

            {/* Authenticated Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<RoleDashboard />} />
              <Route path="medications" element={<MedicationManagementPage />} />
              <Route path="appointments" element={<AppointmentManagementPage />} />
              <Route path="care-team" element={<CareTeamPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="activity-timeline" element={<ActivityTimelinePage />} />
              <Route path="profile-settings" element={<ProfileSettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AccessibilityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
