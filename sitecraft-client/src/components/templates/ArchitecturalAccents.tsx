// src/components/templates/ArchitecturalAccents.tsx

import React from 'react';

export const ArchitecturalAccents: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none select-none z-[5]">
            {/* Vertical Ruler - Left Side */}
            <div className="absolute left-4 top-1/4 bottom-1/4 w-px bg-gold/10 flex flex-col justify-between items-center py-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`h-px bg-gold/30 ${i % 2 === 0 ? 'w-3' : 'w-1.5'}`} />
                        <span className="text-[6px] font-mono text-gold/20 transform rotate-90">{i * 100}px</span>
                    </div>
                ))}
            </div>

            {/* Coordinate Markers - Random technical points */}
            <div className="absolute top-[15%] right-[5%] flex flex-col gap-1 opacity-20">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <span className="text-[7px] font-mono text-white tracking-tighter">REF_POINT: 04.91</span>
                </div>
                <div className="h-px w-20 bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            <div className="absolute bottom-[10%] left-[8%] flex flex-col gap-1 opacity-20">
                <span className="text-[7px] font-mono text-white tracking-tighter uppercase">Surface_Grid_Enabled: True</span>
                <div className="h-px w-32 bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            {/* Decorative Plus Corners */}
            <div className="absolute top-10 left-10 text-gold/20 font-light text-xl">+</div>
            <div className="absolute top-10 right-10 text-gold/20 font-light text-xl">+</div>
            <div className="absolute bottom-10 left-10 text-gold/20 font-light text-xl">+</div>
            <div className="absolute bottom-10 right-10 text-gold/20 font-light text-xl">+</div>
        </div>
    );
};
