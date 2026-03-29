'use client'

import { useClickSound } from '@/hooks/useClickSound'

export default function ExploreButton() {
  const { playClickSound } = useClickSound()

  return (
    <div className="inline-block">
      <button
        className="px-8 py-4 text-gray-900 rounded-lg font-medium text-base border-2 border-[#B0B0B0]"
        style={{
          backgroundColor: '#CECECE',
          boxShadow: 'inset 1px 1px 0px 0px rgba(255,255,255,0.8), inset -1px -1px 0px 0px rgba(0,0,0,0.2)',
          color: '#2C2C2C',
          textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)',
          fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
          fontSmooth: 'never',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'grayscale',
          imageRendering: 'pixelated',
          borderRadius: '0px',
          cursor: 'pointer'
        }}
        onMouseDown={playClickSound}
        onClick={() => {
          // 滾動到作品區域
          const portfolioSection = document.querySelector('.relative.z-20')
          if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        探索作品
      </button>
    </div>
  )
}
