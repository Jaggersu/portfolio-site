import React from 'react';

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function MacWindow({ title, children, className = "" }: MacWindowProps) {
  return (
    <div className={`bg-[#CECECE] border-2 border-[#B0B0B0] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15),inset_1px_1px_0px_0px_rgba(255,255,255,0.8)] rounded-lg overflow-hidden ${className}`}>
      {/* Window Title Bar */}
      <div className="relative h-8 bg-gradient-to-b from-[#E0E0E0] to-[#CECECE] border-b-2 border-[#B0B0B0] px-3 flex items-center">
        {/* Pinstripes */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.12) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.12) 3px
            )`,
            backgroundSize: '4px 4px'
          }}
        />
        {/* Window Controls */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="w-3 h-3 bg-white border border-[#808080]"></div>
          <div className="w-3 h-3 bg-white border border-[#808080]"></div>
          <div className="w-3 h-3 bg-white border border-[#808080]"></div>
        </div>
        {/* Window Title */}
        <div className="relative z-10 flex-1 text-center text-sm text-gray-700 font-medium" 
             style={{ textShadow: '1px 1px 0px rgba(255, 255, 255, 0.8)' }}>
          {title}
        </div>
      </div>
      
      {/* Window Content */}
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}
