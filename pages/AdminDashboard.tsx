import React, { useEffect, useState } from 'react';
import { Check, X, Eye, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Listing, ListingStatus } from '../types';
import { MockApi } from '../services/mockApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const [queue, setQueue] = useState<Listing[]>([]);
  const { t } = useLanguage();
  const [stats, setStats] = useState([
    { name: 'Pending', count: 12, color: '#b45309' },
    { name: 'Approved', count: 145, color: '#16a34a' },
    { name: 'Rejected', count: 8, color: '#dc2626' },
    { name: 'Review', count: 3, color: '#d97706' },
  ]);

  useEffect(() => {
    const fetchQueue = async () => {
      const data = await MockApi.getModerationQueue();
      setQueue(data);
    };
    fetchQueue();
  }, []);

  const handleModeration = async (id: string, action: 'APPROVE' | 'REJECT') => {
    await MockApi.moderateListing(id, action);
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-100">{t.admin.title}</h1>
          <p className="text-gray-400">{t.admin.subtitle}</p>
        </div>
        <div className="bg-charcoal-900 p-2 rounded-lg border border-green-500/20 shadow-sm flex items-center gap-2 text-sm text-gray-300">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {t.admin.systemOp}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-charcoal-900 p-6 rounded-xl border border-gold-900/20 shadow-lg md:col-span-1">
          <h3 className="font-semibold text-gray-300 mb-4">{t.admin.statusOverview}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#a1a1aa' }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1C1C1F', border: '1px solid #78350f' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-wine-800 to-wine-900 text-white p-6 rounded-xl shadow-md md:col-span-2 flex flex-col justify-center border border-wine-700">
          <h2 className="text-2xl font-bold mb-2">{t.admin.humanLoop}</h2>
          <p className="opacity-90 max-w-lg">
            {t.admin.humanLoopText}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
        <ShieldAlert className="text-gold-500" />
        {t.admin.needsReview} ({queue.length})
      </h2>

      <div className="bg-charcoal-900 rounded-xl shadow-lg border border-gold-900/20 overflow-hidden">
        {queue.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <p>{t.admin.emptyQueue}</p>
          </div>
        ) : (
          <div className="divide-y divide-gold-900/20">
            {queue.map(item => (
              <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 bg-charcoal-800 rounded-lg overflow-hidden relative flex-shrink-0 border border-gold-900/20">
                  <img src={item.imageUrl} alt="Review" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-xs p-2 text-center">
                    {t.admin.aiScore}: <span className="font-bold text-yellow-400">{(item.aiData?.score || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-100">{item.title}</h3>
                    <span className="bg-yellow-500/10 text-yellow-300 text-xs px-2 py-1 rounded-full font-medium">{t.admin.needsReview}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  
                  <div className="bg-charcoal-800 p-3 rounded-lg mt-2 text-sm border border-gold-900/10">
                    <span className="font-semibold text-gray-300">{t.admin.aiAnalysis}: </span>
                    <span className="text-gray-400">{item.aiData?.explanation || 'No explanation provided.'}</span>
                    <div className="mt-1 flex gap-2">
                      {item.aiData?.labels.map(l => (
                        <span key={l} className="bg-charcoal-700 text-gray-300 text-xs px-2 py-0.5 rounded">{l}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center gap-4 text-sm text-gray-400">
                    <span>{t.admin.seller}: {item.sellerName}</span>
                    <span>•</span>
                    <span>{t.admin.price}: ${item.price}</span>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-center min-w-[120px]">
                  <button 
                    onClick={() => handleModeration(item.id, 'APPROVE')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check size={16} /> {t.admin.approve}
                  </button>
                  <button 
                    onClick={() => handleModeration(item.id, 'REJECT')}
                    className="flex-1 bg-charcoal-800 border border-red-500/20 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <X size={16} /> {t.admin.reject}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
