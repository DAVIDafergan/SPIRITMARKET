import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle, AlertTriangle, XCircle, Loader2, Camera, Lock } from 'lucide-react';
import { Category } from '../types';
import { Api } from '../services/api'; // Use unified API
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// ----------------------------------------------------------------------
// **התוספת והתיקון: ייצוא רשימת הקטגוריות הנדרש ע"י EditListing.tsx**
// ----------------------------------------------------------------------
export const categories: Category[] = [
    Category.WHISKEY,
    Category.WINE,
    Category.VODKA,
    Category.RUM,
    Category.GIN,
    Category.TEQUILA,
    Category.OTHER,
];
// ----------------------------------------------------------------------


const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: Category.WHISKEY,
    location: '',
    abv: '',
    volumeMl: '',
    brand: '',
    vintage: '',
    isKosher: false
  });

  // AI/Upload State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'ANALYZING' | 'COMPLETE'>('IDLE');
  const [aiResult, setAiResult] = useState<{ score: number; message: string; color: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      setVerificationStatus('ANALYZING');
      setAiResult(null);

      try {
        const result = await Api.simulateVertexAIPrediction(selectedFile);
        
        let message = '';
        let color = '';
        
        if (result.score >= 0.75) {
          message = `${t.create.aiVerify} ${result.labels[0]} (${Math.round(result.score * 100)}%).`;
          color = 'bg-green-500/10 border-green-500/20 text-green-300';
        } else if (result.score >= 0.5) {
          message = t.create.aiReview;
          color = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
        } else {
          message = t.create.aiReject;
          color = 'bg-red-500/10 border-red-500/20 text-red-300';
        }

        setAiResult({ score: result.score, message, color });
        setVerificationStatus('COMPLETE');
        addToast('AI Analysis Complete', 'info');
      } catch (error) {
        console.error(error);
        setVerificationStatus('IDLE');
        addToast('Failed to analyze image', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || verificationStatus !== 'COMPLETE' || !user) return;

    setIsSubmitting(true);

    try {
      const analysis = await Api.simulateVertexAIPrediction(file);
      
      await Api.createListing({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        imageUrl: previewUrl || '',
        location: formData.location,
        abv: Number(formData.abv),
        volumeMl: Number(formData.volumeMl),
        brand: formData.brand,
        vintage: Number(formData.vintage),
        isKosher: formData.isKosher
      }, analysis);

      addToast('Listing created successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      addToast('Failed to create listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
         <div className="bg-charcoal-800 p-6 rounded-full mb-6 border border-gold-900/30">
            <Lock size={48} className="text-gray-500" />
         </div>
         <h2 className="text-2xl font-bold text-gray-100 mb-2">{t.create.loginRequired}</h2>
         <Link to="/login" className="bg-gold-500 text-charcoal-950 px-8 py-3 rounded-full font-bold hover:bg-gold-400 transition-colors shadow-lg shadow-gold-900/20">
            {t.create.loginBtn}
         </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-charcoal-900 rounded-3xl shadow-2xl shadow-black/40 border border-gold-900/20 overflow-hidden">
        <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-white px-10 py-8 border-b border-gold-900/20">
          <h1 className="text-3xl font-serif font-bold text-gold-300">{t.create.title}</h1>
          <p className="text-gray-400 mt-2">{t.create.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-300">{t.create.uploadLabel}</label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-[300px]
                ${previewUrl ? 'border-gold-700/50 bg-charcoal-800/20' : 'border-charcoal-700 hover:border-gold-700/50 hover:bg-charcoal-800'}
              `}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"/>
              
              {previewUrl ? (
                <div className="relative w-full flex flex-col items-center z-10 pointer-events-none">
                  <img src={previewUrl} alt="Preview" className="max-h-64 object-contain rounded-lg shadow-lg mb-4" />
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); setPreviewUrl(null); setVerificationStatus('IDLE'); }}
                    className="text-sm bg-charcoal-950 px-4 py-2 rounded-full shadow text-red-400 hover:text-red-300 font-medium pointer-events-auto z-40 border border-red-500/20">
                    {t.create.remove}
                  </button>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <div className="bg-charcoal-800 text-gray-500 p-5 rounded-full inline-block mb-4 border border-charcoal-700">
                    <Camera size={40} />
                  </div>
                  <p className="text-gray-100 font-bold text-lg">{t.create.clickUpload}</p>
                  <p className="text-sm text-gray-500 mt-2">{t.create.uploadHint}</p>
                </div>
              )}
            </div>

            {verificationStatus === 'ANALYZING' && (
              <div className="flex items-center gap-3 p-5 bg-blue-500/10 text-blue-300 rounded-xl border border-blue-500/20 animate-pulse">
                <Loader2 className="animate-spin" />
                <span className="font-semibold">{t.create.analyzing}</span>
              </div>
            )}

            {verificationStatus === 'COMPLETE' && aiResult && (
              <div className={`flex items-start gap-4 p-5 rounded-xl border ${aiResult.color}`}>
                {aiResult.score >= 0.75 ? <CheckCircle className="flex-shrink-0" size={24} /> : 
                 aiResult.score >= 0.5 ? <AlertTriangle className="flex-shrink-0" size={24} /> : 
                 <XCircle className="flex-shrink-0" size={24} />}
                <div>
                  <p className="font-bold text-lg">{t.create.aiResult}</p>
                  <p className="text-sm opacity-90">{aiResult.message}</p>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gold-900/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'title', label: t.create.form.title, colSpan: 'col-span-full', placeholder: 'e.g. Macallan 18 Year Old' },
              { name: 'brand', label: t.create.form.brand, placeholder: 'e.g. Macallan' },
              { name: 'vintage', label: t.create.form.vintage, type: 'number', placeholder: 'e.g. 2018' },
              { name: 'price', label: t.create.form.price, type: 'number', placeholder: '0.00' },
              { name: 'category', label: t.create.form.category, type: 'select' },
              { name: 'abv', label: t.create.form.abv, type: 'number', placeholder: '40' },
              { name: 'volumeMl', label: t.create.form.volume, type: 'number', placeholder: '700' },
              { name: 'location', label: t.create.form.location, colSpan: 'col-span-full' },
            ].map(field => (
              <div key={field.name} className={field.colSpan || ''}>
                <label className="block text-sm font-bold text-gray-300 mb-2">{field.label}</label>
                {field.type === 'select' ? (
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gold-900/20 bg-charcoal-800 rounded-xl p-4 focus:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none transition-all font-medium text-gray-200">
                    {categories.map(c => <option key={c} value={c}>{t.filters.categories[c] || c}</option>)} 
                  </select>
                ) : (
                   <input 
                    name={field.name} type={field.type || 'text'} required
                    value={formData[field.name as keyof typeof formData] as string} onChange={handleChange}
                    className="w-full border border-gold-900/20 bg-charcoal-800 rounded-xl p-4 focus:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none transition-all font-medium text-gray-200"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <div className="col-span-full">
              <label className="block text-sm font-bold text-gray-300 mb-2">{t.create.form.desc}</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows={4} className="w-full border border-gold-900/20 bg-charcoal-800 rounded-xl p-4 focus:bg-charcoal-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none transition-all font-medium resize-none text-gray-200" placeholder="Describe the condition, history, and storage..." />
            </div>

            <div className="col-span-full">
              <label className="flex items-center gap-3 p-4 bg-charcoal-800 border border-gold-900/20 rounded-xl cursor-pointer hover:bg-charcoal-700 transition-colors">
                <input type="checkbox" name="isKosher" checked={formData.isKosher} onChange={handleChange} className="w-5 h-5 bg-charcoal-900 text-gold-500 rounded focus:ring-gold-500 border-gold-900/50" />
                <span className="font-bold text-gray-300">{t.create.form.isKosher}</span>
              </label>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button type="submit" disabled={!file || verificationStatus !== 'COMPLETE' || isSubmitting || (aiResult?.score || 0) < 0.2}
              className="bg-gold-500 text-charcoal-950 text-lg px-10 py-4 rounded-full font-bold shadow-xl shadow-gold-900/20 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 transform hover:-translate-y-1">
              {isSubmitting && <Loader2 className="animate-spin" size={24} />}
              {t.create.form.submit}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default CreateListing;