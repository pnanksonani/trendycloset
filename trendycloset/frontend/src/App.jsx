import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import SignupUser from './pages/SignupUser';
import SignupPartner from './pages/SignupPartner';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import DashboardUser from './pages/DashboardUser';
import DashboardPartner from './pages/DashboardPartner';

import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup/user" element={<SignupUser />} />
        <Route path="/signup/partner" element={<SignupPartner />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allow={['USER']}>
              <DashboardUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partner"
          element={
            <ProtectedRoute allow={['PARTNER']}>
              <DashboardPartner />
            </ProtectedRoute>
          }
        />

        {/* Nice-to-have redirects */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
  );
}
