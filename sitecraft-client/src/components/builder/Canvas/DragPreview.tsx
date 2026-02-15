/**
 * Drag Preview
 * Visual preview shown in DragOverlay during drag operations
 */

import type { ComponentData, DraggableElement, SectionTemplate } from '@/types/builder.types';
import { ElementRenderer } from './ElementRenderer';

interface DragPreviewProps {
  activeType: 'element' | 'section' | 'component' | null;
  activeData: {
    element?: DraggableElement;
    section?: SectionTemplate;
    component?: ComponentData;
  } | null;
}

export const DragPreview = ({ activeType, activeData }: DragPreviewProps) => {
  if (!activeType || !activeData) return null;

  // Preview for elements from sidebar
  if (activeType === 'element' && activeData.element) {
    const element = activeData.element;
    return (
      <div className="bg-[#1a1a1a] border-2 border-[#F6C453] rounded-lg p-4 shadow-2xl max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#F6C453]/20 flex items-center justify-center">
            <span className="text-[#F6C453] text-xl">+</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">{element.label}</div>
            <div className="text-gray-400 text-xs">{element.category}</div>
          </div>
        </div>
      </div>
    );
  }

  // Preview for section templates from sidebar
  if (activeType === 'section' && activeData.section) {
    const section = activeData.section;
    return (
      <div className="bg-[#1a1a1a] border-2 border-[#F6C453] rounded-lg p-4 shadow-2xl max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#F6C453]/20 flex items-center justify-center">
            <span className="text-[#F6C453] text-xl">📄</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">{section.type}</div>
            <div className="text-gray-400 text-xs">Section Template</div>
          </div>
        </div>
      </div>
    );
  }

  // Preview for existing components being moved
  if (activeType === 'component' && activeData.component) {
    const component = activeData.component;
    return (
      <div className="bg-[#1a1a1a]/90 border-2 border-blue-500 rounded-lg shadow-2xl pointer-events-none max-w-md opacity-90">
        <div className="p-3">
          <ElementRenderer component={component} sectionId="" />
        </div>
      </div>
    );
  }

  return null;
};
