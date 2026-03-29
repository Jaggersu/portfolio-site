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
      
      {/* Layer 2: Hero Section - Full Screen */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          height: '100vh',
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
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4"
            style={{
              fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
              fontSmooth: 'never',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'grayscale',
              imageRendering: 'pixelated',
              textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.02em'
            }}
          >
            <span className="block">Timeless Soul, Lightning Speed.</span>
            <span className="block text-base sm:text-lg lg:text-xl mt-2">經典的靈魂，閃電般的速度</span>
          </h1>
        </div>
      </div>

      {/* Layer 3: Portfolio Section - Below Hero */}
      <div className="relative z-20">
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
            <PortfolioGrid items={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}
