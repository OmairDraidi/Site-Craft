/**
 * Sections Panel
 * Pre-built sections (Hero, Features, Pricing, etc.)
 */

import { useDraggable } from '@dnd-kit/core';
import { Layout, Grid3x3, CreditCard, MessageSquare, Mail } from 'lucide-react';
import type { SectionType } from '@/types/builder.types';

interface SectionTemplateDef {
  type: SectionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SECTIONS: SectionTemplateDef[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: <Layout className="w-5 h-5" />,
    description: 'Hero section with heading and CTA',
  },
  {
    type: 'features',
    label: 'Features',
    icon: <Grid3x3 className="w-5 h-5" />,
    description: '3-column feature grid',
  },
  {
    type: 'pricing',
    label: 'Pricing',
    icon: <CreditCard className="w-5 h-5" />,
    description: '3-tier pricing table',
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Customer testimonials',
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: <Mail className="w-5 h-5" />,
    description: '3-column footer',
  },
];

interface DraggableSectionProps {
  section: SectionTemplateDef;
}

const DraggableSection = ({ section }: DraggableSectionProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `section-${section.type}`,
    data: { section },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 bg-[#0A0A0A] border border-white/10 rounded-lg hover:border-[#F6C453]/50 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#F6C453]/10 text-[#F6C453] rounded flex-shrink-0">
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium mb-1">{section.label}</div>
          <div className="text-gray-500 text-xs">{section.description}</div>
        </div>
      </div>
    </div>
  );
};

export const SectionsPanel = () => {
  return (
    <div className="p-4">
      <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wide">
        Pre-Built Sections
      </h3>
      <div className="space-y-2">
        {SECTIONS.map((section) => (
          <DraggableSection key={section.type} section={section} />
        ))}
      </div>
    </div>
  );
};
