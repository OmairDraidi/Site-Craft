// src/components/templates/TemplateFilters.tsx

import { Search, X, Command } from 'lucide-react';
import type { TemplateCategory, TemplateFilters } from '@/types/template.types';

interface TemplateFiltersProps {
  filters: TemplateFilters;
  onFilterChange: (filters: Partial<TemplateFilters>) => void;
  onClearFilters: () => void;
}

const categories: Array<TemplateCategory | 'All'> = [
  'All', 'Business', 'Education', 'Portfolio', 'Services', 'Store'
];

export const TemplateFiltersComponent = ({
  filters,
  onFilterChange,
  onClearFilters
}: TemplateFiltersProps) => {
  return (
    <div className="space-y-12">
      {/* Floating Search Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase flex items-center gap-2">
            <Search className="w-3 h-3" />
            Find Your Craft
          </label>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
            <Command className="w-2.5 h-2.5 text-white/40" />
            <span className="text-[8px] font-bold text-white/40">K</span>
          </div>
        </div>
        <div className="relative group/search">
          <input
            type="text"
            placeholder="What are you building?..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="w-full px-6 py-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/40 focus:bg-white/[0.04] transition-all duration-500 shadow-2xl"
          />
        </div>
      </div>

      {/* Visual Collections */}
      <div className="space-y-6">
        <label className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase block">Curated Collections</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange({ category })}
              className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 border ${filters.category === category
                ? 'bg-gold text-black border-gold shadow-[0_10px_30px_rgba(246,196,83,0.3)]'
                : 'bg-white/[0.03] text-gray-500 border-white/10 hover:border-white/30'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Filter */}
      <div className="space-y-6">
        <label className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase block">Tier Selection</label>
        <div className="grid grid-cols-2 gap-2 bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-2xl">
          {[
            { label: 'Standard', value: null },
            { label: 'Premium', value: true }
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onFilterChange({ isPremium: opt.value as boolean })}
              className={`py-3 rounded-[1rem] text-[9px] font-black tracking-widest uppercase transition-all duration-700 ${filters.isPremium === opt.value
                ? 'bg-white/[0.05] text-gold shadow-lg border border-white/5'
                : 'text-gray-600 hover:text-gray-400'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Action */}
      <button
        onClick={onClearFilters}
        className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl border border-white/5 hover:border-red-500/30 group/clear transition-all duration-700 opacity-60 hover:opacity-100"
      >
        <span className="text-[10px] font-black tracking-[0.3em] text-white/50 group-hover/clear:text-red-500/70 transition-colors uppercase">Reset Workspace</span>
        <X className="w-4 h-4 text-white/30 group-hover/clear:text-red-500 group-hover/clear:rotate-90 transition-all duration-700" />
      </button>
    </div>
  );
};
