/**
 * Empty Canvas State
 * Displayed when no sections exist
 */

import { useDroppable } from '@dnd-kit/core';

export const EmptyCanvas = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'empty-canvas-drop-zone',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`text-center max-w-md transition-all ${
        isOver ? 'scale-105' : ''
      }`}
    >
      <div className="mb-6">
        <svg
          className={`w-24 h-24 mx-auto transition-colors ${
            isOver ? 'text-[#F6C453]' : 'text-gray-700'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {isOver ? 'Drop here to add' : 'Start Building Your Page'}
      </h3>
      <p className="text-gray-500 mb-6">
        Drag elements or sections from the left panel to begin creating your page.
      </p>
      
      <div className="bg-[#111111] border border-white/10 rounded-lg p-4 text-left">
        <h4 className="text-sm font-bold text-[#F6C453] mb-2">Quick Tips:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Drag elements like Text, Image, Button</li>
          <li>• Use pre-built sections for faster setup</li>
          <li>• Click any element to edit its properties</li>
          <li>• Press Ctrl+Z to undo, Ctrl+Y to redo</li>
        </ul>
      </div>
    </div>
  );
};
