import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

export const ColorPicker = ({ label, color, onChange }: ColorPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{0,6}$/i.test(value)) {
            onChange(value);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="relative">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-14 h-12 rounded-xl border border-white/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all p-1.5 bg-white/5"
                    >
                        <div
                            className="w-full h-full rounded-lg shadow-inner border border-white/5"
                            style={{ backgroundColor: color }}
                        />
                    </button>

                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={color.toUpperCase()}
                            onChange={handleHexInput}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#F6C453]/50 focus:border-[#F6C453] transition-all outline-none font-mono text-sm tracking-wider uppercase text-white"
                            placeholder="#000000"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            HEX
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute top-14 left-0 z-20 p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                            <HexColorPicker color={color} onChange={onChange} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
