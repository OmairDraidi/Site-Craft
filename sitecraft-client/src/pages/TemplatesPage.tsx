// src/pages/TemplatesPage.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { useTemplateStore } from '@/stores/useTemplateStore';
import { useAuth } from '@/contexts/AuthContext';
import { TemplateFiltersComponent } from '@/components/templates/TemplateFilters';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { Pagination } from '@/components/common/Pagination';
import { BackgroundEffects } from '@/components/templates/BackgroundEffects';
import { TemplatesHeader } from '@/components/templates/TemplatesHeader';
import { InventoryStats } from '@/components/templates/InventoryStats';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    filteredTemplates,
    paginatedTemplates,
    filters,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchTemplates,
    setFilters,
    clearFilters,
    setPage,
    toggleFavorite
  } = useTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = (template: any) => {
    navigate(`/templates/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-[#020202] relative overflow-x-hidden font-sans selection:bg-gold/30 selection:text-gold">
      <BackgroundEffects />

      <div className="relative z-10 max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 py-10 md:py-20">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold/20 transition-all backdrop-blur-3xl"
          >
            <LayoutGrid className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
              Studio Dashboard
            </span>
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/40 to-transparent p-[1px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-gold">
                    {user.firstName?.[0] || 'U'}
                  </div>
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Authorized Architect</span>
            </div>
          )}
        </div>

        <TemplatesHeader />

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-16 p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-red-400 text-center backdrop-blur-3xl font-black uppercase tracking-widest text-sm shadow-2xl animate-shake">
            <span className="opacity-50 mr-3 text-2xl">!</span> {error}
          </div>
        )}

        {/* Main Interface Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Sidebar - Precision Aesthetic */}
          <aside className="w-full lg:w-[360px] lg:sticky lg:top-32 z-20 h-fit">
            <div className="group relative">
              {/* Outer decorative ring */}
              <div className="absolute -inset-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-[3rem] blur-sm opacity-50 transition-opacity group-hover:opacity-100" />

              <div className="relative bg-[#0A0A0A]/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />

                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/60 mb-10 pl-1 border-l-2 border-gold/40">
                  Refine Parameters
                </h3>

                <TemplateFiltersComponent
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <main className="flex-1 w-full min-h-[900px]">
            {!isLoading && (
              <div className="sticky top-0 lg:top-4 z-30 bg-[#020202]/95 backdrop-blur-2xl pt-6 pb-4 mb-12 -mx-4 px-4 border-b border-white/[0.03]">
                <InventoryStats
                  totalItems={filteredTemplates.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            )}

            <div className="mb-16">
              <TemplateGrid
                templates={paginatedTemplates}
                isLoading={isLoading}
                onTemplateSelect={handleTemplateSelect}
                onToggleFavorite={toggleFavorite}
              />
            </div>

            {!isLoading && totalPages > 1 && (
              <div className="pt-10 border-t border-white/5">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
