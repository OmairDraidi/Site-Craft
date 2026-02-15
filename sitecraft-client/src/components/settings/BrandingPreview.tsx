import { SiteDto } from '../../services/site.service';
import { resolveImageUrl } from '../../utils/url';

interface BrandingPreviewProps {
    site: SiteDto;
}

export const BrandingPreview = ({ site }: BrandingPreviewProps) => {
    const socialLinks = site.socialLinks ? JSON.parse(site.socialLinks) : {};
    const contactInfo = site.contactInfo ? JSON.parse(site.contactInfo) : {};

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Live Preview
                </h3>
                <span className="px-3 py-1 bg-[#F6C453]/10 text-[#F6C453] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#F6C453]/20">
                    Real-time
                </span>
            </div>

            {/* Professional Browser Frame */}
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F6C453]/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-[#0F0F0F]">
                    {/* Browser Toolbar */}
                    <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 max-w-[120px] mx-auto h-5 bg-white/5 rounded flex items-center justify-center">
                            <span className="text-[10px] text-gray-500 truncate px-2">
                                {site.name.toLowerCase().replace(/\s+/g, '-')}.sitecraft.io
                            </span>
                        </div>
                        <div className="w-10" /> {/* Spacer */}
                    </div>

                    {/* Preview Content Area */}
                    <div
                        className="h-[500px] overflow-y-auto overflow-x-hidden relative"
                        style={{
                            fontFamily: site.bodyFontFamily,
                        }}
                    >
                        {/* Header */}
                        <div
                            className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md"
                            style={{
                                backgroundColor: `${site.primaryColor}E6`, // 90% opacity
                                borderBottom: `1px solid ${site.secondaryColor}20`
                            }}
                        >
                            {site.logoUrl ? (
                                <img
                                    src={resolveImageUrl(site.logoUrl)}
                                    alt={site.name}
                                    className="h-8 object-contain"
                                />
                            ) : (
                                <div
                                    className="h-8 px-3 rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight"
                                    style={{
                                        backgroundColor: site.secondaryColor,
                                        fontFamily: site.headingFontFamily,
                                        color: site.primaryColor
                                    }}
                                >
                                    {site.name}
                                </div>
                            )}

                            <nav className="flex gap-4">
                                {['Home', 'Products', 'About'].map((item) => (
                                    <span
                                        key={item}
                                        className="text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                        style={{ color: site.secondaryColor }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </nav>
                        </div>

                        {/* Hero Section */}
                        <div
                            className="px-6 py-16 text-center border-b border-white/5"
                            style={{ backgroundColor: `${site.primaryColor}0D` }}
                        >
                            <h1
                                className="text-2xl font-black mb-3 leading-tight"
                                style={{
                                    color: site.primaryColor,
                                    fontFamily: site.headingFontFamily
                                }}
                            >
                                {site.name}
                            </h1>
                            {site.tagline && (
                                <p className="text-gray-400 text-xs max-w-[200px] mx-auto leading-relaxed">
                                    {site.tagline}
                                </p>
                            )}
                            <button
                                className="mt-8 px-8 py-2.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                style={{
                                    backgroundColor: site.primaryColor,
                                    boxShadow: `0 10px 20px -5px ${site.primaryColor}40`
                                }}
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="px-6 py-10 bg-[#0F0F0F]">
                            <h2
                                className="text-lg font-bold mb-4"
                                style={{
                                    color: site.primaryColor,
                                    fontFamily: site.headingFontFamily
                                }}
                            >
                                Elevate Your Presence
                            </h2>
                            <p className="text-gray-500 text-xs leading-relaxed mb-4">
                                This live preview adapts instantly as you tweak your branding.
                                Watch your fonts and colors come to life.
                            </p>
                            <div
                                className="h-0.5 w-10 mb-4"
                                style={{ backgroundColor: site.primaryColor }}
                            />
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Professional identity starts with consistency.
                            </p>
                        </div>

                        {/* Footer */}
                        <div
                            className="px-6 py-8"
                            style={{ backgroundColor: site.secondaryColor }}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="max-w-[120px]">
                                    <p
                                        className="text-[10px] font-black uppercase tracking-widest mb-2"
                                        style={{ color: site.primaryColor }}
                                    >
                                        {site.name}
                                    </p>
                                    {contactInfo.email && (
                                        <p className="text-[9px] text-gray-500 line-clamp-1">{contactInfo.email}</p>
                                    )}
                                </div>

                                {/* Social Links */}
                                {Object.keys(socialLinks).length > 0 && (
                                    <div className="flex gap-2 shrink-0">
                                        {Object.keys(socialLinks).map((platform) => (
                                            <div
                                                key={platform}
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                                                style={{ backgroundColor: site.primaryColor }}
                                            >
                                                {platform[0].toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Design Metadata Details */}
            <div className="grid grid-cols-1 gap-4 pt-6">
                {/* Color Details Overlay */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        <span>Palette Details</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: site.primaryColor }} />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: site.secondaryColor }} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: site.primaryColor }} />
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 leading-none mb-1">Primary Base</p>
                                <p className="text-xs font-mono text-white leading-none tracking-tight">{site.primaryColor.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: site.secondaryColor }} />
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 leading-none mb-1">Accent Secondary</p>
                                <p className="text-xs font-mono text-white leading-none tracking-tight">{site.secondaryColor.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography Registry */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-4">Typography Registry</h4>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-gray-500 mb-1">Display Headers</p>
                            <p className="text-sm font-bold text-white truncate" style={{ fontFamily: site.headingFontFamily }}>
                                {site.headingFontFamily}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 mb-1">Body Context</p>
                            <p className="text-sm font-medium text-gray-300 truncate" style={{ fontFamily: site.bodyFontFamily }}>
                                {site.bodyFontFamily}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
