import React from 'react';
// שינוי 1: שימוש ב-BrowserRouter במקום HashRouter
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Components
import Layout from './components/Layout';
import { AgeVerificationModal } from './components/AgeVerificationModal';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';

// ------------------------------------------------------------------
// רכיב עזר להגנה על נתיבים (ProtectedRoute)
// ------------------------------------------------------------------
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ------------------------------------------------------------------
// האפליקציה הראשית
// ------------------------------------------------------------------
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageProvider>
          <AgeVerificationModal />
          <Router>
            {/* שינוי 2: ה-Layout עוטף את ה-Routes מבחוץ כדי שה-children יעברו נכון */}
            <Layout>
              <Routes>
                {/* נתיבים פתוחים */}
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* נתיבים מוגנים */}
                <Route 
                  path="/create" 
                  element={
                    <ProtectedRoute>
                      <CreateListing />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-listings" 
                  element={
                    <ProtectedRoute>
                      <MyListings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-listing/:id" 
                  element={
                    <ProtectedRoute>
                      <EditListing />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;