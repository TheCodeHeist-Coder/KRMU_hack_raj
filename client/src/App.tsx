import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import TrackPage from './pages/TrackPage';
import IccLoginPage from './pages/icc/LoginPage';
import IccDashboardPage from './pages/icc/DashboardPage';
import IccComplaintDetailPage from './pages/icc/ComplaintDetailPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminMembersPage from './pages/admin/MembersPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>;
  if (!user || !roles.includes(user.role)) return <Navigate to="/icc/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/icc/login" element={<IccLoginPage />} />
          <Route path="/icc/dashboard" element={<ProtectedRoute roles={['icc', 'admin']}><IccDashboardPage /></ProtectedRoute>} />
          <Route path="/icc/complaints/:id" element={<ProtectedRoute roles={['icc', 'admin']}><IccComplaintDetailPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute roles={['admin']}><AdminMembersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
