import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import type { Menu } from '@/types/navigation.types';

interface MenuCardProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (menuId: string) => void;
  onAddItem: (menuId: string) => void;
  onSelect: (menu: Menu) => void;
  isSelected: boolean;
}

export function MenuCard({
  menu,
  onEdit,
  onDelete,
  onAddItem,
  onSelect,
  isSelected,
}: MenuCardProps) {
  const [showOptions, setShowOptions] = useState(false);

  const visibleItemsCount = menu.items?.filter((item) => item.isVisible).length || 0;
  const totalItemsCount = menu.items?.length || 0;

  return (
    <div
      className={`relative rounded-xl border-2 bg-[#1a1a1a] p-6 cursor-pointer transition-all ${
        isSelected
          ? 'border-[#F6C453] ring-2 ring-[#F6C453]/20'
          : 'border-white/10 hover:border-white/20'
      }`}
      onClick={() => onSelect(menu)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">{menu.name}</h3>
          <span
            className={`inline-block mt-1 px-2 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
              menu.location === 'Header'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}
          >
            {menu.location}
          </span>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showOptions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-xl shadow-lg border border-white/10 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(menu);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-white/5 font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-3" />
                  Edit Menu
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(menu.id);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Menu
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>
            {visibleItemsCount} visible
          </span>
        </div>
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4" />
          <span>
            {totalItemsCount - visibleItemsCount} hidden
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddItem(menu.id);
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-black text-[#0A0A0A] bg-[#F6C453] hover:bg-[#f6d16f] rounded-xl transition-all uppercase tracking-wider"
      >
        <Plus className="w-4 h-4" />
        Add Menu Item
      </button>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Updated {new Date(menu.updatedAt || menu.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
