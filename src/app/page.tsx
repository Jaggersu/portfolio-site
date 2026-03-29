import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ControlStrip from "@/components/ControlStrip";
import PortfolioGrid from "@/components/PortfolioGrid";
import AuthButtons from "@/components/AuthButtons";
import "./globals.css";

export const metadata = {
  title: "Studio 99+ - Portfolio",
  description: "Timeless Soul, Lightning Speed. Design portfolio showcasing creative works",
};

export default async function HomePage() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set: (name: string, value: string, options: any) => {
          cookieStore.set({
            name,
            value,
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
          })
        },
        remove: (name: string, options: any) => {
          cookieStore.delete({
            name,
            ...options,
            path: '/'
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="relative min-h-screen">
      {/* Mac OS 9 Login Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex flex-col items-end gap-2">
          {/* 除錯標籤 */}
          <div className="text-xs font-mono text-black bg-white px-2 py-1 border border-black">
            {session ? '已抓到 Session' : '無 Session'}
          </div>
          
          {/* 按鈕群組 */}
          <AuthButtons session={session} />
        </div>
      </div>
      {/* Layer 2: Hero Section - Fixed Position with Parallax */}
      <div 
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{
          backgroundColor: '#CECECE',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.08) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 3px
          )`,
          backgroundSize: '4px 4px',
          transform: 'translateY(0px)',
          opacity: 1
        }}
      >
        <div className="text-center z-20">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{
              fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
              fontSmooth: 'never',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'grayscale',
              imageRendering: 'pixelated',
              color: '#000000',
              textShadow: '2px 2px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em'
            }}
          >
            Studio 99+
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8"
            style={{
              fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
              fontSmooth: 'never',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'grayscale',
              imageRendering: 'pixelated',
              color: '#333333',
              textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(0,0,0,0.3)'
            }}
          >
            Timeless Soul, Lightning Speed
          </p>
          <PortfolioGrid items={portfolioItems} />
        </div>
      </div>
      {/* Layer 3: Control Strip - Bottom Left */}
      <ControlStrip />
    </div>
  );
}

const portfolioItems = [
  {
    id: 1,
    title: "品牌識別設計",
    category: "Brand Identity",
    image: "/next.svg",
    description: "為科技公司打造的現代化品牌識別系統"
  },
  {
    id: 2,
    title: "網站 UI 設計",
    category: "Web Design",
    image: "/next.svg",
    description: "簡潔優雅的電商平台用戶介面設計"
  },
  {
    id: 3,
    title: "包裝設計",
    category: "Packaging",
    image: "/window.svg",
    description: "環材質的產品包裝設計方案"
  },
  {
    id: 4,
    title: "海報設計",
    category: "Graphic Design",
    image: "/globe.svg",
    description: "音樂節活動視覺形象設計"
  },
  {
    id: 5,
    title: "插畫作品",
    category: "Illustration",
    image: "/file.svg",
    description: "數位插畫角色設計系列"
  },
  {
    id: 6,
    title: "動態設計",
    category: "Motion Design",
    image: "/next.svg",
    description: "品牌動態識別系統設計"
  }
]
