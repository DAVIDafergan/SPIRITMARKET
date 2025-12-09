import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wine, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      addToast(t.auth.loginTitle + ' ' + t.nav.welcome, 'success');
      navigate('/');
    } catch (err: any) {
      addToast(err.message || t.auth.error, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-900/30 rounded-full blur-[128px] opacity-40"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-wine-900/40 rounded-full blur-[96px] opacity-40"></div>
        
        <div className="relative z-10 max-w-md w-full space-y-8 bg-charcoal-900/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-black/40 border border-gold-900/20">
            <div className="text-center">
            <div className="bg-wine-800 p-4 rounded-2xl inline-block mb-6 shadow-lg shadow-wine-900/30 border border-wine-700">
                <Wine className="h-8 w-8 text-gold-300" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-100 tracking-tight">
                {t.auth.loginTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-400">Sign in to manage your collection</p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5 ml-1">{t.auth.email}</label>
                <div className="relative group">
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-12 py-3.5 border border-gold-900/20 bg-charcoal-800 text-gray-100 focus:bg-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all sm:text-sm"
                    placeholder="name@example.com"
                    />
                    <Mail className="absolute top-3.5 left-4 text-gray-500 rtl:right-4 rtl:left-auto group-focus-within:text-gold-400 transition-colors" size={20} />
                </div>
                </div>
                <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5 ml-1">{t.auth.password}</label>
                <div className="relative group">
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-12 py-3.5 border border-gold-900/20 bg-charcoal-800 text-gray-100 focus:bg-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                    />
                    <Lock className="absolute top-3.5 left-4 text-gray-500 rtl:right-4 rtl:left-auto group-focus-within:text-gold-400 transition-colors" size={20} />
                </div>
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-charcoal-950 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900 focus:ring-gold-500 disabled:opacity-70 transition-all shadow-lg shadow-gold-900/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                {loading ? <Loader2 className="animate-spin" /> : t.auth.submitLogin}
                </button>
            </div>
            </form>
            
            <div className="text-center text-sm">
            <span className="text-gray-400">{t.auth.noAccount} </span>
            <Link to="/register" className="font-bold text-gold-400 hover:text-gold-300 hover:underline">
                {t.auth.registerLink}
            </Link>
            </div>
        </div>
    </div>
  );
};

export default Login;