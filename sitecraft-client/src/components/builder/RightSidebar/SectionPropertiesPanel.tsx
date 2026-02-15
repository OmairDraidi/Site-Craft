/**
 * Section Properties Panel
 * Property controls for section-level customization
 */

import { useBuilderStore } from '@/stores/builderStore';
import type { SectionData } from '@/types/builder.types';

interface SectionPropertiesPanelProps {
  section: SectionData;
}

export const SectionPropertiesPanel = ({ section }: SectionPropertiesPanelProps) => {
  const { updateSection } = useBuilderStore();

  const handleStyleChange = (property: string, value: string) => {
    updateSection(section.id, {
      styles: { ...section.styles, [property]: value },
    });
  };

  const handlePaddingChange = (side: string, value: string) => {
    const paddingKey = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`;
    updateSection(section.id, {
      styles: { ...section.styles, [paddingKey]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Type Badge */}
      <div>
        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase rounded-full">
          Section
        </span>
      </div>

      {/* Section Name - Not Yet Implemented in Backend */}
      {/* 
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
          Section Name
        </label>
        <input
          type="text"
          value={section.name || ''}
          placeholder="e.g., Hero Section"
          className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
        />
      </div>
      */}

      {/* Background Color */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 uppercase">Background</h4>
        
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={section.styles?.backgroundColor || '#111111'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 bg-[#0A0A0A] border border-white/10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={section.styles?.backgroundColor || '#111111'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              placeholder="#111111"
            />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 uppercase">Spacing</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Padding Top</label>
            <input
              type="text"
              value={section.styles?.paddingTop || ''}
              onChange={(e) => handlePaddingChange('top', e.target.value)}
              placeholder="24px"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Padding Bottom</label>
            <input
              type="text"
              value={section.styles?.paddingBottom || ''}
              onChange={(e) => handlePaddingChange('bottom', e.target.value)}
              placeholder="24px"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Padding Left</label>
            <input
              type="text"
              value={section.styles?.paddingLeft || ''}
              onChange={(e) => handlePaddingChange('left', e.target.value)}
              placeholder="24px"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Padding Right</label>
            <input
              type="text"
              value={section.styles?.paddingRight || ''}
              onChange={(e) => handlePaddingChange('right', e.target.value)}
              placeholder="24px"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 uppercase">Style</h4>
        
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">Border Radius</label>
          <input
            type="text"
            value={section.styles?.borderRadius || ''}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="8px"
            className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
          />
        </div>
      </div>

      {/* Full Width Toggle - Not Yet Implemented in Backend */}
      {/* 
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
          Layout
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.fullWidth || false}
            className="w-4 h-4 bg-[#0A0A0A] border border-white/10 rounded focus:ring-[#F6C453] focus:ring-2 text-[#F6C453]"
          />
          <span className="text-sm text-gray-300">
            Full Width
          </span>
        </div>
      </div>
      */}
    </div>
  );
};
