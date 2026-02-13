// src/components/templates/InventoryStats.tsx

import React from 'react';

interface InventoryStatsProps {
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ totalItems, currentPage, totalPages }) => {
    return (
        <div className="flex items-center justify-between mb-12 px-6">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/80" />
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Library Status</p>
                </div>
                <p className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    {totalItems} <span className="text-white/60 font-medium">Assets Available</span>
                </p>
            </div>

            <div className="h-px flex-1 mx-12 bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent hidden md:block" />

            <div className="flex flex-col items-end">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 mb-1">Navigation</p>
                <p className="text-sm font-black text-white uppercase tracking-widest">
                    {currentPage} <span className="text-white/60">of</span> {totalPages}
                </p>
            </div>
        </div>
    );
};
