import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Edit, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Api } from '../services/api';
import { UpdateUserRequest } from '../types';

const Account: React.FC = () => {
  const { user, login } = useAuth();
  const { t, dir } = useLanguage();
  const { showToast } = useToast();
  
  // מצב עבור טופס העדכון
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // מאפשר עריכה רק בלחיצת כפתור

  useEffect(() => {
    // עדכון המצב כאשר פרטי המשתמש נטענים או משתנים
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  // בדיקה אם המשתמש מחובר - אמור להיות מטופל כבר ב-ProtectedRoute
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-gray-400">
        {t.create.loginRequired}
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // בדיקות ולידציה בסיסיות
    if (!name || !phone) {
        showToast(t.auth.updateError, 'error');
        setIsLoading(false);
        return;
    }

    const updateData: UpdateUserRequest = { name, phone };

    try {
      // קריאה למתודת ה-API החדשה
      const updatedUser = await Api.updateCurrentUser(updateData);
      
      // עדכון ה-Context של האותנטיקציה עם המשתמש המעודכן
      // (כדי לשמור על עקביות בכל האפליקציה)
      login(updatedUser); 
      
      showToast(t.auth.updateSuccess, 'success');
      setIsEditing(false); // סגור מצב עריכה לאחר הצלחה

    } catch (error) {
      console.error("Profile update failed:", error);
      showToast(t.auth.updateError, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // סגנון RTL/LTR
  const textDirectionClass = dir === 'rtl' ? 'text-right' : 'text-left';
  const marginClass = dir === 'rtl' ? 'ml-2' : 'mr-2';


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* כותרת הדף */}
      <div className={`pb-6 mb-8 border-b border-gold-900/50 ${textDirectionClass}`}>
        <h1 className="text-3xl font-bold text-white">{t.account.title}</h1>
        <p className="mt-2 text-gray-400">{t.account.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* עמודה 1: ניווט מהיר לדשבורד */}
        <div className="lg:col-span-1 space-y-4">
            
            {/* ניהול המודעות שלי */}
            <Link 
              to="/my-listings"
              className="group flex items-center justify-between p-4 bg-charcoal-800 rounded-lg shadow-xl hover:bg-charcoal-700 transition-colors"
            >
              <div className="flex items-center">
                <Edit size={20} className={`text-gold-500 ${marginClass}`} />
                <span className="font-semibold text-gray-200">{t.account.manageListings}</span>
              </div>
              <ArrowRight size={20} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* רשימת מועדפים (פיצ'ר עתידי) */}
            <div className="flex items-center justify-between p-4 bg-charcoal-800 rounded-lg shadow-md opacity-60 cursor-not-allowed">
              <div className="flex items-center">
                <User size={20} className={`text-gray-500 ${marginClass}`} />
                <span className="font-semibold text-gray-500">{t.account.wishlist}</span>
              </div>
              <ArrowRight size={20} className="text-gray-500" />
            </div>

        </div>

        {/* עמודה 2: עדכון פרטים אישיים */}
        <div className="lg:col-span-2 bg-charcoal-900 p-8 rounded-xl shadow-2xl border border-gold-900/30">
          <h2 className={`text-2xl font-semibold text-gold-400 mb-6 ${textDirectionClass}`}>{t.account.myDetails}</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {/* שדה שם מלא */}
            <div>
              <label 
                htmlFor="name" 
                className={`block text-sm font-medium text-gray-300 mb-2 ${textDirectionClass}`}
              >
                {t.auth.name}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={!isEditing || isLoading}
                className="w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white placeholder-gray-500 focus:ring-gold-500 focus:border-gold-500 disabled:opacity-75"
                style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
              />
            </div>

            {/* שדה אימייל (מוצג כ-Disabled) */}
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium text-gray-300 mb-2 ${textDirectionClass}`}
              >
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-gray-500 disabled:opacity-100"
                style={{ direction: 'ltr' }}
              />
            </div>
            
            {/* שדה טלפון */}
            <div>
              <label 
                htmlFor="phone" 
                className={`block text-sm font-medium text-gray-300 mb-2 ${textDirectionClass}`}
              >
                {t.auth.phone}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={!isEditing || isLoading}
                className="w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white placeholder-gray-500 focus:ring-gold-500 focus:border-gold-500 disabled:opacity-75"
                style={{ direction: 'ltr' }}
              />
            </div>

            <div className="flex justify-end pt-4">
              
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gold-600 text-charcoal-950 px-6 py-3 rounded-full font-bold hover:bg-gold-500 transition-colors shadow-lg"
                >
                  <Edit size={18} />
                  {t.account.updateBtn}
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setName(user.name); setPhone(user.phone); }}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-600 transition-colors shadow-lg mr-4"
                  >
                    {t.filters.clear}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gold-500 text-charcoal-950 px-6 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t.create.analyzing : t.account.updateBtn}
                  </button>
                </>
              )}

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;