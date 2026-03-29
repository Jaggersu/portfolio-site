'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ControlStrip() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const menuItems = [
    { label: '🏠 首頁', action: () => router.push('/') },
    { label: '💼 作品集', action: () => router.push('/#portfolio') },
    { label: '👤 登入', action: () => router.push('/login') },
    { label: '⚙️ 後台', action: () => router.push('/admin') }
  ];

  return (
    <div className={`fixed bottom-4 left-4 bg-[#CECECE] transition-all duration-300 z-50`}
         style={{
           boxShadow: 'none',
           border: 'none',
           width: isExpanded ? '200px' : '60px',
           height: '24px'
         }}>
      {/* Main Control Strip */}
      <div className="relative h-full flex items-center px-2"
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               transparent,
               transparent 1px,
               rgba(255, 255, 255, 0.3) 1px,
               rgba(255, 255, 255, 0.3) 2px
             )`
           }}>
        
        {/* Expand/Collapse Arrow */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-4 h-4 bg-[#F0F0F0] rounded-sm flex items-center justify-center border border-[#808080]"
          style={{
            boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.8), 0 1px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className={`text-xs text-[#404040] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </button>
        
        {/* Menu Items */}
        {isExpanded && (
          <div className="flex-1 ml-2 flex items-center gap-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-xs px-2 py-1 bg-[#F0F0F0] rounded border border-[#808080] hover:bg-[#E0E0E0] transition-colors"
                style={{
                  boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.8), 0 1px 0px rgba(0, 0, 0, 0.2)',
                  color: '#404040',
                  textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Expanded Menu Panel */}
      {isExpanded && (
        <div className="absolute bottom-full left-0 mb-1 bg-[#CECECE] p-2 rounded-t"
             style={{
               boxShadow: 'none',
               border: 'none'
             }}>
          <div className="text-xs space-y-1"
               style={{
                 backgroundImage: `repeating-linear-gradient(
                   0deg,
                   transparent,
                   transparent 1px,
                   rgba(255, 255, 255, 0.3) 1px,
                   rgba(255, 255, 255, 0.3) 2px
                 )`
               }}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full text-left px-2 py-1 bg-[#F0F0F0] rounded border border-[#808080] hover:bg-[#E0E0E0] transition-colors"
                style={{
                  boxShadow: 'inset 0 1px 0px rgba(255, 255, 255, 0.8), 0 1px 0px rgba(0, 0, 0, 0.2)',
                  color: '#404040',
                  textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
