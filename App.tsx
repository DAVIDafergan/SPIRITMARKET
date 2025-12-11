import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // ייבוא useAuth
import { ToastProvider } from './contexts/ToastContext';

// ------------------------------------------------------------------
// רכיב עזר להגנה על נתיבים (ProtectedRoute)
// משתמש ב-useAuth כדי לבדוק אם המשתמש מחובר
// ------------------------------------------------------------------
interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user } = useAuth(); // שימוש ב-AuthContext לבדיקת המצב
  
  if (!user) {
    // אם המשתמש לא מחובר, נווט לדף ההתחברות (login)
    // כדאי לשקול להעביר את הנתיב הנוכחי כפרמטר כדי לחזור אליו לאחר ההתחברות
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

// ------------------------------------------------------------------
// ייבוא דפים חדשים
// ------------------------------------------------------------------
import Account from './pages/Account'; // דף דשבורד משתמש
import MyListings from './pages/MyListings'; // דף ניהול ליסטינג
import EditListing from './pages/EditListing'; // דף עריכת ליסטינג

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageProvider>
          <AgeVerificationModal />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ProductDetail />} />
                <Route path="/create" element={<CreateListing />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* ------------------------------------------------- */}
                {/* ----------- נתיבים מוגנים (Private Routes) -------- */}
                {/* ------------------------------------------------- */}
                
                {/* דף דשבורד משתמש - שינוי פרטים אישיים */}
                <Route 
                    path="/account" 
                    element={<ProtectedRoute element={<Account />} />} 
                />

                {/* דף ניהול ליסטינג - עריכה ומחיקה */}
                <Route 
                    path="/my-listings" 
                    element={<ProtectedRoute element={<MyListings />} />} 
                />

                {/* דף עריכת ליסטינג ספציפי */}
                <Route 
                    path="/edit-listing/:id" 
                    element={<ProtectedRoute element={<EditListing />} />} 
                />
                
                {/* ------------------------------------------------- */}

              </Routes>
            </Layout>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;