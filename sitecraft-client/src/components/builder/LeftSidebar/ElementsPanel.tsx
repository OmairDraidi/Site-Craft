/**
 * Elements Panel
 * Draggable basic elements (Text, Image, Button, etc.)
 */

import { Type, Image, MousePointerClick, Video, FileText, Star } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { ComponentType, ComponentStyles } from '@/types/builder.types';

interface ElementDef {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  category: 'basic' | 'media' | 'forms';
  defaultContent: string;
  defaultStyles: ComponentStyles;
}

const ELEMENTS: ElementDef[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: <Type className="w-5 h-5" />,
    category: 'basic',
    defaultContent: 'Your Heading Here',
    defaultStyles: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: '1rem',
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: <FileText className="w-5 h-5" />,
    category: 'basic',
    defaultContent: 'Your text content goes here.',
    defaultStyles: {
      fontSize: '1rem',
      color: '#A1A1A1',
      lineHeight: '1.6',
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: <MousePointerClick className="w-5 h-5" />,
    category: 'basic',
    defaultContent: 'Click Me',
    defaultStyles: {
      backgroundColor: '#F6C453',
      color: '#000000',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: <Image className="w-5 h-5" />,
    category: 'media',
    defaultContent: '',
    defaultStyles: {
      width: '100%',
      maxWidth: '600px',
      borderRadius: '0.5rem',
    },
  },
  {
    type: 'video',
    label: 'Video',
    icon: <Video className="w-5 h-5" />,
    category: 'media',
    defaultContent: '',
    defaultStyles: {
      width: '100%',
      maxWidth: '800px',
      borderRadius: '0.5rem',
    },
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: <Star className="w-5 h-5" />,
    category: 'basic',
    defaultContent: '⭐',
    defaultStyles: {
      fontSize: '2rem',
    },
  },
];

interface DraggableElementProps {
  element: ElementDef;
}

const DraggableElement = ({ element }: DraggableElementProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.type}`,
    data: { element },
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
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#F6C453]/10 text-[#F6C453] rounded">
          {element.icon}
        </div>
        <div>
          <div className="text-white text-sm font-medium">{element.label}</div>
          <div className="text-gray-500 text-xs capitalize">{element.category}</div>
        </div>
      </div>
    </div>
  );
};

export const ElementsPanel = () => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wide">
          Basic Elements
        </h3>
        <div className="space-y-2">
          {ELEMENTS.filter((el) => el.category === 'basic').map((element) => (
            <DraggableElement key={element.type} element={element} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wide">
          Media
        </h3>
        <div className="space-y-2">
          {ELEMENTS.filter((el) => el.category === 'media').map((element) => (
            <DraggableElement key={element.type} element={element} />
          ))}
        </div>
      </div>
    </div>
  );
};
