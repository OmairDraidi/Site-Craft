/**
 * Sortable Component
 * Wrapper for draggable/sortable components within a section
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ComponentData } from '@/types/builder.types';

interface SortableComponentProps {
  component: ComponentData;
  sectionId: string;
  children: React.ReactNode;
}

export const SortableComponent = ({ component, sectionId, children }: SortableComponentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.id,
    data: {
      type: 'component',
      component,
      sectionId, // Track which section this component belongs to
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-component-id={component.id}
      className="group relative"
    >
      {/* Dedicated drag handle - only visible on hover */}
      <div
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full px-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-white/40 hover:text-white/60" />
      </div>
      {children}
    </div>
  );
};
