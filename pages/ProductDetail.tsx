import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, Share2, ArrowLeft, Droplets, Star, User, Phone, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Listing } from '../types';
import { Api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // מצבי דירוג
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        // קריאה כפולה: קודם סופרים צפייה, ואז מקבלים את המידע העדכני
        const data = await Api.getListingByIdAndCountView(id);
        setListing(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listing) return;

    setIsSubmittingReview(true);
    try {
      await Api.addReview({
        listingId: listing.id,
        sellerId: listing.sellerId,
        rating,
        comment
      });
      showToast('Review submitted successfully!', 'success');
      setComment('');
      // רענון הנתונים כדי לראות את הדירוג החדש אם צריך
    } catch (error) {
      console.error(error);
      showToast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 1. הגנה מפני קריסה בזמן טעינה
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      </div>
    );
  }

  // 2. הגנה מפני שגיאה או מוצר לא קיים
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.error || 'Error'}</h2>
        <p className="text-gray-400 mb-6">{error || 'Listing not found.'}</p>
        <Link to="/" className="text-gold-400 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  // כאן בטוח להשתמש ב-listing כי עברנו את כל הבדיקות
  return (
    <div className="min-h-screen bg-charcoal-950 pb-20 pt-20">
      {/* כפתור חזרה */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
          <span>{t.detail.back}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* תמונת המוצר */}
        <div className="space-y-6">
          <div className="relative aspect-[4/5] bg-charcoal-900 rounded-2xl overflow-hidden border border-gold-900/20 shadow-2xl">
            <img 
              src={listing.imageUrl || '/placeholder-bottle.jpg'} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
            {listing.isKosher && (
               <div className="absolute top-4 right-4 bg-charcoal-950/80 backdrop-blur text-gold-400 px-3 py-1 rounded-full text-xs font-bold border border-gold-500/30">
                 KOSHER
               </div>
            )}
          </div>
        </div>

        {/* פרטי המוצר */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-gold-500 text-sm font-bold tracking-wider uppercase mb-2">
              <span>{t.filters.categories[listing.category] || listing.category}</span>
              {listing.vintage && <span>• {listing.vintage}</span>}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">{listing.title}</h1>
            
            <div className="flex items-center justify-between pb-6 border-b border-gold-900/20">
               <div className="flex items-end gap-2">
                 <span className="text-4xl font-bold text-gold-400">{listing.price.toLocaleString()}</span>
                 <span className="text-xl text-gold-600 mb-1">{t.listing.currency}</span>
               </div>
               
               {/* מונה צפיות */}
               <div className="flex items-center gap-2 text-gray-500 bg-charcoal-900 px-3 py-1 rounded-full text-sm">
                 <Loader2 size={14} className={loading ? "animate-spin" : "hidden"} /> 
                 <span>{listing.viewCount || 0} views</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-charcoal-900/50 p-4 rounded-xl border border-gold-900/10">
               <div className="flex items-center gap-2 text-gray-400 mb-1 text-sm"><MapPin size={16}/> {t.create.form.location}</div>
               <div className="text-white font-medium">{listing.location || 'N/A'}</div>
             </div>
             <div className="bg-charcoal-900/50 p-4 rounded-xl border border-gold-900/10">
               <div className="flex items-center gap-2 text-gray-400 mb-1 text-sm"><Droplets size={16}/> ABV / Volume</div>
               <div className="text-white font-medium">{listing.abv}% / {listing.volumeMl}ml</div>
             </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">{t.create.form.desc}</h3>
            {/* כאן הייתה הבעיה! עכשיו זה בטוח כי בדקנו ש-listing קיים */}
            <p className="text-gray-300 leading-relaxed text-lg">{listing.description}</p>
          </div>

          {/* כרטיס מוכר ודירוג - כאן תבוא הלוגיקה החדשה של דירוגים */}
          <div className="bg-charcoal-900 rounded-2xl p-6 border border-gold-900/20">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <User className="text-gold-500" /> Seller Info
             </h3>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-200">{listing.sellerName}</p>
                  <div className="flex items-center gap-1 text-gold-400 text-sm">
                    <Star size={14} fill="currentColor" />
                    <span>{listing.sellerRating ? listing.sellerRating.toFixed(1) : 'New Seller'}</span>
                  </div>
                </div>
                {user ? (
                   <div className="text-right">
                     <p className="text-gray-400 text-sm mb-1">Contact:</p>
                     <p className="text-white font-mono bg-black/30 px-3 py-1 rounded">{listing.sellerPhone}</p>
                   </div>
                ) : (
                  <Link to="/login" className="text-gold-500 text-sm hover:underline">Log in to view contact</Link>
                )}
             </div>

             {/* טופס הוספת ביקורת (רק אם מחובר ולא המוכר) */}
             {user && user.id !== listing.sellerId && (
               <div className="mt-6 pt-6 border-t border-charcoal-800">
                 <h4 className="text-sm font-bold text-gray-400 mb-3">Rate this seller</h4>
                 <form onSubmit={handleReviewSubmit} className="space-y-3">
                   <div className="flex gap-2 mb-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => setRating(star)}
                         className={`transition-colors ${star <= rating ? 'text-gold-400' : 'text-gray-700'}`}
                       >
                         <Star fill={star <= rating ? "currentColor" : "none"} />
                       </button>
                     ))}
                   </div>
                   <textarea
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     placeholder="Write a review..."
                     className="w-full bg-charcoal-950 border border-charcoal-800 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                     rows={2}
                   />
                   <button 
                     type="submit" 
                     disabled={isSubmittingReview}
                     className="bg-gold-600 text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gold-500 disabled:opacity-50"
                   >
                     {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                   </button>
                 </form>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;