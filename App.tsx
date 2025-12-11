import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
  children: React.ReactNode; // שינוי: מקבל children במקום element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(); // הוספת isLoading

  // 1. אם אנחנו עדיין בודקים אם המשתמש מחובר, הצג טעינה
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  // 2. אם הבדיקה הסתיימה ואין משתמש, העבר ללוגין
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. אם יש משתמש, הצג את התוכן המוגן
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
            <Routes>
              {/* Layout עוטף את כל הנתיבים באמצעות Outlet */}
              <Route element={<Layout />}>
                
                {/* נתיבים פתוחים */}
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* נתיבים מוגנים (עטופים ב-ProtectedRoute) */}
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

              </Route>
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;