import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { ImageUpload } from './ImageUpload';
import { SiteDto, UpdateSiteBrandingRequest, siteService } from '../../services/site.service';
import { toast } from 'sonner';

interface BrandingFormProps {
    site: SiteDto;
    onUpdate: (updatedSite: SiteDto) => void;
}

export const BrandingForm = ({ site, onUpdate }: BrandingFormProps) => {
    const [formData, setFormData] = useState<UpdateSiteBrandingRequest>({
        name: site.name,
        tagline: site.tagline || '',
        primaryColor: site.primaryColor,
        secondaryColor: site.secondaryColor,
        headingFontFamily: site.headingFontFamily,
        bodyFontFamily: site.bodyFontFamily,
        socialLinks: site.socialLinks || '{}',
        contactInfo: site.contactInfo || '{}',
    });

    const [socialLinks, setSocialLinks] = useState(() => {
        try {
            return site.socialLinks ? JSON.parse(site.socialLinks) : {};
        } catch {
            return {};
        }
    });

    const [contactInfo, setContactInfo] = useState(() => {
        try {
            return site.contactInfo ? JSON.parse(site.contactInfo) : {};
        } catch {
            return {};
        }
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogoUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const response = await siteService.uploadFile(site.id, file, 'logo');
            toast.success('Logo uploaded successfully');
            onUpdate({ ...site, logoUrl: response.fileUrl });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload logo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFaviconUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const response = await siteService.uploadFile(site.id, file, 'favicon');
            toast.success('Favicon uploaded successfully');
            onUpdate({ ...site, faviconUrl: response.fileUrl });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload favicon');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        const updated = { ...socialLinks, [platform]: value };
        setSocialLinks(updated);
        setFormData({ ...formData, socialLinks: JSON.stringify(updated) });
    };

    const handleContactInfoChange = (field: string, value: string) => {
        const updated = { ...contactInfo, [field]: value };
        setContactInfo(updated);
        setFormData({ ...formData, contactInfo: JSON.stringify(updated) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const updatedSite = await siteService.updateSite(site.id, formData);
            toast.success('Branding settings saved successfully');
            onUpdate(updatedSite);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save branding settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Site Identity */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#F6C453]/10 flex items-center justify-center border border-[#F6C453]/20">
                        <span className="text-[#F6C453] text-lg">💡</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Site Identity</h3>
                        <p className="text-sm text-gray-400">Basic information about your website</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Site Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600"
                            placeholder="My Awesome Site"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tagline</label>
                        <input
                            type="text"
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600"
                            placeholder="A brief description of your site"
                        />
                    </div>
                </div>
            </section>

            {/* Logo & Favicon */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <span className="text-blue-500 text-lg">🖼️</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Visual Assets</h3>
                        <p className="text-sm text-gray-400">Upload your logo and favicon</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ImageUpload
                        label="Main Logo"
                        currentImage={site.logoUrl}
                        onUpload={handleLogoUpload}
                    />
                    <ImageUpload
                        label="Favicon"
                        currentImage={site.faviconUrl}
                        onUpload={handleFaviconUpload}
                    />
                </div>
            </section>

            {/* Colors */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <span className="text-purple-500 text-lg">🎨</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Brand Palette</h3>
                        <p className="text-sm text-gray-400">Select colors that define your brand</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ColorPicker
                        label="Primary Action Color"
                        color={formData.primaryColor || '#000000'}
                        onChange={(color) => setFormData({ ...formData, primaryColor: color })}
                    />
                    <ColorPicker
                        label="Secondary Accent"
                        color={formData.secondaryColor || '#ffffff'}
                        onChange={(color) => setFormData({ ...formData, secondaryColor: color })}
                    />
                </div>
            </section>

            {/* Typography */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="text-emerald-500 text-lg">Aa</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Typography</h3>
                        <p className="text-sm text-gray-400">Choose fonts for headings and body</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FontSelector
                        label="Headings Font"
                        value={formData.headingFontFamily || 'Inter'}
                        onChange={(font) => setFormData({ ...formData, headingFontFamily: font })}
                    />
                    <FontSelector
                        label="Body Font"
                        value={formData.bodyFontFamily || 'Roboto'}
                        onChange={(font) => setFormData({ ...formData, bodyFontFamily: font })}
                    />
                </div>
            </section>

            {/* Social Media Links */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                        <span className="text-pink-500 text-lg">🌐</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Social Presence</h3>
                        <p className="text-sm text-gray-400">Connect your social media profiles</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                        <div key={platform} className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 capitalize">
                                {platform}
                            </label>
                            <input
                                type="url"
                                value={socialLinks[platform] || ''}
                                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600"
                                placeholder={`https://${platform}.com/yourpage`}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <span className="text-orange-500 text-lg">📞</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Contact Signatures</h3>
                        <p className="text-sm text-gray-400">Public contact details for your site</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Public Email</label>
                            <input
                                type="email"
                                value={contactInfo.email || ''}
                                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600"
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Phone Support</label>
                            <input
                                type="tel"
                                value={contactInfo.phone || ''}
                                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Office Address</label>
                        <textarea
                            value={contactInfo.address || ''}
                            onChange={(e) => handleContactInfoChange('address', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white placeholder:text-gray-600 min-h-[100px] resize-none"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>
                </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end pt-10 border-t border-white/10">
                <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="group relative px-10 py-4 bg-[#F6C453] hover:bg-[#F6C453]/90 disabled:bg-gray-700 text-black font-bold rounded-2xl transition-all shadow-xl shadow-[#F6C453]/10 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isSaving ? (
                            <>
                                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                Saving Brand...
                            </>
                        ) : (
                            'Publish Changes'
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>
        </form>
    );
};
