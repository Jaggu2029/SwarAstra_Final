import React, { useEffect, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { fetchMaterials } from '../services/materialService';
import { BookOpen, Calculator, FlaskConical } from 'lucide-react';

const Learning = () => {
  const { t, locale } = useLocale();
  const [activeModule, setActiveModule] = useState('maths');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMaterials(activeModule);
      setMaterials(data);
      setLoading(false);
    };
    loadData();
  }, [activeModule]);

  return (
    <div className="pt-24 pb-24 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
          {t('learning') || 'શીખવું'}
        </h1>
        
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10 text-lg">
          Access video lessons and study materials uploaded by your teachers.
        </p>

        {/* Module Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 max-w-sm w-full relative">
            <button
              onClick={() => setActiveModule('maths')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 z-10 ${
                activeModule === 'maths' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Calculator size={18} className={activeModule === 'maths' ? 'text-primary-maths' : ''} />
              Maths
            </button>
            <button
              onClick={() => setActiveModule('science')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 z-10 ${
                activeModule === 'science' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <FlaskConical size={18} className={activeModule === 'science' ? 'text-primary-science' : ''} />
              Science
            </button>
            
            {/* Sliding highlight */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-out`}
              style={{ 
                left: activeModule === 'maths' ? '6px' : 'calc(50% + 0px)',
                background: activeModule === 'maths' 
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)' 
                  : 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)',
                border: `1px solid ${activeModule === 'maths' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${
              activeModule === 'maths' ? 'border-primary-maths' : 'border-primary-science'
            }`}></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="glass-card p-16 text-center text-gray-400 rounded-3xl border border-white/5">
            <BookOpen className={`w-20 h-20 mx-auto mb-6 opacity-20 ${
              activeModule === 'maths' ? 'text-primary-maths' : 'text-primary-science'
            }`} />
            <p className="text-2xl font-semibold mb-2 text-white">No materials available yet</p>
            <p className="text-gray-400">Ask your teacher to upload {activeModule} videos or images!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <div key={m.id} className={`glass-card overflow-hidden rounded-2xl group border border-white/5 transition-all shadow-lg flex flex-col ${
                activeModule === 'maths' ? 'hover:border-primary-maths/40 hover:shadow-primary-maths/10' : 'hover:border-primary-science/40 hover:shadow-primary-science/10'
              }`}>
                <div className="aspect-video bg-black/60 relative flex items-center justify-center overflow-hidden">
                  {m.file_type === 'video' ? (
                    <video src={m.file_url} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={m.file_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-lg text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-colors"
                      style={{ backgroundImage: activeModule === 'maths' ? 'linear-gradient(to right, #ef4444, #f87171)' : 'linear-gradient(to right, #22c55e, #4ade80)' }}
                  >
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-auto">
                    <span className={`uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-md border ${
                      activeModule === 'maths' ? 'border-primary-maths/20 text-primary-maths/80' : 'border-primary-science/20 text-primary-science/80'
                    }`}>
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
