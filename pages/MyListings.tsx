import React, { useState, useEffect, useCallback } from 'react'; // **התיקון כאן**
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, X, AlertTriangle, Loader2, PlusCircle, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Api } from '../services/api';
import { Listing, ListingStatus } from '../types';

// רכיב עזר להצגת סטטוס המודעה
const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-500';
  let text = '';

  switch (status) {
    case ListingStatus.APPROVED:
      colorClass = 'bg-green-600';
      text = 't.listing.status.approved';
      break;
    case ListingStatus.PENDING:
      colorClass = 'bg-blue-600';
      text = 't.listing.status.pending';
      break;
    case ListingStatus.NEEDS_REVIEW:
      colorClass = 'bg-yellow-600';
      text = 't.listing.status.needsReview';
      break;
    case ListingStatus.REJECTED:
      colorClass = 'bg-red-600';
      text = 't.listing.status.rejected';
      break;
    case ListingStatus.SOLD:
      colorClass = 'bg-purple-600';
      text = 't.listing.status.sold';
      break;
    default:
      text = 'N/A';
  }
  
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass}`}>
      {t.myListings.status?.[status.toLowerCase()] || text} 
    </span>
  );
};


const MyListings: React.FC = () => {
  const { user } = useAuth();
  const { t, dir, language } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // פונקציה לשליפת הליסטינגים של המשתמש
  const fetchMyListings = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const data = await Api.getMyListings();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch user listings:", error);
      showToast(t.myListings.fetchError || 'Failed to load your listings.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast, t]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  // פונקציה למחיקת ליסטינג
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await Api.deleteListing(deletingId);
      showToast(t.myListings.deleteSuccess, 'success');
      
      // עדכן את הרשימה לאחר המחיקה
      setListings(prev => prev.filter(l => l.id !== deletingId));
      
    } catch (error) {
      console.error("Deletion failed:", error);
      showToast(t.myListings.deleteError, 'error');
    } finally {
      setDeletingId(null); // סגור את המודאל
    }
  };
  
  // אם המשתמש אינו מוכר (או לא מחובר, מטופל ב-ProtectedRoute אבל נחמד לבדוק)
  if (!user || !user.isSeller) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-gray-400">
        {t.myListings.notSeller || 'You must be logged in as a seller to view this page.'}
      </div>
    );
  }

  // מצב טעינה
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        <span className="text-gray-400 ml-3">{t.create.analyzing || 'Loading listings...'}</span>
      </div>
    );
  }

  // אין מודעות
  if (listings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{t.myListings.title}</h1>
        <p className="text-gray-400 mb-6">{t.myListings.noListings}</p>
        <Link 
          to="/create" 
          className="bg-gold-500 text-charcoal-950 px-6 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors"
        >
          <PlusCircle size={18} className="inline mr-2" />
          {t.nav.sell}
        </Link>
      </div>
    );
  }

  // הצגת רשימת המודעות
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* כותרת */}
      <div className={`pb-6 mb-8 border-b border-gold-900/50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-white">{t.myListings.title}</h1>
        <p className="mt-2 text-gray-400">{t.myListings.subtitle}</p>
      </div>

      <div className="space-y-6">
        {listings.map((listing) => (
          <div 
            key={listing.id} 
            className="flex flex-col md:flex-row bg-charcoal-900 rounded-xl shadow-2xl border border-gold-900/30 overflow-hidden transition-all hover:border-gold-500/50"
          >
            {/* תמונה */}
            <div className="w-full md:w-1/4 h-40 md:h-auto overflow-hidden">
              <img 
                src={listing.imageUrl} 
                alt={listing.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* פרטים ופעולות */}
            <div className="flex-grow p-4 md:p-6 flex flex-col justify-between">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <Link to={`/listing/${listing.id}`} className="text-xl font-semibold text-white hover:text-gold-500 transition-colors">
                  {listing.title}
                </Link>
                <div className="mt-2 md:mt-0">
                  <StatusBadge status={listing.status} />
                </div>
              </div>
              
              <p className="text-lg font-bold text-gold-400 mb-4">{listing.price} {t.listing.currency}</p>

              <div className="flex items-center text-sm text-gray-400 space-x-4">
                <span dir="ltr" className="flex items-center">
                  <Eye size={16} className="text-gray-500 mr-1" /> 
                  {listing.viewCount} {t.detail.viewCount}
                </span>
                <span>{new Date(listing.createdAt).toLocaleDateString(language)}</span>
              </div>

              {/* כפתורי פעולה */}
              <div className="mt-4 flex space-x-3">
                {/* כפתור עריכה */}
                <Link 
                  to={`/edit-listing/${listing.id}`}
                  className="flex items-center gap-2 bg-charcoal-700 text-gray-200 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gold-600 hover:text-charcoal-950 transition-colors"
                >
                  <Edit size={16} />
                  {t.myListings.edit}
                </Link>
                
                {/* כפתור מחיקה */}
                <button
                  onClick={() => setDeletingId(listing.id)}
                  className="flex items-center gap-2 bg-red-800/70 text-red-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                  {t.myListings.delete}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* מודאל אישור מחיקה */}
      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]">
          <div className="bg-charcoal-900 p-8 rounded-xl max-w-sm w-full shadow-2xl border border-red-800/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-500 flex items-center">
                <AlertTriangle size={24} className="mr-2" />
                {t.myListings.confirmDeleteTitle}
              </h3>
              <button onClick={() => setDeletingId(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">{t.myListings.confirmDeleteText}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-300 bg-charcoal-700 rounded-full hover:bg-charcoal-600 transition-colors"
              >
                {t.filters.clear || 'Cancel'}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-700 rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                {t.myListings.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;