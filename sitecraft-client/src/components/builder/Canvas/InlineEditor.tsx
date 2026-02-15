/**
 * Inline Editor
 * ContentEditable component for direct text editing on canvas
 */

import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

interface InlineEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  className?: string;
  style?: React.CSSProperties;
  tagName?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const InlineEditor = ({
  initialContent,
  onSave,
  onCancel,
  className = '',
  style = {},
  tagName = 'div',
}: InlineEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus and select all text
    if (editorRef.current) {
      editorRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save on Enter (without shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }

      // Cancel on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const handleSave = () => {
    const trimmedContent = content.trim();
    if (trimmedContent && trimmedContent !== initialContent) {
      onSave(trimmedContent);
    } else {
      onCancel();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.textContent || '');
  };

  const handleBlur = () => {
    // Auto-save on blur
    handleSave();
  };

  const Tag = tagName as any;

  return (
    <div className="relative group">
      <Tag
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        className={`outline-none focus:ring-2 focus:ring-[#F6C453]/50 rounded px-1 ${className}`}
        style={style}
      >
        {initialContent}
      </Tag>

      {/* Action Buttons */}
      <div className="absolute -top-8 left-0 flex items-center gap-1 bg-[#0A0A0A] border border-white/10 rounded shadow-lg px-1 py-1 opacity-100 pointer-events-auto z-50">
        <button
          onClick={handleSave}
          className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          title="Save (Enter)"
          type="button"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Cancel (Esc)"
          type="button"
        >
          <X className="w-3 h-3" />
        </button>
        <span className="text-xs text-gray-400 px-2 border-l border-white/10">
          Enter to save, Esc to cancel
        </span>
      </div>
    </div>
  );
};
