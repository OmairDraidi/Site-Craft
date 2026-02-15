import { useState, useEffect } from 'react';
import { X, ExternalLink, FileText, Link as LinkIcon } from 'lucide-react';
import { pageService } from '@/services/page.service';
import type { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '@/types/navigation.types';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMenuItemRequest | UpdateMenuItemRequest) => void;
  menuId: string;
  siteId: string;
  item?: MenuItem;
  parentItems?: MenuItem[];
}

type LinkType = 'internal' | 'external' | 'custom';

export function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  menuId,
  siteId,
  item,
  parentItems = [],
}: MenuItemModalProps) {
  const [label, setLabel] = useState('');
  const [linkType, setLinkType] = useState<LinkType>('internal');
  const [url, setUrl] = useState('');
  const [selectedPageId, setSelectedPageId] = useState('');
  const [target, setTarget] = useState<'_self' | '_blank'>('_self');
  const [parentId, setParentId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [pages, setPages] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Load pages for internal links
  useEffect(() => {
    if (isOpen && siteId) {
      loadPages();
    }
  }, [isOpen, siteId]);

  // Populate form when editing
  useEffect(() => {
    if (item) {
      setLabel(item.label);
      setUrl(item.url);
      setTarget(item.target);
      setParentId(item.parentId || '');
      setIsVisible(item.isVisible);

      // Determine link type
      if (item.url.startsWith('http://') || item.url.startsWith('https://')) {
        setLinkType('external');
      } else if (item.url.startsWith('/')) {
        setLinkType('internal');
        // Try to find matching page
        const matchingPage = pages.find((p) => `/${p.slug}` === item.url);
        if (matchingPage) {
          setSelectedPageId(matchingPage.id);
        }
      } else {
        setLinkType('custom');
      }
    } else {
      resetForm();
    }
  }, [item, pages]);

  const loadPages = async () => {
    setIsLoadingPages(true);
    try {
      const pagesData = await pageService.getPagesBySite(siteId);
      setPages(pagesData.map((p) => ({ id: p.id, title: p.title, slug: p.slug })));
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const resetForm = () => {
    setLabel('');
    setLinkType('internal');
    setUrl('');
    setSelectedPageId('');
    setTarget('_self');
    setParentId('');
    setIsVisible(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalUrl = url;

    // Build URL based on link type
    if (linkType === 'internal' && selectedPageId) {
      const selectedPage = pages.find((p) => p.id === selectedPageId);
      finalUrl = selectedPage ? `/${selectedPage.slug}` : '/';
    } else if (linkType === 'external' && url && !url.startsWith('http')) {
      finalUrl = `https://${url}`;
    }

    const data = {
      menuId,
      label,
      url: finalUrl,
      target,
      parentId: parentId || undefined,
      isVisible,
    };

    onSave(data);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111111] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Label */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Label *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Home, About Us, Contact"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F6C453] focus:border-transparent"
              required
            />
          </div>

          {/* Link Type */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Link Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLinkType('internal')}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                  linkType === 'internal'
                    ? 'border-[#F6C453] bg-[#F6C453]/10 text-[#F6C453]'
                    : 'border-white/10 hover:border-white/20 text-gray-400'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-bold">Page</span>
              </button>
              <button
                type="button"
                onClick={() => setLinkType('external')}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                  linkType === 'external'
                    ? 'border-[#F6C453] bg-[#F6C453]/10 text-[#F6C453]'
                    : 'border-white/10 hover:border-white/20 text-gray-400'
                }`}
              >
                <ExternalLink className="w-6 h-6" />
                <span className="text-sm font-bold">External</span>
              </button>
              <button
                type="button"
                onClick={() => setLinkType('custom')}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                  linkType === 'custom'
                    ? 'border-[#F6C453] bg-[#F6C453]/10 text-[#F6C453]'
                    : 'border-white/10 hover:border-white/20 text-gray-400'
                }`}
              >
                <LinkIcon className="w-6 h-6" />
                <span className="text-sm font-bold">Custom</span>
              </button>
            </div>
          </div>

          {/* Link Destination */}
          {linkType === 'internal' && (
            <div>
              <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
                Select Page *
              </label>
              {isLoadingPages ? (
                <div className="text-sm text-gray-400">Loading pages...</div>
              ) : (
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#F6C453] focus:border-transparent"
                  required
                >
                  <option value="" className="bg-[#1a1a1a]">Choose a page...</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id} className="bg-[#1a1a1a]">
                      {page.title} (/{page.slug})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {(linkType === 'external' || linkType === 'custom') && (
            <div>
              <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
                URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  linkType === 'external'
                    ? 'https://example.com'
                    : '/custom-path or #section'
                }
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F6C453] focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Parent Item (for nested menus) */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Parent Item (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#F6C453] focus:border-transparent"
            >
              <option value="" className="bg-[#1a1a1a]">None (Top Level)</option>
              {parentItems
                .filter((p) => p.id !== item?.id) // Don't allow self-parenting
                .map((parent) => (
                  <option key={parent.id} value={parent.id} className="bg-[#1a1a1a]">
                    {parent.label}
                  </option>
                ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select a parent to create a dropdown menu
            </p>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Open Link In
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="_self"
                  checked={target === '_self'}
                  onChange={(e) => setTarget(e.target.value as '_self' | '_blank')}
                  className="w-4 h-4 text-[#F6C453] bg-[#1a1a1a] border-white/10"
                />
                <span className="text-sm text-white">Same Tab</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="_blank"
                  checked={target === '_blank'}
                  onChange={(e) => setTarget(e.target.value as '_self' | '_blank')}
                  className="w-4 h-4 text-[#F6C453] bg-[#1a1a1a] border-white/10"
                />
                <span className="text-sm text-white">New Tab</span>
              </label>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visibility"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="w-4 h-4 text-[#F6C453] bg-[#1a1a1a] border-white/10 rounded"
            />
            <label htmlFor="visibility" className="text-sm font-medium text-white">
              Visible in navigation
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F6C453] text-[#0A0A0A] rounded-xl hover:bg-[#f6d16f] transition-all font-black uppercase tracking-wider text-sm"
            >
              {item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
