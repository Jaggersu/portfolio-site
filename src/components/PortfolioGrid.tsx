'use client';

import Image from "next/image";
import { useClickSound } from "@/hooks/useClickSound";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const { playClickSound, isInteracted, isPlaying } = useClickSound();

  return (
    <div className="relative z-20">
      {/* Portfolio Window with Classic Mac OS 9 Title Bar */}
      <div className="bg-[#CECECE] mx-4 sm:mx-8 lg:mx-16 mb-8 sm:mb-12 lg:mb-16"
           style={{
             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
             border: 'none'
           }}>
        
        {/* Classic Title Bar with Pinstripes */}
        <div className="relative h-6 flex items-center px-2"
             style={{
               backgroundImage: `repeating-linear-gradient(
                 0deg,
                 transparent,
                 transparent 1px,
                 rgba(255, 255, 255, 0.3) 1px,
                 rgba(255, 255, 255, 0.3) 2px
               )`,
               borderBottom: 'none',
               boxShadow: 'none'
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
            作品集
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
        <div className="bg-white p-6 sm:p-8 lg:p-12"
             style={{
               border: 'none',
               margin: '0',
               padding: '2rem 3rem'
             }}>
          
          {/* Portfolio Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-light mb-4" 
              style={{ 
                color: '#404040',
                textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)' 
              }}
            >
              作品集
            </h2>
            <p className="text-base sm:text-lg mb-2 max-w-2xl mx-auto px-4"
               style={{ color: '#606060' }}>
              探索我們的創意設計作品，涵蓋品牌識別、網頁設計、包裝設計等多個領域
            </p>
          </div>
          
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-[#F8F8F8] overflow-hidden transition-all duration-300"
                style={{
                  border: '2px solid',
                  borderImage: 'linear-gradient(to right, #FFFFFF 0%, #FFFFFF 50%, #808080 50%, #808080 100%) 1',
                  boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.2)'
                }}
                onClick={playClickSound}
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden"
                     style={{ borderBottom: '1px solid #808080' }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-xs sm:text-sm mb-2" 
                       style={{ color: '#808080' }}>{item.category}</div>
                  <h3 className="text-base sm:text-lg font-medium mb-2" 
                      style={{ 
                        color: '#404040',
                        textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)' 
                      }}>{item.title}</h3>
                  <p className="text-sm line-clamp-2" 
                     style={{ color: '#606060' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
