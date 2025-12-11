import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, Droplets, Star } from 'lucide-react';
import { Listing } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  listing: Listing;
}

const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  // **התיקון הקריטי:** אם המודעה לא קיימת, אל תמשיך לרנדר
  if (!listing || !listing.id) {
    return null; 
  }

  const { t, language } = useLanguage();

  return (
    <Link to={`/listing/${listing.id}`} className="group bg-charcoal-900 rounded-2xl border border-gold-900/20 shadow-lg hover:shadow-gold-900/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Status Badge */}
        <div className={`absolute top-4 bg-gold-400/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-gold-900 shadow-md flex items-center gap-1.5 ${language === 'he' ? 'left-4' : 'right-4'}`}>
          <ShieldCheck size={14} />
          {t.listing.verified}
        </div>

        {/* ABV & Price (Bottom Overlay) */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className='flex items-center justify-between'>
             <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs">
               <Droplets size={12} />
               <span>{listing.abv}% ABV</span>
             </div>
             <span className="text-2xl font-bold">{t.listing.currency}{listing.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-wine-400 tracking-wider uppercase">
            {t.filters.categories[listing.category] || listing.category}
          </span>
          <div className="flex items-center gap-2">
             {listing.sellerVerified && <ShieldCheck size={14} className="text-green-400" title="Verified Seller" />}
             {listing.sellerRating && listing.sellerRating > 0 && (
               <div className="flex items-center gap-1 text-xs font-medium text-gold-400">
                 <Star size={12} className="fill-gold-400" />
                 <span>{listing.sellerRating.toFixed(1)}</span>
               </div>
            )}
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-gray-100 mb-2 line-clamp-2 leading-tight group-hover:text-gold-300 transition-colors">
          {listing.title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-charcoal-800 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-charcoal-950 transition-colors duration-300 text-gold-400 font-bold">
             <span>{language === 'he' ? '←' : '→'}</span>
            </div>
        </div>
       {/* אם היית קורא ל-description כאן, זה היה המקום שבו זה היה קורס: {listing.description} */}
      </div>
    </Link>
  );
};

export default ProductCard;