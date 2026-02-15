import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { MenuItem } from '@/types/navigation.types';

interface SortableMenuItemProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleVisibility: (itemId: string) => void;
  depth?: number;
}

export function SortableMenuItem({
  item,
  onEdit,
  onDelete,
  onToggleVisibility,
  depth = 0,
}: SortableMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'menu-item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const indentStyle = { marginLeft: `${depth * 32}px` };

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ ...style, ...indentStyle }}
        className={`group flex items-center gap-3 p-3 bg-[#1a1a1a] border border-white/10 rounded-xl hover:border-white/20 transition-all ${
          isDragging ? 'shadow-lg z-50 ring-2 ring-[#F6C453]/50' : ''
        } ${!item.isVisible ? 'opacity-60' : ''}`}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-500" />
        </button>

        {/* Expand/Collapse for nested items */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/5 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Item Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-white truncate uppercase tracking-tight text-sm">
              {item.label}
            </span>
            {item.target === '_blank' && (
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                New Tab
              </span>
            )}
            {depth > 0 && (
              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                Child
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{item.url}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleVisibility(item.id)}
            className="p-2 hover:bg-white/5 rounded transition-colors"
            title={item.isVisible ? 'Hide item' : 'Show item'}
          >
            {item.isVisible ? (
              <Eye className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-white/5 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-500/10 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-2">
          {item.children!.map((child) => (
            <SortableMenuItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}
