import { useState, useEffect } from 'react';
import { X, Eye, Globe, ExternalLink } from 'lucide-react';
import type { Page } from '@/types/builder.types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  projectName: string;
}

export function PreviewModal({ isOpen, onClose, pages, projectName }: PreviewModalProps) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => {
    if (isOpen && pages.length > 0) {
      // Auto-select first published page or first page
      const publishedPage = pages.find(p => p.isPublished);
      setSelectedPage(publishedPage || pages[0]);
    }
  }, [isOpen, pages]);

  if (!isOpen) return null;

  const publishedPages = pages.filter(p => p.isPublished);
  const draftPages = pages.filter(p => !p.isPublished);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden mx-4 shadow-2xl">
        {/* Header */}
        <div className="bg-[#111111] border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Site Preview
            </h2>
            <p className="text-gray-500 text-sm mt-1">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left: Pages List */}
          <div className="w-80 border-r border-white/10 bg-[#0A0A0A] overflow-y-auto">
            <div className="p-6">
              {/* Published Pages */}
              {publishedPages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Published ({publishedPages.length})
                  </h3>
                  <div className="space-y-2">
                    {publishedPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPage(page)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedPage?.id === page.id
                            ? 'bg-[#F6C453] text-black'
                            : 'bg-[#111111] text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        <div className="font-bold mb-1">{page.title}</div>
                        <div
                          className={`text-xs ${
                            selectedPage?.id === page.id
                              ? 'text-black/70'
                              : 'text-gray-500'
                          }`}
                        >
                          /{page.slug}
                        </div>
                        {page.isPublished && (
                          <div className="mt-2">
                            <span
                              className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                                selectedPage?.id === page.id
                                  ? 'bg-black/20 text-black'
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              LIVE
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Draft Pages */}
              {draftPages.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    Drafts ({draftPages.length})
                  </h3>
                  <div className="space-y-2">
                    {draftPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPage(page)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedPage?.id === page.id
                            ? 'bg-white/10 border-2 border-[#F6C453]'
                            : 'bg-[#111111]/50 text-gray-400 hover:bg-[#111111]'
                        }`}
                      >
                        <div className="font-bold mb-1">{page.title}</div>
                        <div className="text-xs text-gray-600">/{page.slug}</div>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-0.5 text-xs font-bold rounded bg-gray-700 text-gray-400">
                            DRAFT
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pages.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No pages found</p>
                  <p className="text-gray-600 text-xs mt-2">
                    Create pages using the builder
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview Area */}
          <div className="flex-1 bg-[#0A0A0A] overflow-y-auto">
            {selectedPage ? (
              <div className="p-8">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-black text-white mb-2">
                        {selectedPage.title}
                      </h3>
                      <p className="text-gray-400">/{selectedPage.slug}</p>
                    </div>
                    <a
                      href={`/builder/${selectedPage.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#F6C453] text-black font-bold rounded-lg hover:bg-[#f6d16f] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Builder
                    </a>
                  </div>

                  {selectedPage.isPublished ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30">
                        ✓ PUBLISHED
                      </span>
                      {selectedPage.publishedAt && (
                        <span className="text-xs text-gray-500">
                          Published on {new Date(selectedPage.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gray-700 text-gray-400 text-xs font-bold rounded-lg">
                      DRAFT - Not visible to public
                    </span>
                  )}
                </div>

                {/* SEO Info */}
                {(selectedPage.metaDescription || selectedPage.metaKeywords) && (
                  <div className="mb-8 p-6 bg-[#111111] border border-white/5 rounded-2xl">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
                      SEO Information
                    </h4>
                    {selectedPage.metaDescription && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Meta Description</p>
                        <p className="text-white text-sm">{selectedPage.metaDescription}</p>
                      </div>
                    )}
                    {selectedPage.metaKeywords && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Keywords</p>
                        <p className="text-white text-sm">{selectedPage.metaKeywords}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Page Content Preview */}
                <div className="p-6 bg-[#111111] border border-white/5 rounded-2xl">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
                    Page Structure
                  </h4>
                  
                  {selectedPage.pageData && typeof selectedPage.pageData === 'object' && 'sections' in selectedPage.pageData ? (
                    <div className="space-y-4">
                      {((selectedPage.pageData as any).sections as any[]).map((section: any, index: number) => (
                        <div
                          key={section.id || index}
                          className="p-4 bg-black/40 border border-white/5 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold">
                              Section {index + 1}
                            </span>
                            <span className="text-xs text-gray-500">
                              {section.components?.length || 0} components
                            </span>
                          </div>
                          {section.components && section.components.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {section.components.map((comp: any, compIndex: number) => (
                                <div
                                  key={comp.id || compIndex}
                                  className="text-sm text-gray-400 flex items-center gap-2"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#F6C453]" />
                                  {comp.type || 'Component'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        No content structure available
                      </p>
                      <p className="text-gray-600 text-xs mt-2">
                        Edit this page in the builder to add content
                      </p>
                    </div>
                  )}
                </div>

                {/* Last Updated */}
                <div className="mt-6 text-xs text-gray-600">
                  Last updated: {new Date(selectedPage.updatedAt || selectedPage.createdAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Select a page to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
