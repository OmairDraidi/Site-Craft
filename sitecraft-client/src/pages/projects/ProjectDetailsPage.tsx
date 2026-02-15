import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Settings,
  Globe,
  Trash2,
  ChevronRight,
  Menu,
  Palette
} from 'lucide-react';
import { useProjectStore } from '@/stores/useProjectStore';
import { pageService } from '@/services/page.service';
import { DevicePreview } from '@/components/templates';
import { ProjectStatusBadge, TemplateSelector, ConfirmDeleteModal, PreviewModal } from '@/components/projects';
import type { ProjectStatus } from '@/types/project.types';
import type { Page } from '@/types/builder.types';

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedProject,
    isLoading,
    error,
    fetchProjectById,
    updateProject,
    applyTemplateToProject,
    updateProjectStatus,
    deleteProject,
    clearSelectedProject,
  } = useProjectStore();

  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpeningBuilder, setIsOpeningBuilder] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('Draft');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPages, setPreviewPages] = useState<Page[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
    }
    return () => {
      clearSelectedProject();
    };
  }, [id, fetchProjectById, clearSelectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setSelectedStatus(selectedProject.status);
      setEditedName(selectedProject.name);
      setEditedDescription(selectedProject.description);
    }
  }, [selectedProject]);

  const handleTemplateSelect = async (templateId: string) => {
    if (!id) return;
    try {
      await applyTemplateToProject(id, templateId);
      setIsTemplateSelectorOpen(false);
      toast.success('Template applied successfully!');
    } catch (err: any) {
      console.error('Failed to apply template:', err);

      // Check if it's a premium template access error (403)
      // The API client interceptor returns { statusCode, message, errors }
      if (err?.statusCode === 403) {
        toast.error('Premium Template', {
          description: 'This template requires a Pro or Enterprise subscription. Please upgrade your plan to use premium templates.',
          duration: 5000,
        });
      } else {
        toast.error(err?.message || 'Failed to apply template. Please try again.');
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await updateProjectStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveName = async () => {
    setIsEditingName(false);
    if (!id || !selectedProject || editedName === selectedProject.name) return;
    try {
      await updateProject(id, { name: editedName, description: selectedProject.description });
    } catch (err) {
      console.error('Failed to update name:', err);
      setEditedName(selectedProject.name);
    }
  };

  const handleSaveDescription = async () => {
    setIsEditingDescription(false);
    if (!id || !selectedProject || editedDescription === selectedProject.description) return;
    try {
      await updateProject(id, { name: selectedProject.name, description: editedDescription });
    } catch (err) {
      console.error('Failed to update description:', err);
      setEditedDescription(selectedProject.description);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteProject(id);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setIsDeleting(false);
    }
  };

  const handleOpenBuilder = async () => {
    if (!selectedProject?.siteId) {
      toast.error('No site found for this project');
      return;
    }

    setIsOpeningBuilder(true);
    try {
      // Fetch pages for this project's site
      const pages = await pageService.getPagesBySite(selectedProject.siteId);
      
      if (pages.length > 0) {
        // Open first page in builder
        navigate(`/builder/${pages[0].id}`);
      } else {
        // Create new page automatically
        toast.info('Creating your first page...');
        const newPage = await pageService.createPage({
          siteId: selectedProject.siteId,
          title: 'Home',
          metaDescription: 'Home page',
        });
        navigate(`/builder/${newPage.id}`);
      }
    } catch (error) {
      console.error('Failed to open builder:', error);
      toast.error('Failed to open builder. Please try again.');
      setIsOpeningBuilder(false);
    }
  };

  const handleOpenPreview = async () => {
    if (!selectedProject?.siteId) {
      toast.error('No site found for this project');
      return;
    }

    setIsLoadingPages(true);
    try {
      const pages = await pageService.getPagesBySite(selectedProject.siteId);
      setPreviewPages(pages);
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error('Failed to load pages:', error);
      toast.error('Failed to load pages. Please try again.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  if (isLoading && !selectedProject) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#F6C453]">Loading project...</div>
      </div>
    );
  }

  if (error || !selectedProject) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-black text-white mb-4">Project Not Found</h1>
        <p className="text-gray-500 mb-8">{error || "The project doesn't exist or you don't have access"}</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-[#F6C453]/10 hover:border-[#F6C453]/30 transition-all"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden pb-24">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F6C453]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-16 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group"
          >
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-[#F6C453]/20 transition-all">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Projects</span>
          </button>

          <ProjectStatusBadge status={selectedProject.status} size="lg" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Left Column: Preview & Details */}
          <div className="xl:col-span-8 space-y-8">
            {/* Project Title */}
            <div>
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="text-5xl font-black text-white bg-transparent border-b-2 border-[#F6C453] focus:outline-none w-full"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-5xl font-black text-white tracking-tighter leading-none cursor-pointer hover:text-[#F6C453] transition"
                >
                  {selectedProject.name}
                </h1>
              )}
              {isEditingDescription ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onBlur={handleSaveDescription}
                  className="mt-4 text-xl text-gray-400 bg-transparent border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[#F6C453]/30 w-full resize-none"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => setIsEditingDescription(true)}
                  className="mt-4 text-xl text-gray-400 cursor-pointer hover:text-gray-300 transition"
                >
                  {selectedProject.description || 'Click to add description'}
                </p>
              )}
            </div>

            {/* Site Preview */}
            {selectedProject.templatePreviewUrl ? (
              <div className="relative">
                <DevicePreview
                  imageUrl={selectedProject.templatePreviewUrl}
                  templateName={selectedProject.name}
                />
              </div>
            ) : (
              <div className="p-12 bg-[#111111]/40 border border-white/5 rounded-[2rem] text-center">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No template selected</p>
                <button
                  onClick={() => setIsTemplateSelectorOpen(true)}
                  className="px-6 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-all"
                >
                  Choose Template
                </button>
              </div>
            )}

            {/* Pages Section - Coming Soon */}
            <div className="p-8 bg-[#111111]/40 border border-white/5 rounded-[2rem]">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <Settings size={20} className="text-[#F6C453]" />
                Pages Management
              </h3>
              <div className="space-y-3">
                {['Home', 'About', 'Contact'].map((page) => (
                  <div key={page} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-white font-medium">{page}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Coming Soon</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Settings - Coming Soon */}
            <div className="p-8 bg-[#111111]/40 border border-white/5 rounded-[2rem]">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
                SEO Settings
              </h3>
              <div className="space-y-4 opacity-50">
                <input
                  type="text"
                  placeholder="Meta Title"
                  disabled
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white"
                />
                <textarea
                  placeholder="Meta Description"
                  disabled
                  rows={3}
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white resize-none"
                />
                <input
                  type="text"
                  placeholder="Keywords"
                  disabled
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white"
                />
              </div>
              <p className="mt-4 text-xs text-gray-600 uppercase tracking-wider">Feature coming in Phase 9</p>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="xl:col-span-4 sticky top-10">
            <div className="bg-[#111111]/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[3.5rem] shadow-4xl">
              {/* Template Info */}
              {selectedProject.templateName ? (
                <div className="mb-8">
                  <p className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.3em] mb-3">
                    Current Template
                  </p>
                  {selectedProject.templatePreviewUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/5">
                      <img
                        src={selectedProject.templatePreviewUrl}
                        alt={selectedProject.templateName}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-white font-bold mb-3">{selectedProject.templateName}</p>
                  <button
                    onClick={() => setIsTemplateSelectorOpen(true)}
                    className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-black rounded-xl transition-all"
                  >
                    Change Template
                  </button>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">
                    No Template Selected
                  </p>
                  <button
                    onClick={() => setIsTemplateSelectorOpen(true)}
                    className="w-full px-4 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-all"
                  >
                    Choose Template
                  </button>
                </div>
              )}

              {/* Status Control */}
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">
                  Project Status
                </p>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value as ProjectStatus);
                    handleStatusChange(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-medium focus:border-[#F6C453]/30 focus:outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {/* Open Builder - Primary CTA */}
                <button
                  onClick={handleOpenBuilder}
                  disabled={isOpeningBuilder}
                  className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[#F6C453] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex items-center justify-between p-1 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex-1 py-4 px-6 flex items-center justify-center">
                      <span className="text-black text-base font-black uppercase tracking-widest">
                        {isOpeningBuilder ? 'Opening...' : 'Open Builder'}
                      </span>
                    </div>
                    <div className="p-4 bg-black/10 backdrop-blur-xl">
                      <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Preview Site */}
                <button
                  onClick={handleOpenPreview}
                  disabled={isLoadingPages}
                  className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingPages ? 'Loading...' : 'Preview Site'}
                </button>

                {/* Navigation Builder */}
                <button
                  onClick={() => navigate(`/projects/${selectedProject.id}/navigation`)}
                  className="w-full px-6 py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black rounded-2xl transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Menu size={16} />
                  Navigation Builder
                </button>

                {/* Site Settings */}
                <button
                  onClick={() => navigate(`/projects/${selectedProject.id}/branding`)}
                  className="w-full px-6 py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-black rounded-2xl transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Palette size={16} />
                  Site Settings
                </button>

                {/* Delete */}
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-black rounded-2xl transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Project
                </button>
              </div>

              {/* Meta Info */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-[10px] text-gray-600 space-y-1">
                  <p>Created: {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                  {selectedProject.updatedAt && (
                    <p>Updated: {new Date(selectedProject.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TemplateSelector
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelect={handleTemplateSelect}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        projectName={selectedProject.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        pages={previewPages}
        projectName={selectedProject.name}
      />
    </div>
  );
};
