import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2, ChevronDown, ChevronUp, Star, ArrowUpDown } from 'lucide-react';
import { Listing, Category, ListingFilterParams } from '../types';
import { Api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<ListingFilterParams>({
    minPrice: undefined,
    maxPrice: undefined,
    minAbv: undefined,
    maxAbv: undefined,
    minRating: undefined,
    sortBy: 'date_desc'
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const activeFilters: ListingFilterParams = {
        search: searchTerm || undefined,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        minAbv: filters.minAbv || undefined,
        maxAbv: filters.maxAbv || undefined,
        minRating: filters.minRating || undefined,
        sortBy: filters.sortBy || undefined
      };
      
      const data = await Api.getListings(activeFilters);
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, filters]); // Re-fetch on any filter change

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: value as any }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      [name]: value ? Number(value) : undefined
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      minAbv: undefined,
      maxAbv: undefined,
      minRating: undefined,
      sortBy: 'date_desc'
    });
  };

  return (
    <div className="min-h-screen pb-12 bg-charcoal-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-charcoal-900 to-charcoal-950 text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-900/30 rounded-full blur-[128px] opacity-40"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-wine-900/40 rounded-full blur-[96px] opacity-40"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 animate-fade-in-up">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up animate-delay-200">
            {t.hero.subtitle}
          </p>
          
          <div className="mt-12 max-w-xl mx-auto relative group animate-fade-in-up animate-delay-400">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-wine-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.hero.searchPlaceholder}
                className="w-full px-14 py-5 rounded-full bg-charcoal-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 border border-gold-900/50 shadow-xl text-lg transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className={`absolute top-1/2 -translate-y-1/2 text-gold-500 h-6 w-6 ${language === 'he' ? 'left-auto right-5' : 'left-5 right-auto'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - Pull up over hero */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        
        {/* Categories & Filter Bar */}
        <div className="bg-charcoal-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gold-900/20 mb-10 overflow-hidden">
           <div className="p-4 overflow-x-auto">
            <div className="flex flex-nowrap md:flex-wrap items-center gap-3 min-w-max">
              {['All', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category | 'All')}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                    selectedCategory === cat 
                      ? 'bg-gold-500 text-charcoal-950 border-gold-400 shadow-lg transform scale-105' 
                      : 'bg-charcoal-800/50 text-gray-300 border-charcoal-700 hover:bg-charcoal-800 hover:border-charcoal-600'
                  }`}
                >
                  {cat === 'All' ? t.filters.all : t.filters.categories[cat as keyof typeof t.filters.categories]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-charcoal-900/30 px-4 py-2 border-t border-gold-900/20">
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors w-full justify-center py-2"
            >
              {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {t.filters.advanced}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="p-6 bg-charcoal-900/30 grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="col-span-full md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Price, ABV, Rating, Sort */}
                {[
                  { label: t.filters.priceRange, type: 'range', name1: 'minPrice', name2: 'maxPrice' },
                  { label: t.filters.abvRange, type: 'range', name1: 'minAbv', name2: 'maxAbv' },
                  { label: t.filters.sellerRating, type: 'select', name: 'minRating', options: [
                    { value: '', label: t.filters.all }, { value: '5', label: `5 ${t.filters.stars}` },
                    { value: '4', label: `4+ ${t.filters.stars}` }, { value: '3', label: `3+ ${t.filters.stars}` }
                  ]},
                  { label: t.filters.sortBy, type: 'select', name: 'sortBy', options: [
                    { value: 'date_desc', label: t.filters.sortOptions.date_desc }, { value: 'price_asc', label: t.filters.sortOptions.price_asc },
                    { value: 'price_desc', label: t.filters.sortOptions.price_desc }, { value: 'rating_desc', label: t.filters.sortOptions.rating_desc }
                  ]}
                ].map((item, idx) => (
                    <div key={idx}>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{item.label}</label>
                       {item.type === 'range' ? (
                          <div className="flex items-center gap-2">
                             <input type="number" name={item.name1} placeholder={t.filters.min} value={filters[item.name1] || ''} onChange={handleFilterChange} className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-gold-500 outline-none"/>
                             <span className="text-gray-500">-</span>
                             <input type="number" name={item.name2} placeholder={t.filters.max} value={filters[item.name2] || ''} onChange={handleFilterChange} className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-gold-500 outline-none"/>
                          </div>
                       ) : (
                          <div className="relative">
                            <select name={item.name} value={filters[item.name] || ''} onChange={handleFilterChange} className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:ring-1 focus:ring-gold-500 outline-none appearance-none">
                              {item.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <ChevronDown className="absolute top-2.5 right-3 rtl:right-auto rtl:left-3 text-gray-400 pointer-events-none" size={16} />
                          </div>
                       )}
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-serif font-bold text-gray-100">
               {selectedCategory === 'All' ? t.nav.market : t.filters.categories[selectedCategory as keyof typeof t.filters.categories]}
             </h2>
             <span className="text-sm text-gray-400 font-medium">{listings.length} results</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-charcoal-900 rounded-2xl h-[450px] border border-gold-900/20 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-charcoal-800/50 to-transparent animate-shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {listings
                      .filter(listing => listing && listing.id) // **הוספת הפילטור הקריטי**
                      .map((listing, i) => (
                    <div key={listing.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in-up">
                        <ProductCard listing={listing} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-charcoal-900 rounded-2xl p-16 text-center border border-dashed border-gold-900/20">
                  <div className="w-20 h-20 bg-charcoal-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{t.filters.noListings}</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or category filters.</p>
                  <button onClick={clearFilters} className="text-gold-400 font-semibold hover:text-gold-300 hover:underline">{t.filters.clear}</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;