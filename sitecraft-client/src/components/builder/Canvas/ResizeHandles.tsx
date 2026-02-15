/**
 * Resize Handles
 * Interactive handles for resizing components
 */

import { useState, useRef, useEffect } from 'react';
import type { ComponentStyles } from '@/types/builder.types';

interface ResizeHandlesProps {
  onResize: (updates: Partial<ComponentStyles>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  allowHeightResize?: boolean; // For images, videos, buttons. Text/heading are width-only
}

type ResizeDirection =
  | 'nw' | 'n' | 'ne'
  | 'w' | 'e'
  | 'sw' | 's' | 'se';

export const ResizeHandles = ({ 
  onResize, 
  containerRef,
  allowHeightResize = true,
}: ResizeHandlesProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [direction, setDirection] = useState<ResizeDirection | null>(null);
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isResizing || !direction || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      
      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;

      // Calculate new dimensions based on direction
      if (direction.includes('e')) {
        newWidth = Math.max(50, startSizeRef.current.width + deltaX);
      }
      if (direction.includes('w')) {
        newWidth = Math.max(50, startSizeRef.current.width - deltaX);
      }
      if (direction.includes('s') && allowHeightResize) {
        newHeight = Math.max(20, startSizeRef.current.height + deltaY);
      }
      if (direction.includes('n') && allowHeightResize) {
        newHeight = Math.max(20, startSizeRef.current.height - deltaY);
      }

      // Maintain aspect ratio if Shift is pressed
      if (e.shiftKey && allowHeightResize) {
        const aspectRatio = startSizeRef.current.width / startSizeRef.current.height;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      const updates: Partial<ComponentStyles> = {
        width: `${Math.round(newWidth)}px`,
      };

      if (allowHeightResize) {
        updates.height = `${Math.round(newHeight)}px`;
      }

      onResize(updates);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, direction, onResize, allowHeightResize, containerRef]);

  const handleMouseDown = (dir: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!containerRef.current) return;

    const element = containerRef.current;
    const rect = element.getBoundingClientRect();

    setIsResizing(true);
    setDirection(dir);
    startSizeRef.current = {
      width: rect.width,
      height: rect.height,
    };
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleStyle = "absolute w-2 h-2 bg-[#F6C453] border border-white/20 rounded-sm hover:scale-150 transition-transform z-10";

  const handles: Array<{ dir: ResizeDirection; cursor: string; className: string }> = [
    { dir: 'nw', cursor: 'nw-resize', className: '-top-1 -left-1' },
    { dir: 'n', cursor: 'n-resize', className: '-top-1 left-1/2 -translate-x-1/2' },
    { dir: 'ne', cursor: 'ne-resize', className: '-top-1 -right-1' },
    { dir: 'w', cursor: 'w-resize', className: 'top-1/2 -translate-y-1/2 -left-1' },
    { dir: 'e', cursor: 'e-resize', className: 'top-1/2 -translate-y-1/2 -right-1' },
    { dir: 'sw', cursor: 'sw-resize', className: '-bottom-1 -left-1' },
    { dir: 's', cursor: 's-resize', className: '-bottom-1 left-1/2 -translate-x-1/2' },
    { dir: 'se', cursor: 'se-resize', className: '-bottom-1 -right-1' },
  ];

  return (
    <>
      {handles.map((handle) => {
        // Skip height-related handles if height resize is not allowed
        if (!allowHeightResize && ['n', 'nw', 'ne', 's', 'sw', 'se'].includes(handle.dir)) {
          return null;
        }

        return (
          <div
            key={handle.dir}
            className={`${handleStyle} ${handle.className}`}
            style={{ cursor: handle.cursor }}
            onMouseDown={handleMouseDown(handle.dir)}
          />
        );
      })}
    </>
  );
};
