// src/pages/templates/TemplateDetailsPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crown, 
  Users, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Globe, 
  Layout, 
  Sparkles,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useTemplateStore } from '@/stores/useTemplateStore';
import { useAuth } from '@/contexts/AuthContext';
import { DevicePreview } from '@/components/templates';

export const TemplateDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedTemplate, 
    isLoading, 
    error, 
    fetchTemplateById, 
    applyTemplate,
    toggleFavorite
  } = useTemplateStore();

  const [isApplying, setIsApplying] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/templates/${id}` } });
      return;
    }
    if (id) {
      try {
        await toggleFavorite(id);
      } catch (err) {
        console.error('Failed to toggle favorite:', err);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchTemplateById(id);
    }
  }, [id, fetchTemplateById]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/templates/${id}` } });
      return;
    }

    if (!id) return;

    setIsApplying(true);
    try {
      await applyTemplate(id);
      // Success logic - navigate to builder or site
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-gold font-black text-xs animate-pulse">SITE</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedTemplate) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-black text-white mb-4">Masterpiece Not Found</h1>
        <p className="text-gray-500 mb-8">{error || "The requested template has been archived or removed."}</p>
        <button 
          onClick={() => navigate('/templates')}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-gold/10 hover:border-gold/30 transition-all"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden font-sans pb-24">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16 pt-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-16">
          <button 
            onClick={() => navigate('/templates')}
            className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
          >
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-gold/20 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Gallery</span>
          </button>

          <div className="flex items-center gap-4">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category: <span className="text-white">{selectedTemplate.category}</span></span>
             </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Left Column: Visuals */}
          <div className="xl:col-span-8 space-y-8">
            {/* Device Preview */}
            <div className="relative">
              <DevicePreview 
                imageUrl={selectedTemplate.previewImageUrl}
                templateName={selectedTemplate.name}
              />
              
              {/* Premium Floating Badge */}
              {selectedTemplate.isPremium && (
                <div className="absolute -top-6 right-8 flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-gold to-[#CBA34E] shadow-3xl animate-bounce-slow z-10">
                  <Crown className="w-5 h-5 text-black" fill="currentColor" />
                  <span className="text-sm font-black text-black uppercase tracking-tight">Elite Tier Template</span>
                </div>
              )}
              
              {/* Favorite Toggle */}
              <button
                onClick={handleToggleFavorite}
                className={`
                  absolute -top-6 left-8 z-10
                  flex items-center justify-center w-12 h-12 rounded-full
                  bg-black/40 backdrop-blur-xl border border-white/10
                  hover:bg-black/60 transition-all duration-300
                  ${
                    selectedTemplate.isFavorited 
                      ? 'text-[#F6C453]' 
                      : 'text-white/60 hover:text-white'
                  }
                `}
                title={selectedTemplate.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`w-5 h-5 transition-all ${
                    selectedTemplate.isFavorited ? 'fill-current' : ''
                  }`}
                />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Ultra Performance", desc: "Built with cutting-edge optimization for 100/100 LH scores." },
                { icon: Layout, title: "Artistic Precision", desc: "Pixel-perfect layouts crafted by world-class UI designers." },
                { icon: Globe, title: "Global Ready", desc: "Seamless multi-language and currency support integrated." },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-[#111111]/40 backdrop-blur-3xl border border-white/5 hover:border-gold/20 transition-all group">
                  <feature.icon className="w-8 h-8 text-gold mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-white text-lg font-black mb-3 tracking-tight">{feature.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="xl:col-span-4 sticky top-10">
            <div className="bg-[#111111]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-4xl relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
               
               <div className="mb-10">
                 <div className="flex items-center gap-2 mb-6">
                   <Sparkles className="w-4 h-4 text-gold" />
                   <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Design Masterpiece</span>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                   {selectedTemplate.name}
                 </h1>
                 <p className="text-xl text-gray-500 font-medium italic leading-relaxed">
                   "{selectedTemplate.description}"
                 </p>
               </div>

               <div className="space-y-4 mb-12">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-3">
                       <Users className="w-5 h-5 text-gray-500" />
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Installs</span>
                    </div>
                    <span className="text-sm font-black text-white">{selectedTemplate.usageCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-3">
                       <Layers className="w-5 h-5 text-gray-500" />
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Framework</span>
                    </div>
                    <span className="text-sm font-black text-white">SiteCraft v2.0</span>
                  </div>
               </div>

               {/* Inclusion List */}
               <div className="mb-12">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">Inclusive Elements</h4>
                  <ul className="space-y-4">
                    {["Premium Illustrations", "Commercial Fonts", "Responsive Dashboard", "SEO Architecture"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Action Button */}
               <button 
                onClick={handleApply}
                disabled={isApplying}
                className="w-full relative group"
               >
                 <div className="absolute inset-0 bg-gold blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                 <div className="relative flex items-center justify-between p-1 bg-gradient-to-br from-gold to-[#CBA34E] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="flex-1 py-5 px-8 flex items-center justify-center">
                       <span className="text-black text-lg font-black uppercase tracking-widest">
                         {isApplying ? 'Initializing Studio...' : 'Initialize Studio'}
                       </span>
                    </div>
                    <div className="p-5 bg-black/10 backdrop-blur-xl">
                       <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                 </div>
               </button>

               <p className="text-center mt-8 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
                 {selectedTemplate.isPremium ? 'Investment required per tenant' : 'Available for immediate discovery'}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
