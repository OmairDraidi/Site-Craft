import { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useTemplateStore } from '@/stores/useTemplateStore';
import { TemplateCard } from '@/components/templates/TemplateCard';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ isOpen, onClose, onSelect }: TemplateSelectorProps) => {
  const { templates, isLoading, fetchTemplates } = useTemplateStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && templates.length === 0) {
      fetchTemplates();
    }
  }, [isOpen, templates.length, fetchTemplates]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-white/10 rounded-[2.5rem] p-8 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#F6C453] uppercase tracking-tight">
            Choose Template
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#F6C453]/30 focus:outline-none"
          />
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-500 py-12">Loading templates...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => onSelect(template.id)} className="cursor-pointer">
                  <TemplateCard template={template} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
