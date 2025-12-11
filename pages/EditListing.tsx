import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Loader2, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Api } from '../services/api';
import { Listing, Category, UpdateListingRequest } from '../types';
import { categories } from './CreateListing'; // נניח שאתה משתמש ברשימת קטגוריות חיצונית

// פונקציית עזר לטעינת נתונים ראשוניים
const fetchListingData = async (id: string | undefined): Promise<Listing | null> => {
    if (!id) return null;
    try {
        // שימוש ב-view endpoint כדי לקבל נתונים
        const listing = await Api.getListingById(id); 
        return listing || null;
    } catch (error) {
        console.error("Failed to fetch listing:", error);
        return null;
    }
};

const EditListing: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, dir, language } = useLanguage();
    const { showToast } = useToast();

    // מצב טעינה ונתונים
    const [initialListing, setInitialListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // מצב הטופס (משתמש בנתונים הקיימים)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [category, setCategory] = useState<Category | ''>('');
    const [location, setLocation] = useState('');
    const [abv, setAbv] = useState<number | ''>('');
    const [volumeMl, setVolumeMl] = useState<number | ''>('');
    const [brand, setBrand] = useState('');
    const [vintage, setVintage] = useState<number | ''>('');
    const [isKosher, setIsKosher] = useState(false);

    // טעינת הנתונים הקיימים של המודעה
    useEffect(() => {
        const loadListing = async () => {
            setIsLoading(true);
            const listing = await fetchListingData(id);

            if (!listing) {
                setError(t.editListing.listingNotFound || 'Listing not found.');
                setIsLoading(false);
                return;
            }

            // הגנה: ודא שהמשתמש הנוכחי הוא המוכר
            if (listing.sellerId !== user?.id) {
                setError(t.editListing.notAuthorized || 'You are not authorized to edit this listing.');
                setIsLoading(false);
                return;
            }

            // עדכון ה-State עם הנתונים שנשלפו
            setInitialListing(listing);
            setTitle(listing.title);
            setDescription(listing.description);
            setPrice(listing.price);
            setCategory(listing.category);
            setLocation(listing.location);
            setAbv(listing.abv);
            setVolumeMl(listing.volumeMl);
            setBrand(listing.brand);
            setVintage(listing.vintage);
            setIsKosher(listing.isKosher);
            setIsLoading(false);
        };

        if (user && id) {
            loadListing();
        } else if (!user) {
            navigate('/login'); // נווט להתחברות אם לא מחובר
        }
    }, [id, user, navigate, t.editListing.listingNotFound, t.editListing.notAuthorized]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialListing || !id) return;
        setIsSubmitting(true);
        setError(null);

        // יצירת אובייקט ה-DTO לעדכון
        const updateData: UpdateListingRequest = {
            title,
            description,
            price: price as number,
            category: category as Category,
            location,
            abv: abv as number,
            volumeMl: volumeMl as number,
            brand,
            vintage: vintage as number,
            isKosher,
        };

        try {
            await Api.updateListing(id, updateData);
            showToast(t.editListing.updateSuccess, 'success');
            navigate(`/listing/${id}`); // נווט חזרה לדף המוצר
        } catch (err) {
            console.error('Update failed:', err);
            showToast(t.editListing.updateError, 'error');
            setError(t.editListing.updateError);
        } finally {
            setIsSubmitting(false);
        }
    };

    // סגנון RTL/LTR
    const textDirectionClass = dir === 'rtl' ? 'text-right' : 'text-left';
    const inputDirectionClass = dir === 'rtl' ? 'text-right' : 'text-left';

    if (!user) {
        return <div className="max-w-7xl mx-auto p-8 text-center text-gray-400">{t.create.loginRequired}</div>;
    }
    
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-16 px-4 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                <span className="text-gray-400 ml-3">{t.create.analyzing || 'Loading listing details...'}</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-400">
                <AlertTriangle size={32} className="mx-auto mb-4" />
                <p>{error}</p>
            </div>
        );
    }

    if (!initialListing) {
        return <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-400">Listing details are missing.</div>;
    }


    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            
            {/* כותרת הדף */}
            <div className={`pb-6 mb-8 border-b border-gold-900/50 ${textDirectionClass}`}>
                <h1 className="text-3xl font-bold text-white">{t.editListing.title}</h1>
                <p className="mt-2 text-gray-400">
                    {t.editListing.subtitle || `Editing: ${initialListing.title}`}
                </p>
                <Link to="/my-listings" className="text-sm text-gold-500 hover:text-gold-400 mt-2 block">
                    &larr; {t.myListings.manageListings || 'Back to My Listings'}
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-charcoal-900 p-8 rounded-xl shadow-2xl border border-gold-900/30">
                
                {/* -------------------------------------- */}
                {/* חלק 1: פרטי הבקבוק הבסיסיים (ניתנים לעריכה) */}
                {/* -------------------------------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* כותרת */}
                    <div>
                        <label htmlFor="title" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.title}
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 ${inputDirectionClass}`}
                        />
                    </div>
                    
                    {/* מותג / יקב */}
                    <div>
                        <label htmlFor="brand" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.brand}
                        </label>
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 ${inputDirectionClass}`}
                        />
                    </div>
                    
                    {/* קטגוריה */}
                    <div>
                        <label htmlFor="category" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.category}
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                required
                                className="w-full p-3 appearance-none rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500"
                            >
                                <option value="" disabled>{t.filters.all}</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{t.filters.categories[cat] || cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* מחיר */}
                    <div>
                        <label htmlFor="price" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.price}
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            required
                            min="1"
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 text-left`}
                            style={{ direction: 'ltr' }}
                        />
                    </div>

                </div>
                
                {/* תיאור */}
                <div>
                    <label htmlFor="description" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                        {t.create.form.desc}
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 ${inputDirectionClass}`}
                    />
                </div>

                {/* -------------------------------------- */}
                {/* חלק 2: נתונים טכניים */}
                {/* -------------------------------------- */}
                <h2 className={`text-xl font-semibold text-gold-400 pt-4 border-t border-gold-900/30 ${textDirectionClass}`}>
                    {t.detail.technicalInfo || 'Technical Information'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    
                    {/* נפח */}
                    <div>
                        <label htmlFor="volumeMl" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.volume}
                        </label>
                        <input
                            type="number"
                            id="volumeMl"
                            value={volumeMl}
                            onChange={(e) => setVolumeMl(parseFloat(e.target.value))}
                            required
                            min="1"
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 text-left`}
                            style={{ direction: 'ltr' }}
                        />
                    </div>
                    
                    {/* ABV */}
                    <div>
                        <label htmlFor="abv" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.abv}
                        </label>
                        <input
                            type="number"
                            id="abv"
                            value={abv}
                            onChange={(e) => setAbv(parseFloat(e.target.value))}
                            required
                            min="0"
                            max="100"
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 text-left`}
                            style={{ direction: 'ltr' }}
                        />
                    </div>
                    
                    {/* בציר */}
                    <div>
                        <label htmlFor="vintage" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.vintage}
                        </label>
                        <input
                            type="number"
                            id="vintage"
                            value={vintage}
                            onChange={(e) => setVintage(parseInt(e.target.value))}
                            required
                            min="1800"
                            max={new Date().getFullYear()}
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 text-left`}
                            style={{ direction: 'ltr' }}
                        />
                    </div>
                    
                    {/* מיקום */}
                    <div>
                        <label htmlFor="location" className={`block text-sm font-medium text-gray-300 mb-1 ${textDirectionClass}`}>
                            {t.create.form.location}
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className={`w-full p-3 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:ring-gold-500 focus:border-gold-500 ${inputDirectionClass}`}
                        />
                    </div>

                </div>
                
                {/* כשרות */}
                <div className={`flex items-center pt-4 border-t border-gold-900/30 ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                    <input
                        id="isKosher"
                        type="checkbox"
                        checked={isKosher}
                        onChange={(e) => setIsKosher(e.target.checked)}
                        className={`h-4 w-4 text-gold-500 rounded border-gray-600 focus:ring-gold-500 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}
                    />
                    <label htmlFor="isKosher" className="text-sm font-medium text-gray-300">
                        {t.create.form.isKosher}
                    </label>
                </div>

                {/* כפתור שמירה */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gold-500 text-charcoal-950 px-8 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                        {isSubmitting ? t.create.analyzing : t.editListing.updateBtn}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditListing;