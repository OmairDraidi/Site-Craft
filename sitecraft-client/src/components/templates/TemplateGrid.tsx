// src/components/templates/TemplateGrid.tsx

import { TemplateCard } from './TemplateCard';
import type { Template } from '@/types/template.types';

interface TemplateGridProps {
  templates: Template[];
  isLoading?: boolean;
  onTemplateSelect?: (template: Template) => void;
  onToggleFavorite?: (templateId: string) => void;
}

export const TemplateGrid = ({ 
  templates, 
  isLoading = false,
  onTemplateSelect,
  onToggleFavorite
}: TemplateGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="animate-pulse rounded-[2.5rem] bg-white/5 h-[500px] border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-32 bg-[#111111]/50 rounded-[3rem] border border-white/5 backdrop-blur-3xl animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/5 border border-gold/10 mb-8">
          <span className="text-5xl grayscale opacity-30">📭</span>
        </div>
        <p className="text-3xl text-white font-black italic mb-4">No Curations Found</p>
        <p className="text-gray-500 max-w-md mx-auto font-medium">
          The archives are empty for these specifications. Try refining your aesthetic preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
