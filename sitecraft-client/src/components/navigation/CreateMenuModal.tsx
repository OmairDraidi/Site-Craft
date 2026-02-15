import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateMenuRequest, UpdateMenuRequest, Menu } from '@/types/navigation.types';

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMenuRequest | UpdateMenuRequest) => void;
  siteId: string;
  menu?: Menu;
}

export function CreateMenuModal({
  isOpen,
  onClose,
  onSave,
  siteId,
  menu,
}: CreateMenuModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState<'Header' | 'Footer'>('Header');

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setLocation(menu.location);
    } else {
      setName('');
      setLocation('Header');
    }
  }, [menu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (menu) {
      onSave({ name, location });
    } else {
      onSave({ siteId, name, location });
    }

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setLocation('Header');
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
      <div className="relative bg-[#111111] rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-white/10">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            {menu ? 'Edit Menu' : 'Create New Menu'}
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
          {/* Menu Name */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Menu Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Navigation, Footer Links"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F6C453] focus:border-transparent"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-black text-white mb-2 uppercase tracking-wider">
              Location *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLocation('Header')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  location === 'Header'
                    ? 'border-[#F6C453] bg-[#F6C453]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-lg font-black mb-1 uppercase tracking-tight ${
                      location === 'Header' ? 'text-[#F6C453]' : 'text-white'
                    }`}
                  >
                    Header
                  </div>
                  <div className="text-xs text-gray-400">Top of the page</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setLocation('Footer')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  location === 'Footer'
                    ? 'border-[#F6C453] bg-[#F6C453]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-lg font-black mb-1 uppercase tracking-tight ${
                      location === 'Footer' ? 'text-[#F6C453]' : 'text-white'
                    }`}
                  >
                    Footer
                  </div>
                  <div className="text-xs text-gray-400">Bottom of the page</div>
                </div>
              </button>
            </div>
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
              {menu ? 'Update Menu' : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
