import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, Phone, MapPin, Star, Award, Droplets } from 'lucide-react';
import { Listing } from '../types';
import { Api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (id) {
      setLoading(true); // Reset loading state on ID change
      Api.getListingById(id).then(data => {
        setListing(data || null);
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        setLoading(false);
      });
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
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gold-400 font-bold uppercase tracking-wider text-sm">{t.filters.categories[listing.category] || listing.category}</span>
                            <span className="text-gray-500 text-sm">{new Date(listing.createdAt).toLocaleDateString()}</span>
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
                                  <div className="flex items-center gap-1 text-gold-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < (listing.sellerRating || 0) ? "fill-gold-400" : "fill-transparent"} />)}
                                  </div>
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
            </div>
        </div>
    </div>
  );
};

export default ProductDetail;