import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Phone, MapPin, Star, Award, Eye, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Listing, Review, SubmitReviewRequest } from '../types';
import { Api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';


// --- רכיב עזר: כוכבים לדירוג ---
const RatingStars: React.FC<{ rating: number, totalReviews?: number }> = ({ rating, totalReviews }) => {
    const { t } = useLanguage();
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={16} 
                    className={
                        i < fullStars ? "fill-gold-400 text-gold-400" :
                        i === fullStars && hasHalfStar ? "fill-gold-400 text-gold-400 opacity-50" :
                        "text-gray-500 fill-transparent"
                    } 
                />
            ))}
            <span className="text-sm font-semibold text-gray-300 ml-1">
                {rating.toFixed(1)}
            </span>
            {totalReviews !== undefined && (
                <span className="text-sm text-gray-500">
                    ({totalReviews} {t.detail.reviewsCount || 'Reviews'})
                </span>
            )}
        </div>
    );
};


// --- רכיב עזר: טופס דירוג וביקורת ---
const ReviewForm: React.FC<{ listing: Listing, onReviewSubmitted: (review: Review) => void }> = ({ listing, onReviewSubmitted }) => {
    const { user } = useAuth();
    const { t, dir } = useLanguage();
    const { showToast } = useToast();
    
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || isSubmitting) return;

        setIsSubmitting(true);
        const reviewData: SubmitReviewRequest = {
            listingId: listing.id,
            sellerId: listing.sellerId,
            rating,
            comment,
        };

        try {
            const newReview = await Api.addReview(reviewData);
            showToast(t.detail.reviewSuccess, 'success');
            
            // עדכן את רשימת הביקורות בדף המוצר הראשי
            onReviewSubmitted(newReview);
            
            // איפוס הטופס
            setRating(5);
            setComment('');

        } catch (error) {
            console.error('Failed to submit review:', error);
            showToast(t.detail.reviewError, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // אם המשתמש הוא המוכר עצמו, או שאינו מחובר - אין טופס
    if (!user || user.id === listing.sellerId) {
        return <div className="text-gray-500 mt-6">{!user ? t.create.loginRequired : t.detail.sellerCannotReview}</div>;
    }

    return (
        <div className="mt-8 pt-6 border-t border-gold-900/20">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">{t.detail.reviewFormTitle}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* שדה דירוג כוכבים */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t.detail.rateLabel}</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <Star
                                key={starValue}
                                size={24}
                                className={`cursor-pointer transition-colors ${
                                    rating >= starValue ? "fill-gold-500 text-gold-500" : "fill-transparent text-gray-600 hover:text-gold-500"
                                }`}
                                onClick={() => setRating(starValue)}
                            />
                        ))}
                    </div>
                </div>

                {/* שדה תגובה */}
                <div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t.detail.reviewPlaceholder}
                        rows={3}
                        required
                        className="w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white placeholder-gray-500 focus:ring-gold-500 focus:border-gold-500"
                        style={{ direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
                    />
                </div>

                {/* כפתור שליחה */}
                <button
                    type="submit"
                    disabled={isSubmitting || !comment}
                    className="flex items-center gap-2 bg-gold-500 text-charcoal-950 px-6 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
                    {t.detail.submitReview}
                </button>
            </form>
        </div>
    );
};

