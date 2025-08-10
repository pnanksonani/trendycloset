// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import SignupUser from './pages/SignupUser';
import SignupPartner from './pages/SignupPartner';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import DashboardUser from './pages/DashboardUser';
import DashboardPartner from './pages/DashboardPartner';
import ProtectedRoute from './routes/ProtectedRoute';

// Optional: if you added the product/cart/order pages I gave you
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

        {/* If you added these routes, uncomment the imports above */}
        
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
        

        {/* Nice-to-have redirects */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
  );
}
