// src/components/common/Pagination.tsx

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-32 pb-24 px-6 animate-fade-in">
      {/* Unified Luminous Navigation Bar */}
      <div className="flex items-center gap-1.5 p-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-3xl">
        {/* Navigation - Back */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="group flex items-center justify-center w-14 h-14 rounded-[1.5rem] bg-white/[0.02] border border-white/5 disabled:opacity-5 disabled:cursor-not-allowed hover:bg-white/[0.05] hover:border-gold/30 transition-all duration-500"
        >
          <ChevronLeft className="w-4 h-4 text-white group-hover:text-gold group-hover:-translate-x-0.5 transition-all" />
        </button>

        {/* Page numbers hub */}
        <div className="flex items-center gap-1 px-4 border-x border-white/5">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={i}
                onClick={() => onPageChange(pageNum)}
                className={`relative flex items-center justify-center min-w-[3.5rem] h-14 rounded-[1.5rem] transition-all duration-700 ${isActive ? 'bg-white/[0.05] text-gold border border-gold/20' : 'text-gray-500 hover:text-white'
                  }`}
              >
                <span className={`text-[12px] font-black tracking-tight ${isActive ? 'scale-110' : 'scale-100'} transition-transform`}>
                  {String(pageNum).padStart(2, '0')}
                </span>

                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation - Forward */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="group flex items-center justify-center w-14 h-14 rounded-[1.5rem] bg-white/[0.02] border border-white/5 disabled:opacity-5 disabled:cursor-not-allowed hover:bg-white/[0.05] hover:border-gold/30 transition-all duration-500"
        >
          <ChevronRight className="w-4 h-4 text-white group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
