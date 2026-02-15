import { useEffect, useState } from 'react';
import { Plus, Menu as MenuIcon, Loader2, FolderOpen, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useNavigationStore } from '@/stores/useNavigationStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { MenuCard } from '@/components/navigation/MenuCard';
import { MenuItemsList } from '@/components/navigation/MenuItemsList';
import { CreateMenuModal } from '@/components/navigation/CreateMenuModal';
import { MenuItemModal } from '@/components/navigation/MenuItemModal';
import type {
  Menu,
  MenuItem,
  CreateMenuRequest,
  UpdateMenuRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '@/types/navigation.types';

export function NavigationPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { selectedProject, projects, fetchProjects, fetchProjectById } = useProjectStore();
  const siteId = selectedProject?.siteId;
  const {
    menus,
    selectedMenu,
    isLoading,
    error,
    fetchMenus,
    fetchMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderItems,
    clearSelectedMenu,
    clearError,
  } = useNavigationStore();

  const [isCreateMenuModalOpen, setIsCreateMenuModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | undefined>();
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | undefined>();
  const [activeTab, setActiveTab] = useState<'Header' | 'Footer'>('Header');

  // Load project from URL and fetch menus
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      // Load projects if not already loaded
      if (projects.length === 0) {
        await fetchProjects();
      }
      
      // Fetch full project details (includes siteId)
      await fetchProjectById(projectId);
    };
    
    loadProject();
  }, [projectId, projects.length]);

  // Fetch menus when selectedProject changes
  useEffect(() => {
    if (selectedProject?.siteId) {
      fetchMenus(selectedProject.siteId);
    }
  }, [selectedProject?.siteId]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateMenu = async (data: CreateMenuRequest | UpdateMenuRequest) => {
    try {
      if (editingMenu) {
        await updateMenu(editingMenu.id, data as UpdateMenuRequest);
        toast.success('Menu updated successfully');
      } else {
        await createMenu(data as CreateMenuRequest);
        toast.success('Menu created successfully');
      }
      setEditingMenu(undefined);
    } catch (error) {
      toast.error('Failed to save menu');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu? All menu items will be removed.')) {
      return;
    }

    try {
      await deleteMenu(menuId);
      toast.success('Menu deleted successfully');
      clearSelectedMenu();
    } catch (error) {
      toast.error('Failed to delete menu');
    }
  };

  const handleSelectMenu = (menu: Menu) => {
    fetchMenuById(menu.id);
  };

  const handleAddMenuItem = (menuId: string) => {
    if (selectedMenu?.id !== menuId) {
      const menu = menus.find((m) => m.id === menuId);
      if (menu) {
        // Need to fetch full menu details first
        fetchMenuById(menuId).then(() => {
          setIsMenuItemModalOpen(true);
        });
      }
    } else {
      setIsMenuItemModalOpen(true);
    }
  };

  const handleSaveMenuItem = async (
    data: CreateMenuItemRequest | UpdateMenuItemRequest
  ) => {
    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, data as UpdateMenuItemRequest);
        toast.success('Menu item updated successfully');
      } else {
        await createMenuItem(data as CreateMenuItemRequest);
        toast.success('Menu item added successfully');
      }
      setEditingMenuItem(undefined);

      // Refresh menu to show updated items
      if (selectedMenu) {
        fetchMenuById(selectedMenu.id);
      }
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully');

      // Refresh menu
      if (selectedMenu) {
        fetchMenuById(selectedMenu.id);
      }
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleToggleItemVisibility = async (itemId: string) => {
    if (!selectedMenu) return;

    const item = findMenuItem(selectedMenu.items, itemId);
    if (!item) return;

    try {
      await updateMenuItem(itemId, { isVisible: !item.isVisible });
      toast.success(item.isVisible ? 'Item hidden' : 'Item shown');

      // Refresh menu
      fetchMenuById(selectedMenu.id);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleReorderItems = async (items: MenuItem[]) => {
    if (!selectedMenu) return;

    try {
      const reorderData = {
        items: items.map((item, index) => ({
          id: item.id,
          newOrder: index,
          newParentId: item.parentId,
        })),
      };

      await reorderItems(selectedMenu.id, reorderData);
      toast.success('Menu items reordered');
    } catch (error) {
      toast.error('Failed to reorder items');
    }
  };

  const findMenuItem = (items: MenuItem[], id: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findMenuItem(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const filteredMenus = menus.filter((menu) => menu.location === activeTab);
  const headerMenus = menus.filter((m) => m.location === 'Header');
  const footerMenus = menus.filter((m) => m.location === 'Footer');

  if (!siteId) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F6C453]/20 rounded-full mb-4">
              <FolderOpen className="w-8 h-8 text-[#F6C453]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
              Select a Project
            </h2>
            <p className="text-gray-400">
              Choose a project to manage its navigation menus
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="bg-[#111111] border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center">
              <p className="text-gray-400 mb-6">
                You don't have any projects yet
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="px-6 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-colors uppercase tracking-wide"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="group bg-[#111111] border-2 border-white/10 rounded-[2rem] p-6 hover:border-[#F6C453] hover:shadow-[0_0_30px_rgba(246,196,83,0.2)] transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white group-hover:text-[#F6C453] transition-colors uppercase tracking-tight">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#F6C453] group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {project.templateName && (
                      <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded font-medium">
                        {project.templateName}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold ${
                        project.status === 'Published'
                          ? 'bg-green-500/20 text-green-400'
                          : project.status === 'Active'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/projects')}
              className="text-[#F6C453] hover:text-[#f6d16f] font-black uppercase tracking-wider text-sm"
            >
              View All Projects →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
              Navigation Builder
            </h1>
            <p className="text-gray-400">
              Create and manage menus for your site
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMenu(undefined);
              setIsCreateMenuModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#F6C453] text-[#0A0A0A] rounded-xl hover:bg-[#f6d16f] transition-all font-black uppercase tracking-wider text-sm"
          >
            <Plus className="w-5 h-5" />
            Create Menu
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveTab('Header')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-wider text-xs ${
              activeTab === 'Header'
                ? 'bg-[#F6C453] text-[#0A0A0A]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <MenuIcon className="w-4 h-4" />
            Header Menus
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                activeTab === 'Header'
                  ? 'bg-[#0A0A0A] text-[#F6C453]'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              {headerMenus.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('Footer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-wider text-xs ${
              activeTab === 'Footer'
                ? 'bg-[#F6C453] text-[#0A0A0A]'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <MenuIcon className="w-4 h-4" />
            Footer Menus
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                activeTab === 'Footer'
                  ? 'bg-[#0A0A0A] text-[#F6C453]'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              {footerMenus.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="w-8 h-8 text-[#F6C453] animate-spin" />
          </div>
        ) : (
          <>
            {/* Left: Menus List */}
            <div className="w-80 border-r border-white/10 bg-[#111111] overflow-y-auto p-6 min-h-full">
              <h2 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-wider">
                {activeTab} Menus
              </h2>

              {filteredMenus.length === 0 ? (
                <div className="text-center py-12">
                  <MenuIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No menus yet</p>
                  <button
                    onClick={() => setIsCreateMenuModalOpen(true)}
                    className="text-[#F6C453] hover:text-[#f6d16f] font-black uppercase tracking-wider text-sm"
                  >
                    Create your first menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMenus.map((menuItem) => (
                    <MenuCard
                      key={menuItem.id}
                      menu={menuItem as any}
                      onEdit={(m) => {
                        setEditingMenu(m);
                        setIsCreateMenuModalOpen(true);
                      }}
                      onDelete={handleDeleteMenu}
                      onAddItem={handleAddMenuItem}
                      onSelect={handleSelectMenu}
                      isSelected={selectedMenu?.id === menuItem.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Menu Items */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#0A0A0A] min-h-full">
              {selectedMenu ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {selectedMenu.name}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Drag items to reorder, click to edit
                      </p>
                    </div>
                  </div>

                  <MenuItemsList
                    items={selectedMenu.items || []}
                    onReorder={handleReorderItems}
                    onEdit={(item) => {
                      setEditingMenuItem(item);
                      setIsMenuItemModalOpen(true);
                    }}
                    onDelete={handleDeleteMenuItem}
                    onToggleVisibility={handleToggleItemVisibility}
                    onAddItem={() => setIsMenuItemModalOpen(true)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MenuIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                      Select a menu
                    </h3>
                    <p className="text-gray-400">
                      Choose a menu from the left to manage its items
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateMenuModal
        isOpen={isCreateMenuModalOpen}
        onClose={() => {
          setIsCreateMenuModalOpen(false);
          setEditingMenu(undefined);
        }}
        onSave={handleCreateMenu}
        siteId={siteId!}
        menu={editingMenu}
      />

      {selectedMenu && (
        <MenuItemModal
          isOpen={isMenuItemModalOpen}
          onClose={() => {
            setIsMenuItemModalOpen(false);
            setEditingMenuItem(undefined);
          }}
          onSave={handleSaveMenuItem}
          menuId={selectedMenu.id}
          siteId={siteId!}
          item={editingMenuItem}
          parentItems={selectedMenu.items || []}
        />
      )}
    </div>
  );
}
