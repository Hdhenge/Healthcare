import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// Customer Panel
import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import StoreLocator from './pages/customer/StoreLocator';
import MedicineSearch from './pages/customer/MedicineSearch';
import PrescriptionScanner from './pages/customer/PrescriptionScanner';
import MedicineReminder from './pages/customer/MedicineReminder';
import BudgetCalculator from './pages/customer/BudgetCalculator';

// Vendor Panel
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import InventoryManagement from './pages/vendor/InventoryManagement';
import ExpiryAlerts from './pages/vendor/ExpiryAlerts';
import SalesAnalytics from './pages/vendor/SalesAnalytics';
import Reports from './pages/vendor/Reports';

// Admin Panel
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AreaAnalytics from './pages/admin/AreaAnalytics';
import ProductTrends from './pages/admin/ProductTrends';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVendors from './pages/admin/ManageVendors';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, loading, logout } = useAuth();
  const [checking, setChecking] = useState(true);

  React.useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Authenticating & Fetching Profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // If we have currentUser but no profile after loading finishes, it's a data fetch issue or DB inconsistency
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="glass-card p-10 text-center max-w-sm">
          <div className="text-red-400 mb-4 font-black text-2xl">Profile Missing</div>
          <p className="text-gray-400 mb-6 text-sm">We couldn't load your account profile from the database. This might be a Firestore permission issue.</p>
          <button onClick={() => logout()} className="btn-primary w-full">Back to Login</button>
        </div>
      </div>
    );
  }
  
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Customer Routes */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<CustomerDashboard />} />
        <Route path="stores" element={<StoreLocator />} />
        <Route path="search" element={<MedicineSearch />} />
        <Route path="prescription" element={<PrescriptionScanner />} />
        <Route path="reminders" element={<MedicineReminder />} />
        <Route path="budget" element={<BudgetCalculator />} />
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor" element={
        <ProtectedRoute allowedRoles={['vendor']}>
          <VendorLayout />
        </ProtectedRoute>
      }>
        <Route index element={<VendorDashboard />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="expiry" element={<ExpiryAlerts />} />
        <Route path="analytics" element={<SalesAnalytics />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="area-analytics" element={<AreaAnalytics />} />
        <Route path="product-trends" element={<ProductTrends />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="vendors" element={<ManageVendors />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
