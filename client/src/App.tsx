import React, { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PartnerRegister from './pages/PartnerRegister';
import Services from './pages/Services';
import Barbers from './pages/Barbers';
import BarberProfile from './pages/BarberProfile';
import Contact from './pages/Contact';
import Book from './pages/Book';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminBarbers from './pages/admin/AdminBarbers';
import AdminServices from './pages/admin/AdminServices';
import AdminOffers from './pages/admin/AdminOffers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import AdminResetPassword from './pages/admin/AdminResetPassword';

interface RouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const GuestRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

import PlatformHome from './pages/PlatformHome';

/* Wrapper that conditionally shows the customer Navbar + Footer */
const ShopLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/barbers/:barberId" element={<BarberProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

const AppLayout: React.FC = () => {
  return (
    <main>
      <Routes>
        {/* SaaS Platform Landing Page */}
        <Route path="/" element={<PlatformHome />} />
        
        {/* Auth Pages (Global) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/partner-signup" element={<GuestRoute><PartnerRegister /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Admin Pages (Global) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
        <Route path="/admin/barbers" element={<AdminRoute><AdminBarbers /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
        <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

        {/* Shop Specific Pages (Navbar and Footer included inside ShopLayout) */}
        <Route path="/:shopSlug/*" element={<ShopLayout />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
