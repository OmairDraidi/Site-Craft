/**
 * Builder Canvas
 * Main drag-and-drop editing area
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/stores/builderStore';
import { SortableSection } from './SortableSection';
import { EmptyCanvas } from './EmptyCanvas';
import { DEVICE_WIDTHS, type DeviceMode } from '@/types/builder.types';

export const BuilderCanvas = () => {
  const { pageData, deviceMode, siteBranding } = useBuilderStore();

  // Make the canvas area droppable
  const { setNodeRef: setCanvasRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  // Get device width for preview
  const canvasWidth = DEVICE_WIDTHS[deviceMode as DeviceMode];
  const canvasMaxWidth = canvasWidth ? `${canvasWidth}px` : '100%';

  // Apply branding CSS variables
  const brandingStyles = siteBranding ? {
    '--brand-primary': siteBranding.primaryColor,
    '--brand-secondary': siteBranding.secondaryColor,
    '--brand-heading-font': siteBranding.headingFontFamily,
    '--brand-body-font': siteBranding.bodyFontFamily,
    fontFamily: siteBranding.bodyFontFamily,
  } as React.CSSProperties : {};

  // Empty state
  if (pageData.sections.length === 0) {
    return (
      <div 
        ref={setCanvasRef}
        className="h-full flex items-center justify-center p-8"
      >
        <EmptyCanvas />
      </div>
    );
  }

  return (
    <div 
      ref={setCanvasRef}
      className={`min-h-full flex justify-center p-8 transition-colors ${
        isOver ? 'bg-[#F6C453]/5' : ''
      }`}
    >
      <div 
        className="w-full transition-all duration-300"
        style={{ maxWidth: canvasMaxWidth, ...brandingStyles }}
      >
        <SortableContext
          items={pageData.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {pageData.sections.map((section) => (
              <SortableSection key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};