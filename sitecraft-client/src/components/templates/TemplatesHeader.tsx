// src/components/templates/TemplatesHeader.tsx

import React from 'react';
import { Sparkles } from 'lucide-react';

export const TemplatesHeader: React.FC = () => {
    return (
        <div className="text-center mb-16 relative pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-xl animate-fade-in shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold/80" />
                <span className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">
                    Curated Studio
                </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none max-w-4xl mx-auto">
                Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gold/40">Digital Space.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                Choose from our elite collection of high-performance templates.
                Meticulously crafted for those who demand excellence in every pixel.
            </p>

            {/* Minimalist Separator */}
            <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
        </div>
    );
};
