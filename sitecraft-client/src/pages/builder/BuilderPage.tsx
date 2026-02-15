/**
 * Builder Page
 * Main entry point for the visual page builder
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useBuilderStore } from '@/stores/builderStore';
import { pageService } from '@/services/page.service';
import { siteService } from '@/services/site.service';
import { useGoogleFonts } from '@/hooks/useGoogleFonts';
import { BuilderLayout } from '@/components/builder/BuilderLayout';

export const BuilderPage = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const { initializePage, reset, setSiteBranding, siteBranding } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Fonts dynamically
   const fontsToLoad = siteBranding
    ? [siteBranding.headingFontFamily, siteBranding.bodyFontFamily]
    : [];
  useGoogleFonts(fontsToLoad);

  useEffect(() => {
    const loadPage = async () => {
      if (!pageId) {
        toast.error('Page ID is missing');
        navigate('/projects');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch page data from API
        const page = await pageService.getPageById(pageId);

        // Parse PageData JSON
        const parsedData = page.pageData
          ? JSON.parse(page.pageData)
          : { sections: [] };

        // Merge API data with visual data
        const pageData = {
          ...parsedData,
          siteId: page.siteId,
          name: page.title
        };

        // Initialize store
        initializePage(pageId, pageData);

        // Fetch site branding
        try {
          const site = await siteService.getSite(page.siteId);
          setSiteBranding({
            primaryColor: site.primaryColor || '#000000',
            secondaryColor: site.secondaryColor || '#ffffff',
            headingFontFamily: site.headingFontFamily || 'Inter',
            bodyFontFamily: site.bodyFontFamily || 'Roboto',
            logoUrl: site.logoUrl,
            faviconUrl: site.faviconUrl,
          });
        } catch (err) {
          console.warn('Failed to load site branding:', err);
          // Continue without branding - use defaults
        }

        toast.success(`Loaded page: ${page.title}`);
      } catch (err) {
        console.error('Error loading page:', err);
        setError('Failed to load page. Please try again.');
        toast.error('Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [pageId, initializePage, reset, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 border-4 border-[#F6C453]/20 border-t-[#F6C453] rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-gray-400 text-sm">Loading page builder...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Page</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-2 bg-[#F6C453] text-black rounded-lg hover:bg-[#F6C453]/90 transition-colors font-medium"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Main builder interface
  return <BuilderLayout />;
};
