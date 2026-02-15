/**
 * Alignment Guides
 * Visual snap guides shown during dragging to align elements
 */

import { useEffect, useState } from 'react';

interface AlignmentLine {
  type: 'vertical' | 'horizontal';
  position: number;
}

interface AlignmentGuidesProps {
  activeElementRect?: DOMRect | null;
  containerRef: React.RefObject<HTMLElement>;
}

export const AlignmentGuides = ({ activeElementRect, containerRef }: AlignmentGuidesProps) => {
  const [guides, setGuides] = useState<AlignmentLine[]>([]);

  useEffect(() => {
    if (!activeElementRect || !containerRef.current) {
      setGuides([]);
      return;
    }

    const threshold = 5; // 5px snap threshold
    const newGuides: AlignmentLine[] = [];
    const container = containerRef.current;
    
    // Get all sections and components in the canvas
    const elements = container.querySelectorAll('[data-component-id], [data-section-id]');
    
    const activeCenterX = activeElementRect.left + activeElementRect.width / 2;
    const activeCenterY = activeElementRect.top + activeElementRect.height / 2;
    const activeLeft = activeElementRect.left;
    const activeRight = activeElementRect.right;
    const activeTop = activeElementRect.top;
    const activeBottom = activeElementRect.bottom;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Check center-X alignment
      if (Math.abs(activeCenterX - centerX) < threshold) {
        newGuides.push({
          type: 'vertical',
          position: centerX,
        });
      }

      // Check left edge alignment
      if (Math.abs(activeLeft - rect.left) < threshold) {
        newGuides.push({
          type: 'vertical',
          position: rect.left,
        });
      }

      // Check right edge alignment
      if (Math.abs(activeRight - rect.right) < threshold) {
        newGuides.push({
          type: 'vertical',
          position: rect.right,
        });
      }

      // Check center-Y alignment
      if (Math.abs(activeCenterY - centerY) < threshold) {
        newGuides.push({
          type: 'horizontal',
          position: centerY,
        });
      }

      // Check top edge alignment
      if (Math.abs(activeTop - rect.top) < threshold) {
        newGuides.push({
          type: 'horizontal',
          position: rect.top,
        });
      }

      // Check bottom edge alignment
      if (Math.abs(activeBottom - rect.bottom) < threshold) {
        newGuides.push({
          type: 'horizontal',
          position: rect.bottom,
        });
      }
    });

    // Remove duplicate guides
    const uniqueGuides = newGuides.filter(
      (guide, index, self) =>
        index === self.findIndex((g) => g.type === guide.type && g.position === guide.position)
    );

    setGuides(uniqueGuides);
  }, [activeElementRect, containerRef]);

  if (guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        {guides.map((guide, index) => {
          if (guide.type === 'vertical') {
            return (
              <line
                key={`v-${index}`}
                x1={guide.position}
                y1={0}
                x2={guide.position}
                y2="100%"
                stroke="#F6C453"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            );
          } else {
            return (
              <line
                key={`h-${index}`}
                x1={0}
                y1={guide.position}
                x2="100%"
                y2={guide.position}
                stroke="#F6C453"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            );
          }
        })}
      </svg>
    </div>
  );
};
