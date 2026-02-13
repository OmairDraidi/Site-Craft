// src/pages/projects/ProjectsPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/useProjectStore';
import { Plus, FolderOpen, ArrowLeft } from 'lucide-react';
import { ProjectStatusBadge } from '@/components/projects';
import type { ProjectStatus } from '@/types/project.types';

export const ProjectsPage = () => {
  const { projects, isLoading, error, fetchProjects, createProject } = useProjectStore();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ name: projectName, description: projectDescription });
      setProjectName('');
      setProjectDescription('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#F6C453]">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-400 hover:text-[#F6C453] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#F6C453] mb-2">My Projects</h1>
            <p className="text-gray-400">Manage your website projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-all"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FolderOpen size={64} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-black text-gray-400 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-[#F6C453] text-black font-black rounded-xl hover:bg-[#f6d16f] transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] backdrop-blur-3xl hover:border-[#F6C453]/20 transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                {project.thumbnailUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden bg-white/5">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-black text-white group-hover:text-[#F6C453] transition">
                    {project.name}
                  </h3>
                  <ProjectStatusBadge status={project.status as ProjectStatus} size="sm" />
                </div>

                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>

                {project.templateName && (
                  <p className="text-xs text-[#F6C453]/70 mb-3">
                    Template: {project.templateName}
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-[2rem] p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-[#F6C453] mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-black text-gray-400 mb-2 uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#F6C453]/30 focus:outline-none"
                  required
                  maxLength={100}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-black text-gray-400 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#F6C453]/30 focus:outline-none resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#F6C453] hover:bg-[#f6d16f] text-black font-black rounded-xl transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
