/**
 * Right Sidebar - Properties & SEO Panel
 * Shows tabs for editing element properties and page SEO metadata
 */

import { useState } from 'react';
import { Settings2, Search } from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { PropertiesPanel } from './PropertiesPanel';
import { SectionPropertiesPanel } from './SectionPropertiesPanel';
import { SEOPanel } from './SEOPanel';

type Tab = 'properties' | 'seo';

export const RightSidebar = () => {
  const { selectedElementId, pageData } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<Tab>('properties');

  // Find selected element
  let selectedComponent = null;
  let selectedSection = null;

  if (selectedElementId) {
    // Check if it's a section
    selectedSection = pageData.sections.find((s) => s.id === selectedElementId);

    // If not a section, search for component
    if (!selectedSection) {
      for (const section of pageData.sections) {
        const found = section.components.find((c) => c.id === selectedElementId);
        if (found) {
          selectedComponent = found;
          break;
        }
      }
    }
  }

  const tabs = [
    { id: 'properties' as Tab, label: 'Design', icon: Settings2 },
    { id: 'seo' as Tab, label: 'SEO', icon: Search },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === tab.id
                ? 'text-[#F6C453] border-b-2 border-[#F6C453] bg-[#F6C453]/5'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && (
          <>
            {!selectedElementId ? (
              <div className="text-center text-gray-500 text-sm py-8">
                Select an element to edit its properties
              </div>
            ) : selectedComponent ? (
              <PropertiesPanel component={selectedComponent} />
            ) : selectedSection ? (
              <SectionPropertiesPanel section={selectedSection} />
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                Element not found
              </div>
            )}
          </>
        )}

        {activeTab === 'seo' && <SEOPanel />}
      </div>
    </div>
  );
};
