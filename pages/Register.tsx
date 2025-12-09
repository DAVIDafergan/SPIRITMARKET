import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wine, Lock, Mail, User, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isSeller: true
  });
  
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast(t.auth.passMismatch, 'error');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isSeller: formData.isSeller
      });
      addToast(t.auth.successRegister, 'success');
      navigate('/');
    } catch (err: any) {
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-900/30 rounded-full blur-[128px] opacity-40"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-wine-900/40 rounded-full blur-[96px] opacity-40"></div>

        <div className="relative z-10 max-w-lg w-full space-y-8 bg-charcoal-900/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-black/40 border border-gold-900/20">
            <div className="text-center">
            <div className="bg-wine-800 p-4 rounded-2xl inline-block mb-6 shadow-lg shadow-wine-900/30 border border-wine-700">
                <Wine className="h-8 w-8 text-gold-300" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-100 tracking-tight">
                {t.auth.registerTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-400">Join the exclusive community</p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'name', type: 'text', label: t.auth.name, icon: User, colSpan: 'md:col-span-2' },
                  { name: 'email', type: 'email', label: t.auth.email, icon: Mail, colSpan: 'md:col-span-2' },
                  { name: 'phone', type: 'tel', label: t.auth.phone, icon: Phone, colSpan: 'md:col-span-2' },
                  { name: 'password', type: 'password', label: t.auth.password, icon: Lock },
                  { name: 'confirmPassword', type: 'password', label: t.auth.confirmPassword, icon: Lock },
                ].map(field => (
                  <div key={field.name} className={field.colSpan || ''}>
                    <label className="block text-sm font-semibold text-gray-400 mb-1 ml-1">{field.label}</label>
                    <div className="relative group">
                    <input
                        name={field.name}
                        type={field.type}
                        required
                        value={formData[field.name as keyof typeof formData] as string}
                        onChange={handleChange}
                        className="appearance-none rounded-xl relative block w-full px-12 py-3.5 border border-gold-900/20 bg-charcoal-800 text-gray-100 focus:bg-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all sm:text-sm"
                    />
                    <field.icon className="absolute top-3.5 left-4 text-gray-500 rtl:right-4 rtl:left-auto group-focus-within:text-gold-400" size={20} />
                    </div>
                  </div>
                ))}
            </div>

            <label className="flex items-center gap-3 py-3 px-4 bg-charcoal-800 rounded-xl border border-gold-900/20 cursor-pointer hover:bg-charcoal-700 transition-colors">
                <input 
                    type="checkbox" 
                    name="isSeller" 
                    checked={formData.isSeller} 
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gold-900/50 bg-charcoal-900 text-gold-500 focus:ring-gold-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-300 cursor-pointer select-none">{t.auth.sellerToggle}</span>
            </label>

            <div>
                <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-charcoal-950 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900 focus:ring-gold-500 disabled:opacity-70 transition-all shadow-lg shadow-gold-900/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                {loading ? <Loader2 className="animate-spin" /> : t.auth.submitRegister}
                </button>
            </div>
            </form>
            
            <div className="text-center text-sm">
            <span className="text-gray-400">{t.auth.hasAccount} </span>
            <Link to="/login" className="font-bold text-gold-400 hover:text-gold-300 hover:underline">
                {t.auth.loginLink}
            </Link>
            </div>
        </div>
    </div>
  );
};

export default Register;