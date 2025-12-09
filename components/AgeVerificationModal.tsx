import React, { useState, useEffect } from 'react';
import { Wine } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AgeVerificationModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (!verified) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('age_verified', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-sm p-4">
      <div className="bg-charcoal-900 rounded-3xl shadow-2xl shadow-black/50 max-w-md w-full p-8 text-center animate-fade-in-up border border-gold-900/20">
        <div className="bg-wine-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-wine-900/40 border border-wine-700">
          <Wine className="h-8 w-8 text-gold-300" />
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-gray-100 mb-3">
          {t.ageVerification.title}
        </h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {t.ageVerification.subtitle}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-gold-500 text-charcoal-950 font-bold py-3.5 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-900/20 transform hover:-translate-y-0.5"
          >
            {t.ageVerification.confirm}
          </button>
          
          <button
            onClick={handleExit}
            className="w-full bg-charcoal-800 text-gray-300 font-bold py-3.5 rounded-xl hover:bg-charcoal-700 transition-colors"
          >
            {t.ageVerification.exit}
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          {t.ageVerification.disclaimer}
        </p>
      </div>
    </div>
  );
};
