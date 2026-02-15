/**
 * Properties Panel
 * Dynamic property controls based on component type
 */

import { useBuilderStore } from '@/stores/builderStore';
import type { ComponentData } from '@/types/builder.types';

interface PropertiesPanelProps {
  component: ComponentData;
}

export const PropertiesPanel = ({ component }: PropertiesPanelProps) => {
  const { updateComponent } = useBuilderStore();

  const handleContentChange = (value: string) => {
    updateComponent(component.id, { content: value });
  };

  const handleStyleChange = (property: string, value: string) => {
    updateComponent(component.id, {
      styles: { ...component.styles, [property]: value },
    });
  };

  const handleSrcChange = (value: string) => {
    updateComponent(component.id, { src: value });
  };

  const handleAltChange = (value: string) => {
    updateComponent(component.id, { alt: value });
  };

  const handleVisibilityChange = (value: boolean) => {
    updateComponent(component.id, { visible: value });
  };

  const isVisible = component.visible !== false; // Default to true if undefined

  return (
    <div className="space-y-6">
      {/* Component Type Badge */}
      <div>
        <span className="inline-block px-3 py-1 bg-[#F6C453]/10 text-[#F6C453] text-xs font-bold uppercase rounded-full">
          {component.type}
        </span>
      </div>

      {/* Visibility Toggle */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
          Visibility
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => handleVisibilityChange(e.target.checked)}
            className="w-4 h-4 bg-[#0A0A0A] border border-white/10 rounded focus:ring-[#F6C453] focus:ring-2 text-[#F6C453]"
          />
          <span className="text-sm text-gray-300">
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Content Editor */}
      {(component.type === 'heading' || component.type === 'text' || component.type === 'button' || component.type === 'icon') && (
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
            Content
          </label>
          <textarea
            value={component.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453] resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Image/Video Source */}
      {(component.type === 'image' || component.type === 'video') && (
        <>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              Source URL
            </label>
            <input
              type="text"
              value={component.src || ''}
              onChange={(e) => handleSrcChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
            />
          </div>
          
          {component.type === 'image' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                Alt Text
              </label>
              <input
                type="text"
                value={component.alt || ''}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Image description"
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              />
            </div>
          )}
        </>
      )}

      {/* Typography */}
      {(component.type === 'heading' || component.type === 'text' || component.type === 'button') && (
        <div>
          <h4 className="text-sm font-bold text-white mb-3 uppercase">Typography</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Font Size</label>
              <input
                type="text"
                value={component.styles?.fontSize || '1rem'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
                placeholder="1rem, 16px, etc."
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Font Weight</label>
              <select
                value={component.styles?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="600">Semi Bold</option>
                <option value="300">Light</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Text Align</label>
              <select
                value={component.styles?.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={component.styles?.color || '#FFFFFF'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-12 h-10 bg-[#0A0A0A] border border-white/10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={component.styles?.color || '#FFFFFF'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 uppercase">Layout</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Padding</label>
            <input
              type="text"
              value={component.styles?.padding || '0'}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              placeholder="1rem, 16px, etc."
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Margin</label>
            <input
              type="text"
              value={component.styles?.margin || '0'}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              placeholder="1rem, 16px, etc."
            />
          </div>
        </div>
      </div>

      {/* Background & Border */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 uppercase">Style</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={component.styles?.backgroundColor || '#000000'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-12 h-10 bg-[#0A0A0A] border border-white/10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={component.styles?.backgroundColor || 'transparent'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">Border Radius</label>
            <input
              type="text"
              value={component.styles?.borderRadius || '0'}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#F6C453]"
              placeholder="0.5rem, 8px, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
