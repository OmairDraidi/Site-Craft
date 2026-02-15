interface FontSelectorProps {
    label: string;
    value: string;
    onChange: (font: string) => void;
}

// Google Fonts presets
const FONT_OPTIONS = [
    { value: 'Inter', label: 'Inter (Modern Sans-Serif)' },
    { value: 'Roboto', label: 'Roboto (Clean Sans-Serif)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly Sans-Serif)' },
    { value: 'Lato', label: 'Lato (Professional Sans-Serif)' },
    { value: 'Montserrat', label: 'Montserrat (Geometric Sans-Serif)' },
    { value: 'Poppins', label: 'Poppins (Rounded Sans-Serif)' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
    { value: 'Merriweather', label: 'Merriweather (Classic Serif)' },
    { value: 'Lora', label: 'Lora (Readable Serif)' },
    { value: 'PT Serif', label: 'PT Serif (Traditional Serif)' },
    { value: 'Raleway', label: 'Raleway (Stylish Sans-Serif)' },
    { value: 'Nunito', label: 'Nunito (Soft Sans-Serif)' },
];

export const FontSelector = ({ label, value, onChange }: FontSelectorProps) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none text-white appearance-none cursor-pointer"
                >
                    {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value} className="bg-[#1A1A1A] text-white">
                            {font.label}
                        </option>
                    ))}
                </select>
                {/* Custom Chevron */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/[0.05] overflow-hidden">
                <div
                    className="text-white text-lg truncate"
                    style={{ fontFamily: value }}
                >
                    The quick brown fox jumps over the lazy dog
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
                    Variant Medium 500
                </p>
            </div>
        </div>
    );
};
