// src/components/templates/DevicePreview.tsx

import { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface DevicePreviewProps {
  imageUrl: string;
  templateName: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export const DevicePreview = ({ imageUrl, templateName }: DevicePreviewProps) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  const deviceSizes = {
    desktop: { width: '100%', maxWidth: '1200px' },
    tablet: { width: '100%', maxWidth: '768px' },
    mobile: { width: '100%', maxWidth: '375px' }
  };

  const devices: { type: DeviceType; icon: typeof Monitor; label: string }[] = [
    { type: 'desktop', icon: Monitor, label: 'Desktop' },
    { type: 'tablet', icon: Tablet, label: 'Tablet' },
    { type: 'mobile', icon: Smartphone, label: 'Mobile' }
  ];

  return (
    <div className="space-y-4">
      {/* Device Switcher */}
      <div className="flex items-center justify-center gap-2">
        {devices.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setActiveDevice(type)}
            className={`
              group relative flex items-center gap-2 px-4 py-2.5 rounded-lg
              transition-all duration-300
              ${activeDevice === type
                ? 'bg-[#F6C453]/20 border border-[#F6C453]/40 text-[#F6C453]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
              }
            `}
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
            
            {/* Active indicator */}
            {activeDevice === type && (
              <div className="absolute inset-0 rounded-lg bg-[#F6C453]/10 animate-pulse pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Preview Frame */}
      <div 
        className="
          mx-auto transition-all duration-500 ease-out
          flex items-center justify-center
        "
        style={deviceSizes[activeDevice]}
      >
        <div className="
          relative w-full
          bg-gradient-to-br from-white/5 to-white/[0.02]
          rounded-xl border border-white/10
          p-4
          backdrop-blur-sm
        ">
          {/* Device Frame Decoration */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/10 rounded-full" />
          
          {/* Image Container */}
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={`${templateName} preview in ${activeDevice} view`}
              className="w-full h-full object-cover object-top"
            />
            
            {/* Overlay gradient for polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Device info badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
              {activeDevice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