// --- רכיב עזר: רשימת ביקורות ---
const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    const { t, language } = useLanguage();

    if (reviews.length === 0) {
        return <p className="text-gray-500 italic mt-4">{t.detail.noReviews}</p>;
    }
    
    return (
        <div className="space-y-6 mt-6">
            {reviews.map(review => (
                <div key={review.id} className="p-4 bg-charcoal-800 rounded-lg border border-gold-900/10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center text-charcoal-950 font-semibold text-sm">
                                {review.reviewerName[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-100">{review.reviewerName}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString(language)}
                                </p>
                            </div>
                        </div>
                        <RatingStars rating={review.rating} />
                    </div>
                    <p className="text-gray-300 leading-relaxed mt-2">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};


// --- רכיב ראשי: ProductDetail ---

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // פונקציה לטיפול בעדכון הביקורות
  const handleReviewSubmitted = useCallback((newReview: Review) => {
    // הוספת הביקורת החדשה לרשימה והצגה מיידית
    setReviews(prev => [newReview, ...prev]); 
    
    // חישוב מחדש של הממוצע
    const allReviews = [newReview, ...reviews];
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    setAverageRating(totalRating / allReviews.length);
  }, [reviews]);
  
  // טעינת נתוני המוצר, צפיות וביקורות
  useEffect(() => {
    if (id) {
      setLoading(true); 
      
      const loadData = async () => {
          try {
              // 1. טען ליסטינג (ומנה צפיות בשרת)
              const listingData = await Api.getListingById(id);
              if (listingData) {
                  setListing(listingData);
                  
                  // 2. טען ביקורות למוכר
                  const sellerReviews = await Api.getReviewsBySeller(listingData.sellerId);
                  setReviews(sellerReviews);
                  
                  // 3. חשב דירוג ממוצע
                  if (sellerReviews.length > 0) {
                      const totalRating = sellerReviews.reduce((sum, r) => sum + r.rating, 0);
                      setAverageRating(totalRating / sellerReviews.length);
                  } else {
                      setAverageRating(0);
                  }
              }
          } catch (err) {
              console.error(err);
              setListing(null); // הצג "לא נמצא" במקרה של שגיאה
          } finally {
              setLoading(false);
          }
      };
      
      loadData();
    }
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!listing) return (
    <div className="h-screen flex items-center justify-center text-center p-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-300">Listing Not Found</h2>
            <p className="text-gray-500">The requested item could not be found.</p>
            <Link to="/" className="mt-4 inline-block bg-gold-500 text-charcoal-950 px-6 py-2 rounded-full font-bold">
                Back to Market
            </Link>
        </div>
    </div>
  );

  const whatsappLink = `https://wa.me/${listing.sellerPhone}?text=${encodeURIComponent(`Hi, I'm interested in your listing: ${listing.title} on SpiritMarket.`)}`;

  return (
    <div className="bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Image */}
                <div className="space-y-4 sticky top-24 self-start">
                    <div className="aspect-[3/4] bg-charcoal-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 relative border border-gold-900/20">
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                        
                        {listing.isKosher && (
                          <div className={`absolute top-4 bg-blue-600/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg ${language === 'he' ? 'left-auto right-4' : 'left-4'}`}>
                            <Award size={16} /> {t.detail.kosher}
                          </div>
                        )}
                        
                        {/* חדש: מונה צפיות */}
                        <div className={`absolute bottom-4 ${language === 'he' ? 'left-4' : 'right-4'} bg-black/50 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg`}>
                            <Eye size={16} /> {listing.viewCount} {t.detail.viewCount}
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gold-400 font-bold uppercase tracking-wider text-sm">{t.filters.categories[listing.category] || listing.category}</span>
                            <span className="text-gray-500 text-sm">{new Date(listing.createdAt).toLocaleDateString(language)}</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-gray-100 mb-2">{listing.title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 font-medium mb-4">
                            <span>{listing.brand}</span>
                            <span>•</span>
                            <span>{listing.vintage}</span>
                        </div>
                         <div className="flex items-center gap-2 text-gray-400">
                           <MapPin size={18} />
                           <span>{listing.location}</span>
                         </div>
                    </div>

                    <div className="border-t border-b border-gold-900/20 py-6 space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-gray-100">{t.listing.currency}{listing.price.toLocaleString()}</span>
                            {language === 'en' && <span className="text-gray-500">USD</span>}
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {listing.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           {[
                             { label: t.detail.volume, value: `${listing.volumeMl}ml` },
                             { label: t.detail.abv, value: `${listing.abv}%` },
                             { label: t.detail.brand, value: listing.brand },
                             { label: t.detail.vintage, value: listing.vintage }
                           ].map(item => (
                             <div key={item.label} className="bg-charcoal-900 p-4 rounded-xl border border-gold-900/20">
                               <span className="block text-xs text-gray-400 uppercase tracking-wide">{item.label}</span>
                               <span className="font-semibold text-gray-100">{item.value}</span>
                             </div>
                           ))}
                        </div>
                    </div>

                    <div className="bg-charcoal-900 p-6 rounded-2xl border border-gold-900/20 space-y-4">
                        <h3 className="font-semibold text-gray-100">{t.detail.sellerInfo}</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gold-200 rounded-full flex items-center justify-center text-gold-900 font-bold text-2xl border-2 border-gold-400">
                                {listing.sellerName[0]}
                            </div>
                            <div>
                                <p className="font-medium text-gray-100 text-lg">{listing.sellerName}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  {listing.sellerVerified && (
                                      <span className="flex items-center gap-1 font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                                          <ShieldCheck size={14} />
                                          {t.detail.verifiedSeller}
                                      </span>
                                  )}
                                  
                                  {/* הצגת דירוג המוכר הממוצע */}
                                  {averageRating > 0 && <RatingStars rating={averageRating} totalReviews={reviews.length} />}
                                  {averageRating === 0 && <span className="text-gray-500 text-sm">{t.detail.noReviewsYet || 'No ratings yet'}</span>}
                                </div>
                            </div>
                        </div>
                         {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shadow-lg shadow-green-900/30"
                            >
                            <MessageCircle size={20} />
                            {t.detail.whatsapp}
                            </a>
                            <a 
                            href={`tel:${listing.sellerPhone}`}
                            className="flex-1 bg-gold-500 hover:bg-gold-400 text-charcoal-950 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shadow-lg shadow-gold-900/30"
                            >
                            <Phone size={20} />
                            {t.detail.call}
                            </a>
                        </div>
                    </div>

                    <div className="bg-charcoal-900 p-4 rounded-lg flex gap-3 text-sm text-gray-400 border border-gold-900/10">
                        <ShieldCheck size={24} className="flex-shrink-0 text-gold-500" />
                        <p>{t.detail.safety}</p>
                    </div>
                </div>
                
                {/* ---------- סעיף ביקורות ודירוג חדש ---------- */}
                <div className="lg:col-span-2 pt-12">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MessageSquare size={24} className="text-gold-500" />
                        {t.detail.reviews}
                    </h2>
                    
                    {/* טופס הוספת ביקורת (אם המשתמש מחובר ואינו המוכר) */}
                    <ReviewForm listing={listing} onReviewSubmitted={handleReviewSubmitted} />
                    
                    {/* רשימת הביקורות */}
                    <ReviewList reviews={reviews} />
                </div>
                {/* ------------------------------------------- */}

            </div>
        </div>
    </div>
  );
};

export default ProductDetail;