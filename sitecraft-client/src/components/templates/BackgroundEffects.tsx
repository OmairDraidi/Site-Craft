// src/components/templates/BackgroundEffects.tsx

import React from 'react';

export const BackgroundEffects: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none bg-[#020202]">
            {/* Aurora Blurs - Large, fluid, and immersive */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#F6C453]/10 rounded-full blur-[160px] animate-pulse-slow mix-blend-screen opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4F46E5]/10 rounded-full blur-[140px] animate-pulse mix-blend-screen opacity-30" />
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-[#F6C453]/5 rounded-full blur-[180px] mix-blend-screen" />

            {/* Subtle Grain/Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

            {/* Luminous Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-80" />
        </div>
    );
};
