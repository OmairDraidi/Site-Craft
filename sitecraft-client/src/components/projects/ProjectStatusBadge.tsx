import type { ProjectStatus } from '@/types/project.types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const ProjectStatusBadge = ({ status, size = 'md' }: ProjectStatusBadgeProps) => {
  const configs = {
    Draft: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    Active: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    Published: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    Archived: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-[9px]',
    md: 'px-3 py-1.5 text-[10px]',
    lg: 'px-4 py-2 text-[11px]',
  };

  const config = configs[status] || configs.Draft;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full border font-black uppercase tracking-[0.2em]
        ${config.bg} ${config.text} ${config.border}
        ${sizeClasses[size]}
      `}
    >
      {status}
    </span>
  );
};
