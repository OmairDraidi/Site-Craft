import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrandingForm } from '../../components/settings/BrandingForm';
import { BrandingPreview } from '../../components/settings/BrandingPreview';
import { siteService, SiteDto } from '../../services/site.service';
import { useProjectStore } from '../../stores/useProjectStore';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

export const BrandingPage = () => {
    const { projectId, siteId: legacySiteId } = useParams<{ projectId?: string; siteId?: string }>();
    const navigate = useNavigate();
    const { projects, fetchProjects, selectedProject, fetchProjectById } = useProjectStore();
    const [site, setSite] = useState<SiteDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    
    // Determine siteId from projectId or legacy siteId param
    const siteId = legacySiteId || selectedProject?.siteId;

    useEffect(() => {
        loadProjectAndSite();
    }, [projectId, legacySiteId]);

    const loadProjectAndSite = async () => {
        try {
            // If using new route with projectId
            if (projectId) {
                if (projects.length === 0) {
                    await fetchProjects();
                }
                await fetchProjectById(projectId);
                
                // Wait for selectedProject to be set
                setTimeout(async () => {
                    const project = selectedProject || projects.find(p => p.id === projectId);
                    if (project?.siteId) {
                        const data = await siteService.getSite(project.siteId);
                        setSite(data);
                    } else {
                        setError('Project does not have an associated site');
                    }
                    setIsLoading(false);
                }, 100);
            } 
            // If using legacy route with siteId
            else if (legacySiteId) {
                const data = await siteService.getSite(legacySiteId);
                setSite(data);
                setIsLoading(false);
            } else {
                setError('Project ID or Site ID is required');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load site');
            toast.error('Failed to load site branding');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = (updatedSite: SiteDto) => {
        setSite(updatedSite);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !site) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error || 'Site not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F6C453]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#F6C453] transition-colors group mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Editor</span>
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Site Branding
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl">
                            Define your brand's DNA. Customize everything from visual identity to
                            typography and contact signatures.
                        </p>
                    </div>

                    <div className="hidden lg:block">
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-sm text-gray-500 font-medium">Project ID: </span>
                            <span className="text-sm text-[#F6C453] font-mono">{siteId?.substring(0, 8)}...</span>
                        </div>
                    </div>
                </div>

                {/* Grid Layout (3:2 Ratio) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Form (3/5 width) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                            <BrandingForm site={site} onUpdate={handleUpdate} />
                        </div>
                    </div>

                    {/* Preview (2/5 width) - Sticky container */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-10 space-y-6">
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl overflow-hidden min-h-[700px]">
                                <BrandingPreview site={site} />
                            </div>

                            {/* Pro Tip Card */}
                            <div className="bg-gradient-to-br from-[#F6C453]/10 to-transparent p-6 rounded-2xl border border-[#F6C453]/20">
                                <h4 className="text-[#F6C453] font-semibold mb-2">Pro Tip</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Changes are saved in real-time. Use high-resolution SVGs for logos
                                    to ensure they look crisp on all retina displays.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
