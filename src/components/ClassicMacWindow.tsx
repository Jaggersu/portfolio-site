'use client';

import { ReactNode } from 'react';

interface ClassicMacWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ClassicMacWindow({ title, children, className = '' }: ClassicMacWindowProps) {
  return (
    <div className={`bg-[#CECECE] ${className}`}
         style={{
           boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.2)',
           border: '2px solid',
           borderImage: 'linear-gradient(to right, #FFFFFF 0%, #FFFFFF 50%, #808080 50%, #808080 100%) 1'
         }}>
      {/* Title Bar with Pinstripes */}
      <div className="relative h-6 flex items-center px-2"
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               transparent,
               transparent 1px,
               rgba(255, 255, 255, 0.3) 1px,
               rgba(255, 255, 255, 0.3) 2px
             )`,
             borderBottom: '1px solid #808080',
             boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.6)'
           }}>
        {/* Close Button */}
        <div className="w-4 h-4 bg-[#FF6050] rounded-sm flex items-center justify-center"
             style={{
               boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.5), 0 1px 0px rgba(0, 0, 0, 0.3)',
               border: '1px solid #808080'
             }}>
          <div className="w-2 h-0.5 bg-white rounded-full" />
        </div>
        
        {/* Window Title */}
        <div className="flex-1 text-center text-xs font-medium"
             style={{
               color: '#404040',
               textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
             }}>
          {title}
        </div>
        
        {/* Minimize and Maximize Buttons */}
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-[#FFBD35] rounded-sm flex items-center justify-center"
               style={{
                 boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.5), 0 1px 0px rgba(0, 0, 0, 0.3)',
                 border: '1px solid #808080'
               }}>
            <div className="w-2 h-0.5 bg-white rounded-full" />
          </div>
          <div className="w-4 h-4 bg-[#00CA56] rounded-sm flex items-center justify-center"
               style={{
                 boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.5), 0 1px 0px rgba(0, 0, 0, 0.3)',
                 border: '1px solid #808080'
               }}>
            <div className="w-2 h-2 border border-white rounded-sm" />
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-white"
           style={{
             borderTop: '1px solid #FFFFFF',
             borderLeft: '1px solid #FFFFFF',
             borderRight: '1px solid #808080',
             borderBottom: '1px solid #808080'
           }}>
        {children}
      </div>
    </div>
  );
}
