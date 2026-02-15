/**
 * Toolbar
 * Top toolbar with page title, save, publish, preview, and device switcher
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
} from 'lucide-react';
import { useBuilderStore } from '@/stores/builderStore';
import { pageService } from '@/services/page.service';
import type { DeviceMode } from '@/types/builder.types';

export const Toolbar = () => {
  const navigate = useNavigate();

  const {
    pageId,
    isDirty,
    saveStatus,
    deviceMode,
    canUndo,
    canRedo,
    undo,
    redo,
    save,
    setDeviceMode,
    isPreviewMode,
    togglePreview,
    pageData,
  } = useBuilderStore();

  const [isPublishing, setIsPublishing] = useState(false);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      save();
      toast.info('Changes auto-saved');
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isDirty, save]);

  const handleSave = async () => {
    await save();
    toast.success('Page saved successfully');
  };

  const handlePublish = async () => {
    if (!pageId) return;

    try {
      setIsPublishing(true);

      // Save first
      if (isDirty) {
        await save();
      }

      // Then publish
      await pageService.publishPage(pageId);
      toast.success('Page published successfully');
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('Failed to publish page');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDevice = (mode: DeviceMode) => {
    setDeviceMode(mode);
  };

  if (isPreviewMode) {
    return (
      <div className="h-16 bg-[#111111] border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => togglePreview()}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            Exit Preview
          </button>
        </div>

        {/* Device Switcher in Preview */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] rounded-lg p-1">
          <button
            onClick={() => handleDevice('desktop')}
            className={`p-2 rounded transition-colors ${deviceMode === 'desktop'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDevice('tablet')}
            className={`p-2 rounded transition-colors ${deviceMode === 'tablet'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDevice('mobile')}
            className={`p-2 rounded transition-colors ${deviceMode === 'mobile'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="w-[100px]" /> {/* Spacer for balance */}
      </div>
    );
  }

  return (
    <div className="h-16 bg-[#111111] border-b border-white/10 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          title="Back to Projects"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Section - Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">Page Builder</span>
        {saveStatus === 'saving' && (
          <span className="text-xs text-gray-500">Saving...</span>
        )}
        {saveStatus === 'saved' && !isDirty && (
          <span className="text-xs text-green-500">Saved</span>
        )}
        {saveStatus === 'unsaved' && isDirty && (
          <span className="text-xs text-yellow-500">Unsaved changes</span>
        )}
        {saveStatus === 'error' && (
          <span className="text-xs text-red-500">Save failed</span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] rounded-lg p-1">
          <button
            onClick={() => handleDevice('desktop')}
            className={`p-2 rounded transition-colors ${deviceMode === 'desktop'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDevice('tablet')}
            className={`p-2 rounded transition-colors ${deviceMode === 'tablet'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDevice('mobile')}
            className={`p-2 rounded transition-colors ${deviceMode === 'mobile'
              ? 'bg-[#F6C453] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Actions */}
        <button
          onClick={handleSave}
          disabled={!isDirty || saveStatus === 'saving'}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        {pageData.siteId && (
          <button
            onClick={() => navigate(`/settings/branding/${pageData.siteId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
            title="Site Branding & Settings"
          >
            <Settings className="w-4 h-4" />
            Branding
          </button>
        )}

        <button
          onClick={() => togglePreview()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
          title="Preview Mode"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-4 py-2 bg-[#F6C453] hover:bg-[#F6C453]/90 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
        >
          <Globe className="w-4 h-4" />
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
};
