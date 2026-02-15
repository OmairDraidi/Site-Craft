/**
 * Floating Toolbar
 * Action toolbar that appears above selected components
 */

import { Copy, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface FloatingToolbarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const FloatingToolbar = ({
  visible = true,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: FloatingToolbarProps) => {
  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-[#0A0A0A] border border-[#F6C453]/30 rounded-lg shadow-lg px-1 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Move Up */}
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Move up (in section)"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Move Down */}
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title="Move down (in section)"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-white/10" />

      {/* Visibility Toggle */}
      {onToggleVisibility && (
        <>
          <button
            onClick={onToggleVisibility}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title={visible ? 'Hide component' : 'Show component'}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {/* Divider */}
          <div className="w-px h-4 bg-white/10" />
        </>
      )}

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-1.5 text-gray-400 hover:text-[#F6C453] hover:bg-[#F6C453]/10 rounded transition-colors"
        title="Duplicate (Ctrl+D)"
      >
        <Copy className="w-4 h-4" />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
        title="Delete (Del)"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
