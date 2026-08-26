import React, { useEffect, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { fetchMaterials } from '../services/materialService';
import { Link } from 'react-router-dom';
import { BookOpen, Calculator, FlaskConical, ArrowLeft } from 'lucide-react';

const Learning = () => {
  const { t, locale } = useLocale();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMaterials();
      setMaterials(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="pt-24 pb-24 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto relative">
        <Link 
          to="/" 
          className="absolute left-0 top-0 p-3 glass-card hover:bg-white/10 rounded-full flex items-center justify-center transition-colors z-20 hidden md:flex"
        >
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <Link 
          to="/" 
          className="md:hidden flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
          {t('learning') || 'શીખવું'}
        </h1>
        
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10 text-lg">
          Access video lessons and study materials uploaded by your teachers.
        </p>


        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="glass-card p-16 text-center text-gray-400 rounded-3xl border border-white/5">
            <BookOpen className="w-20 h-20 mx-auto mb-6 opacity-20 text-blue-500" />
            <p className="text-2xl font-semibold mb-2 text-white">No materials available yet</p>
            <p className="text-gray-400">Ask your teacher to upload videos or images!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <div key={m.id} className="glass-card overflow-hidden rounded-2xl group border border-white/5 transition-all shadow-lg flex flex-col hover:border-blue-500/40 hover:shadow-blue-500/10">
                <div className="aspect-video bg-black/60 relative flex items-center justify-center overflow-hidden">
                  {m.file_type === 'video' ? (
                    <video src={m.file_url} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={m.file_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-lg text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-colors"
                      style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa)' }}
                  >
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-auto">
                    <span className="uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-md border border-blue-500/20 text-blue-400">
                      {m.file_type}
                    </span>
                    <span>•</span>
                    <span>{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
