import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import PortfolioGrid from "@/components/PortfolioGrid";
import ExploreButton from "@/components/ExploreButton";
import AuthButtons from "@/components/AuthButtons";
import "./globals.css";

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
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
              secure: process.env.NODE_ENV === 'production'
            })
          } catch (error) {
            console.error('Cookie set error:', error)
          }
        },
        remove: (name: string, options: any) => {
          try {
            cookieStore.delete({
              name,
              ...options,
              path: '/'
            })
          } catch (error) {
            console.error('Cookie delete error:', error)
          }
        },
      },
    }
  )

  // 在伺服器端直接獲取 session
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="relative min-h-screen">
      {/* Mac OS 9 Login Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButtons session={session} />
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
        }}
      >
        {/* Hero Text */}
        <div className="text-center">
          <div className="mb-8">
            <h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-black mb-2"
              style={{
                fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                fontSmooth: 'never',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'grayscale',
                imageRendering: 'pixelated',
                textShadow: '3px 3px 0px rgba(255, 255, 255, 0.8), -2px -2px 0px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.02em',
                lineHeight: '1.1'
              }}
            >
              Studio 99+
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4"
                 style={{
                   fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                   fontSmooth: 'never',
                   WebkitFontSmoothing: 'none',
                   MozOsxFontSmoothing: 'grayscale',
                   imageRendering: 'pixelated',
                   textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.3)',
                   letterSpacing: '0.02em'
                 }}>
              Timeless Soul, Lightning Speed.
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono text-black"
                 style={{
                   fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                   fontSmooth: 'never',
                   WebkitFontSmoothing: 'none',
                   MozOsxFontSmoothing: 'grayscale',
                   imageRendering: 'pixelated',
                   textShadow: '1px 1px 0px rgba(255, 255, 255, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.3)',
                   letterSpacing: '0.02em'
                 }}>
              閃電般經典的靈魂
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Portfolio Section - Scrollable Content */}
      <div className="relative z-20 mt-screen pt-screen">
        <div className="min-h-screen bg-[#CECECE]" 
             style={{
               backgroundImage: `repeating-linear-gradient(
                 0deg,
                 rgba(0, 0, 0, 0.08) 0px,
                 transparent 1px,
                 transparent 2px,
                 rgba(0, 0, 0, 0.08) 3px
               )`,
               backgroundSize: '4px 4px'
             }}>
          <div className="container mx-auto px-4 py-16">
            <PortfolioGrid items={[
              {
                id: 1,
                title: "Mac OS 9 Portfolio",
                category: "Web Design",
                image: "/portfolio/mac-os9-portfolio.png",
                description: "經典的 Mac OS 9 風格作品集網站"
              },
              {
                id: 2,
                title: "Retro UI Components",
                category: "UI/UX",
                image: "/portfolio/retro-components.png",
                description: "復古風格的 UI 組件庫"
              },
              {
                id: 3,
                title: "Pixel Art Gallery",
                category: "Digital Art",
                image: "/portfolio/pixel-art.png",
                description: "像素藝術作品展示"
              }
            ]} />
          </div>
        </div>
      </div>
    </div>
  )
}
