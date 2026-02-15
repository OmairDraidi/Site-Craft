/**
 * Left Sidebar
 * Contains ElementsPanel and SectionsPanel tabs
 */

import { useState } from 'react';
import { ElementsPanel } from './ElementsPanel';
import { SectionsPanel } from './SectionsPanel';

type Tab = 'elements' | 'sections';

export const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>('elements');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'elements'
              ? 'text-[#F6C453] border-b-2 border-[#F6C453]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Elements
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'sections'
              ? 'text-[#F6C453] border-b-2 border-[#F6C453]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sections
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && <ElementsPanel />}
        {activeTab === 'sections' && <SectionsPanel />}
      </div>
    </div>
  );
};
