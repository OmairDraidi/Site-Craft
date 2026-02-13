// src/components/templates/TemplateCard.tsx

import { Crown, ArrowRight, Star, Heart } from 'lucide-react';
import type { Template } from '@/types/template.types';

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
  onToggleFavorite?: (templateId: string) => void;
}

export const TemplateCard = ({ template, onSelect, onToggleFavorite }: TemplateCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(template.id);
  };

  return (
    <div
      onClick={() => onSelect?.(template)}
      className="group relative flex flex-col h-full rounded-[2.5rem] bg-white/[0.01] border border-white/[0.05] hover:border-gold/30 transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-sm hover:shadow-[0_40px_100px_-20px_rgba(246,196,83,0.15)]"
    >
      {/* Subtle Inner Glow - Appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Visual Container */}
      <div className="relative aspect-[16/10] overflow-hidden m-3 rounded-[2rem]">
        <img
          src={template.previewImageUrl}
          alt={template.name}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
        />

        {/* Soft Glass Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-40 group-hover:opacity-10 transition-opacity" />

        {/* Favorite Toggle */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-5 left-5 z-10
            flex items-center justify-center w-10 h-10 rounded-full
            bg-black/40 backdrop-blur-xl border border-white/10
            hover:bg-black/60 transition-all duration-300
            ${template.isFavorited ? 'text-[#F6C453]' : 'text-white/60 hover:text-white'}
          `}
          title={template.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-4 h-4 transition-all ${template.isFavorited ? 'fill-current' : ''}`}
          />
        </button>

        {/* Elite Tier Indicator */}
        {template.isPremium && (
          <div className="absolute top-5 right-5 z-10">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <Crown className="w-3.5 h-3.5 text-gold" fill="currentColor" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Premium</span>
            </div>
          </div>
        )}

        {/* Hero Overlay - Reveals on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
          <div className="flex items-center gap-2 mb-2 text-gold">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Industry Standard</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-10 flex flex-col pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black text-white group-hover:text-gold transition-colors duration-500 tracking-tight leading-none">
            {template.name}
          </h3>
          <div className="w-8 h-px bg-white/10 group-hover:w-16 group-hover:bg-gold/40 transition-all duration-700" />
        </div>

        <p className="text-base text-gray-400 font-medium leading-relaxed mb-10 line-clamp-2 opacity-80 decoration-gold/5 underline-offset-8 group-hover:text-gray-300">
          {template.description}
        </p>

        {/* Elegant Action Area */}
        <div className="mt-auto pt-8 border-t border-white/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gold/40 uppercase tracking-[0.2em] mb-1">Architecture</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{template.category}</span>
          </div>

          <button className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 shadow-xl">
            Choose Plan
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
