/**
 * SEO Panel
 * Allows editing meta description, keywords, and page title/slug
 * Displays character count indicators and best-practice hints
 */

import { useState, useEffect } from 'react';
import { Search, FileText, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBuilderStore } from '@/stores/builderStore';
import { pageService } from '@/services/page.service';

interface SEOData {
    title: string;
    slug: string;
    metaDescription: string;
    metaKeywords: string;
}

const MAX_DESCRIPTION = 160;
const MAX_KEYWORDS = 300;
const MAX_TITLE = 60;

export const SEOPanel = () => {
    const { pageId } = useBuilderStore();

    const [seoData, setSeoData] = useState<SEOData>({
        title: '',
        slug: '',
        metaDescription: '',
        metaKeywords: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load page metadata on mount
    useEffect(() => {
        const loadSEO = async () => {
            if (!pageId) return;

            try {
                setIsLoading(true);
                const page = await pageService.getPageById(pageId);
                setSeoData({
                    title: page.title || '',
                    slug: page.slug || '',
                    metaDescription: page.metaDescription || '',
                    metaKeywords: page.metaKeywords || '',
                });
            } catch {
                toast.error('Failed to load SEO data');
            } finally {
                setIsLoading(false);
            }
        };

        loadSEO();
    }, [pageId]);

    const handleChange = (field: keyof SEOData, value: string) => {
        setSeoData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!pageId) return;

        try {
            setIsSaving(true);
            await pageService.updatePage(pageId, {
                title: seoData.title,
                metaDescription: seoData.metaDescription,
                metaKeywords: seoData.metaKeywords,
            });
            setHasChanges(false);
            toast.success('SEO settings saved');
        } catch {
            toast.error('Failed to save SEO settings');
        } finally {
            setIsSaving(false);
        }
    };

    const getCharStatus = (current: number, max: number) => {
        const ratio = current / max;
        if (ratio > 1) return 'text-red-400';
        if (ratio > 0.8) return 'text-yellow-400';
        return 'text-green-400';
    };

    const getTitleScore = () => {
        const len = seoData.title.length;
        if (len === 0) return { color: 'text-gray-500', label: 'Empty' };
        if (len < 20) return { color: 'text-yellow-400', label: 'Too short' };
        if (len > MAX_TITLE) return { color: 'text-red-400', label: 'Too long' };
        return { color: 'text-green-400', label: 'Good' };
    };

    const getDescriptionScore = () => {
        const len = seoData.metaDescription.length;
        if (len === 0) return { color: 'text-gray-500', label: 'Empty' };
        if (len < 50) return { color: 'text-yellow-400', label: 'Too short' };
        if (len > MAX_DESCRIPTION) return { color: 'text-red-400', label: 'Too long' };
        return { color: 'text-green-400', label: 'Good' };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#F6C453]/20 border-t-[#F6C453] rounded-full animate-spin" />
            </div>
        );
    }

    const titleScore = getTitleScore();
    const descScore = getDescriptionScore();

    return (
        <div className="space-y-5">
            {/* SEO Score Preview */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-[#F6C453]" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Google Preview
                    </span>
                </div>
                <div className="space-y-1">
                    <p className="text-[#8AB4F8] text-sm font-medium truncate">
                        {seoData.title || 'Page Title'}
                    </p>
                    <p className="text-green-400/70 text-xs truncate">
                        sitecraft.com/{seoData.slug || 'page-slug'}
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2">
                        {seoData.metaDescription || 'Add a meta description to appear here...'}
                    </p>
                </div>
            </div>

            {/* Page Title */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <FileText className="w-3.5 h-3.5" />
                        Page Title
                    </label>
                    <span className={`text-xs ${titleScore.color}`}>
                        {titleScore.label}
                    </span>
                </div>
                <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    maxLength={MAX_TITLE + 20}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#F6C453]/50 transition-colors"
                    placeholder="Enter page title"
                />
                <div className="flex items-center justify-between">
                    <span className={`text-xs ${getCharStatus(seoData.title.length, MAX_TITLE)}`}>
                        {seoData.title.length}/{MAX_TITLE}
                    </span>
                    {seoData.title.length > 0 && seoData.title.length <= MAX_TITLE ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    ) : seoData.title.length > MAX_TITLE ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    ) : null}
                </div>
            </div>

            {/* Slug (read-only) */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    URL Slug
                </label>
                <div className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-gray-500 text-sm">
                    /{seoData.slug || 'auto-generated'}
                </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <FileText className="w-3.5 h-3.5" />
                        Meta Description
                    </label>
                    <span className={`text-xs ${descScore.color}`}>
                        {descScore.label}
                    </span>
                </div>
                <textarea
                    value={seoData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    maxLength={MAX_DESCRIPTION + 40}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#F6C453]/50 transition-colors resize-none"
                    placeholder="Describe this page for search engines..."
                />
                <div className="flex items-center justify-between">
                    <span className={`text-xs ${getCharStatus(seoData.metaDescription.length, MAX_DESCRIPTION)}`}>
                        {seoData.metaDescription.length}/{MAX_DESCRIPTION}
                    </span>
                    {seoData.metaDescription.length >= 50 && seoData.metaDescription.length <= MAX_DESCRIPTION ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    ) : seoData.metaDescription.length > MAX_DESCRIPTION ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    ) : null}
                </div>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <Tag className="w-3.5 h-3.5" />
                    Meta Keywords
                </label>
                <textarea
                    value={seoData.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    maxLength={MAX_KEYWORDS + 50}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#F6C453]/50 transition-colors resize-none"
                    placeholder="keyword1, keyword2, keyword3..."
                />
                <span className={`text-xs ${getCharStatus(seoData.metaKeywords.length, MAX_KEYWORDS)}`}>
                    {seoData.metaKeywords.length}/{MAX_KEYWORDS}
                </span>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F6C453] text-black rounded-lg font-semibold text-sm hover:bg-[#F6C453]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isSaving ? (
                    <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save SEO Settings'
                )}
            </button>

            {/* SEO Tips */}
            <div className="p-3 rounded-lg bg-[#F6C453]/5 border border-[#F6C453]/10">
                <p className="text-[#F6C453] text-xs font-semibold mb-2">💡 SEO Tips</p>
                <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Title: 30–60 characters for best results</li>
                    <li>• Description: 50–160 characters recommended</li>
                    <li>• Use commas to separate keywords</li>
                    <li>• Include your primary keyword in the title</li>
                </ul>
            </div>
        </div>
    );
};
