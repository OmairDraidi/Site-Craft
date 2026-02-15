/**
 * Sortable Section
 * A draggable/sortable section containing components
 */

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import type { SectionData } from '@/types/builder.types';
import { ElementRenderer } from './ElementRenderer';
import { SortableComponent } from './SortableComponent';

interface SortableSectionProps {
  section: SectionData;
}

export const SortableSection = ({ section }: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      section,
    },
  });

  // Make section droppable for elements from sidebar
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: `section-drop-${section.id}`,
    data: {
      type: 'section-drop',
      sectionId: section.id,
    },
  });

  // Combine both refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const { selectedElementId, selectElement, deleteSection, updateSection } = useBuilderStore();
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedElementId === section.id;

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection(section.id, { visible: !section.visible });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this section?')) {
      deleteSection(section.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-[#111111] border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? 'border-[#F6C453] ring-2 ring-[#F6C453]/20'
          : isOver
          ? 'border-[#F6C453] ring-2 ring-[#F6C453]/30 bg-[#F6C453]/5'
          : 'border-white/10 hover:border-white/20'
      }`}
      onClick={() => selectElement(section.id)}
    >
      {/* Section Label */}
      <div className="absolute top-0 left-0 bg-[#0A0A0A]/80 text-xs text-gray-400 px-2 py-1 rounded-br z-10">
        Section {section.order + 1}
      </div>

      {/* Section Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 bg-[#0A0A0A] border border-white/10 rounded hover:bg-white/5 text-gray-400 hover:text-white"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleToggleVisibility}
          className="p-1.5 bg-[#0A0A0A] border border-white/10 rounded hover:bg-white/5 text-gray-400 hover:text-white"
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        
        <button
          onClick={handleDelete}
          className="p-1.5 bg-[#0A0A0A] border border-white/10 rounded hover:bg-red-500/10 hover:border-red-500/50 text-gray-400 hover:text-red-500"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Section Content with Component-Level Sorting */}
      <div className={`p-6 ${!section.visible ? 'opacity-50' : ''}`}>
        {section.components.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Empty section - drag elements here
          </div>
        ) : (
          <SortableContext
            items={section.components.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {section.components.map((component) => (
                <SortableComponent key={component.id} component={component} sectionId={section.id}>
                  <ElementRenderer component={component} sectionId={section.id} />
                </SortableComponent>
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};
