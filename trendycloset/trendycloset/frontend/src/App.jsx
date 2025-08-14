// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import SignupUser from './pages/SignupUser';
import SignupPartner from './pages/SignupPartner';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './routes/ProtectedRoute';

// Feature pages accessible via top navigation
import Products from './pages/Products';
import Cart from './pages/Cart';
import OrdersUser from './pages/OrdersUser';
import PartnerProducts from './pages/PartnerProducts';
import PartnerOrders from './pages/PartnerOrders';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup/user" element={<SignupUser />} />
      <Route path="/signup/partner" element={<SignupPartner />} />
      <Route path="/verify" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Feature Pages */}
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={
        <ProtectedRoute allow={['USER']}><Cart /></ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allow={['USER']}><OrdersUser /></ProtectedRoute>
      } />
      <Route path="/partner/products" element={
        <ProtectedRoute allow={['PARTNER']}><PartnerProducts /></ProtectedRoute>
      } />
      <Route path="/partner/orders" element={
        <ProtectedRoute allow={['PARTNER']}><PartnerOrders /></ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/products" replace />} />
      <Route path="/dashboard/user" element={<Navigate to="/products" replace />} />
      <Route path="/dashboard/partner" element={<Navigate to="/partner/products" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
