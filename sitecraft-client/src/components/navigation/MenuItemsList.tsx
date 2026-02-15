import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { SortableMenuItem } from './SortableMenuItem';
import type { MenuItem } from '@/types/navigation.types';

interface MenuItemsListProps {
  items: MenuItem[];
  onReorder: (items: MenuItem[]) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onToggleVisibility: (itemId: string) => void;
  onAddItem: () => void;
}

export function MenuItemsList({
  items,
  onReorder,
  onEdit,
  onDelete,
  onToggleVisibility,
  onAddItem,
}: MenuItemsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newItems = [...items];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    // Update order property
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    onReorder(reorderedItems);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/10 rounded-xl">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
          No menu items yet
        </h3>
        <p className="text-gray-400 text-center mb-6 max-w-sm">
          Create your first menu item to start building your navigation
        </p>
        <button
          onClick={onAddItem}
          className="px-6 py-3 bg-[#F6C453] text-[#0A0A0A] rounded-xl hover:bg-[#f6d16f] transition-all font-black uppercase tracking-wider text-sm"
        >
          Add First Item
        </button>
      </div>
    );
  }

  // Get only top-level items (items without parent)
  const topLevelItems = items.filter((item) => !item.parentId);

  // Build tree structure for nested items
  const buildTree = (parentId?: string): MenuItem[] => {
    return items
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        children: buildTree(item.id),
      }));
  };

  const treeItems = buildTree(undefined);

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={topLevelItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {treeItems.map((item) => (
              <SortableMenuItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleVisibility={onToggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Item Button */}
      <button
        onClick={onAddItem}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-white bg-white/5 border-2 border-dashed border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all uppercase tracking-wider"
      >
        <Plus className="w-5 h-5" />
        Add Menu Item
      </button>
    </div>
  );
}
