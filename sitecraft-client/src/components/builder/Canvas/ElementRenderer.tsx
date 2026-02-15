/**
 * Element Renderer
 * Renders individual components (heading, text, button, etc.)
 */

import { useState, useRef } from 'react';
import { useBuilderStore } from '@/stores/builderStore';
import type { ComponentData } from '@/types/builder.types';
import { InlineEditor } from './InlineEditor';
import { FloatingToolbar } from './FloatingToolbar';
import { ResizeHandles } from './ResizeHandles';

interface ElementRendererProps {
  component: ComponentData;
  sectionId: string;
}

export const ElementRenderer = ({ component, sectionId }: ElementRendererProps) => {
  const { 
    selectedElementId, 
    selectElement, 
    deleteComponent, 
    updateComponent,
    duplicateComponent,
    moveComponentUp,
    moveComponentDown,
    pageData,
    siteBranding,
  } = useBuilderStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isSelected = selectedElementId === component.id;
  
  // Check if component can move up/down
  const section = pageData.sections.find(s => s.id === sectionId);
  const componentIndex = section?.components.findIndex(c => c.id === component.id) ?? -1;
  const canMoveUp = componentIndex > 0;
  const canMoveDown = componentIndex < (section?.components.length ?? 0) - 1;

  // Determine if component supports height resizing
  const allowHeightResize = ['image', 'video', 'button', 'icon'].includes(component.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(component.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Enable inline editing for text elements
    if (component.type === 'heading' || component.type === 'text' || component.type === 'button') {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this element?')) {
      deleteComponent(component.id);
    }
  };

  const handleDuplicate = () => {
    duplicateComponent(component.id);
  };

  const handleMoveUp = () => {
    moveComponentUp(component.id);
  };

  const handleMoveDown = () => {
    moveComponentDown(component.id);
  };

  const handleSaveEdit = (newContent: string) => {
    updateComponent(component.id, { content: newContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleResize = (styleUpdates: Partial<ComponentData['styles']>) => {
    updateComponent(component.id, { 
      styles: { ...component.styles, ...styleUpdates } 
    });
  };

  const handleToggleVisibility = () => {
    updateComponent(component.id, { visible: !component.visible });
  };

  const isVisible = component.visible !== false; // Default to true if undefined

  return (
    <div
      ref={containerRef}
      className={`group relative cursor-pointer transition-all rounded ${
        isSelected 
          ? 'ring-2 ring-[#F6C453] ring-offset-2 ring-offset-[#0A0A0A]' 
          : isHovered 
          ? 'ring-2 ring-blue-500/50' 
          : ''
      } ${!isVisible ? 'opacity-50 border-2 border-dashed border-white/20' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden Badge */}
      {!isVisible && (
        <div className="absolute top-2 left-2 z-10 bg-[#0A0A0A]/90 text-xs text-gray-400 px-2 py-1 rounded">
          Hidden
        </div>
      )}

      {/* Floating Toolbar */}
      {isSelected && !isEditing && (
        <FloatingToolbar
          visible={isVisible}
          onToggleVisibility={handleToggleVisibility}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {/* Resize Handles */}
      {isSelected && !isEditing && (
        <ResizeHandles
          onResize={handleResize}
          containerRef={containerRef}
          allowHeightResize={allowHeightResize}
        />
      )}

      {/* Render component based on type */}
      {renderComponent(component, isEditing, handleSaveEdit, handleCancelEdit, siteBranding)}
    </div>
  );
};

// Helper function to render different component types
function renderComponent(
  component: ComponentData, 
  isEditing: boolean, 
  onSave: (content: string) => void,
  onCancel: () => void,
  siteBranding?: { primaryColor: string; secondaryColor: string; headingFontFamily: string; bodyFontFamily: string } | null
) {
  const { type, content, styles } = component;

  // Apply branding defaults
  const brandingDefaults: React.CSSProperties = {};
  if (siteBranding) {
    if (type === 'heading' && !styles.fontFamily) {
      brandingDefaults.fontFamily = siteBranding.headingFontFamily;
    }
    if ((type === 'text' || type === 'button') && !styles.fontFamily) {
      brandingDefaults.fontFamily = siteBranding.bodyFontFamily;
    }
    if (!styles.color && (type === 'heading' || type === 'text')) {
      brandingDefaults.color = siteBranding.primaryColor;
    }
    if (type === 'button' && !styles.backgroundColor) {
      brandingDefaults.backgroundColor = siteBranding.primaryColor;
      brandingDefaults.color = siteBranding.secondaryColor;
    }
  }

  const commonStyle = {
    ...brandingDefaults,
    ...styles,
    userSelect: isEditing ? ('text' as const) : ('none' as const),
  };

  // Inline editing for text elements
  if (isEditing && (type === 'heading' || type === 'text' || type === 'button')) {
    return (
      <InlineEditor
        initialContent={content}
        onSave={onSave}
        onCancel={onCancel}
        className="min-w-[100px]"
        style={commonStyle}
        tagName={type === 'heading' ? 'h2' : type === 'text' ? 'p' : 'span'}
      />
    );
  }

  switch (type) {
    case 'heading':
      return (
        <h2 style={commonStyle}>
          {content || 'Heading'}
        </h2>
      );
    
    case 'text':
      return (
        <p style={commonStyle}>
          {content || 'Text content'}
        </p>
      );
    
    case 'button':
      return (
        <button
          style={commonStyle}
          onClick={(e) => e.preventDefault()}
        >
          {content || 'Button'}
        </button>
      );
    
    case 'image':
      return component.src ? (
        <img
          src={component.src}
          alt={component.alt || 'Image'}
          style={commonStyle}
        />
      ) : (
        <div
          style={{
            ...commonStyle,
            backgroundColor: '#1A1A1A',
            border: '2px dashed #444',
            padding: '2rem',
            textAlign: 'center',
            color: '#666',
          }}
        >
          No image selected
        </div>
      );
    
    case 'video':
      return component.src ? (
        <video
          src={component.src}
          controls
          style={commonStyle}
        />
      ) : (
        <div
          style={{
            ...commonStyle,
            backgroundColor: '#1A1A1A',
            border: '2px dashed #444',
            padding: '2rem',
            textAlign: 'center',
            color: '#666',
          }}
        >
          No video selected
        </div>
      );
    
    case 'icon':
      return (
        <span style={commonStyle}>
          {content || '⭐'}
        </span>
      );
    
    case 'form':
      return (
        <div style={commonStyle}>
          <input
            type="text"
            placeholder="Form field"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333',
              borderRadius: '0.5rem',
              color: '#FFF',
            }}
            readOnly
          />
        </div>
      );
    
    default:
      return (
        <div style={commonStyle}>
          Unknown component type: {type}
        </div>
      );
  }
}
