import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wine, PlusCircle, User as UserIcon, Menu, X, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path ? "text-gold-400 font-semibold" : "text-gray-300 hover:text-gold-400";

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal-900/70 backdrop-blur-lg border-b border-gold-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-wine-800 p-2.5 rounded-lg border border-wine-700">
                <Wine className="h-6 w-6 text-gold-300" />
              </div>
              <span className="font-serif text-2xl font-bold text-gray-100 tracking-tight">SpiritMarket</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={isActive('/')}>{t.nav.market}</Link>
              {user?.isAdmin && (
                <Link to="/admin" className={isActive('/admin')}>{t.nav.moderation}</Link>
              )}
              <Link to="/create" className="flex items-center gap-2 bg-gold-500 text-charcoal-950 px-5 py-2.5 rounded-full hover:bg-gold-400 transition-all shadow-lg shadow-gold-900/20 font-bold transform hover:scale-105">
                <PlusCircle size={18} />
                <span>{t.nav.sell}</span>
              </Link>
              
              <div className="h-6 w-px bg-gold-900/30 mx-2"></div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleLanguage}
                  className="p-2 rounded-full hover:bg-charcoal-800 text-gray-400 flex items-center gap-1.5 font-medium text-sm transition-colors"
                >
                  <Globe size={18} />
                  <span className='font-bold'>{language === 'en' ? 'עב' : 'EN'}</span>
                </button>

                {user ? (
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title={t.nav.logout}
                      >
                        <LogOut size={20} />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gold-200 text-gold-900 flex items-center justify-center font-bold text-lg border-2 border-gold-400">
                        {user.name[0].toUpperCase()}
                      </div>
                   </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-gold-400">
                      {t.nav.login}
                    </Link>
                    <Link to="/register" className="text-sm font-medium bg-charcoal-800 px-4 py-2 rounded-full hover:bg-charcoal-700 transition-colors">
                      {t.nav.register}
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleLanguage} className="p-2">
                 <span className="font-bold text-sm text-gray-300">{language === 'en' ? 'HE' : 'EN'}</span>
              </button>
              <button className="p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-charcoal-900 border-b border-gold-900/20 p-4 space-y-4">
            {user && (
              <div className="pb-4 border-b border-charcoal-800 flex items-center justify-between">
                 <span className="font-semibold text-gray-200">{t.nav.welcome}, {user.name}</span>
                 <button onClick={() => {logout(); setIsMenuOpen(false);}} className="text-sm text-red-500">{t.nav.logout}</button>
              </div>
            )}
            
            <Link to="/" className="block py-2 text-gray-300" onClick={() => setIsMenuOpen(false)}>{t.nav.market}</Link>
            
            {user?.isAdmin && (
               <Link to="/admin" className="block py-2 text-gray-300" onClick={() => setIsMenuOpen(false)}>{t.nav.moderation}</Link>
            )}
            
            <Link to="/create" className="flex w-full items-center justify-center gap-2 bg-gold-500 text-charcoal-950 px-4 py-3 rounded-lg font-bold" onClick={() => setIsMenuOpen(false)}>
              <PlusCircle size={18} />
              <span>{t.nav.sell}</span>
            </Link>

            {!user && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal-800">
                <Link to="/login" className="text-center py-2 text-gray-300 border border-charcoal-700 rounded-lg" onClick={() => setIsMenuOpen(false)}>{t.nav.login}</Link>
                <Link to="/register" className="text-center py-2 bg-gold-500 text-charcoal-950 rounded-lg font-bold" onClick={() => setIsMenuOpen(false)}>{t.nav.register}</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-950 text-gray-400 py-12 border-t border-gold-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wine className="h-6 w-6 text-gold-500" />
              <span className="font-serif text-xl font-bold text-white">SpiritMarket</span>
            </div>
            <p className="text-sm text-gray-500">
              The safest marketplace for buying and selling rare spirits and fine wines. Powered by advanced AI authentication.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gold-400 mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-300">All Listings</a></li>
              <li><a href="#" className="hover:text-gold-300">Rare Finds</a></li>
              <li><a href="#" className="hover:text-gold-300">Sellers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gold-400 mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold-300">Age Verification</a></li>
            </ul>
          </div>

          <div>
             <h3 className="font-semibold text-gold-400 mb-4">Contact</h3>
             <p className="text-sm">Tel Aviv, Israel</p>
             <p className="text-sm">support@spiritmarket.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gold-900/20 text-center text-xs text-gray-500">
          © 2024 SpiritMarket. Alcohol consumption is 18+. Drink responsibly.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
