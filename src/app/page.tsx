'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import PortfolioGrid from "@/components/PortfolioGrid";
import ExploreButton from "@/components/ExploreButton";
import AuthButtons from "@/components/AuthButtons";
import "./globals.css";

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
          
          // 檢查 Cookie 狀態
          console.log('=== 頁面載入檢查 ===')
          console.log('所有 Cookie:', document.cookie)
          console.log('Supabase URL:', supabaseUrl)
          console.log('Supabase Key:', supabaseAnonKey ? '存在' : '缺失')
          
          // 初始檢查
          const { data: { session } } = await supabase.auth.getSession()
          console.log('初始 Session:', session?.user?.email || '無 Session')
          setSession(session)
          
          // 監聽認證狀態變化
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('=== Auth State Change ===')
            console.log('Event:', event)
            console.log('Session:', session?.user?.email || '無 Session')
            console.log('所有 Cookie:', document.cookie)
            console.log('========================')
            setSession(session)
            
            // 強制重新檢查一次
            setTimeout(async () => {
              const { data: { session: recheckSession } } = await supabase.auth.getSession()
              console.log('重新檢查 Session:', recheckSession?.user?.email || '無 Session')
              setSession(recheckSession)
            }, 1000)
          })
          
          return () => subscription.unsubscribe()
        }
      } catch (error) {
        console.error('檢查 Session 失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
    
    // 定期檢查 Session（備用方案）
    const interval = setInterval(async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          if (currentSession && !sessionEquals(currentSession, sessionRef.current)) {
            console.log('定期檢查發現 Session 變化:', currentSession?.user?.email)
            setSession(currentSession)
          }
        }
      } catch (error) {
        console.error('定期檢查失敗:', error)
      }
    }, 3000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  // 比較兩個 session 是否相同
  const sessionEquals = (s1: any, s2: any) => {
    if (!s1 && !s2) return true
    if (!s1 || !s2) return false
    return s1.user?.email === s2.user?.email
  }

  // 保存當前 session 的 ref
  const sessionRef = useRef(session)
  sessionRef.current = session

  return (
    <div className="relative min-h-screen">
      {/* Mac OS 9 Login Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButtons />
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
          backgroundAttachment: 'fixed',
          transform: 'none',
          opacity: 1
        }}
      >
        {/* Pure Hero Section - No Window Frame */}
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight inline-block"
            style={{
              fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
              fontSmooth: 'never',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'grayscale',
              imageRendering: 'pixelated',
              color: '#2C2C2C',
              textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
            }}
          >
            Studio 99+
          </h1>
          <p 
            className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed break-words"
            style={{
              fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
              fontSmooth: 'never',
              WebkitFontSmoothing: 'none',
              MozOsxFontSmoothing: 'grayscale',
              imageRendering: 'pixelated',
              color: '#4A4A4A'
            }}
          >
            <span className="block">Timeless Soul, Lightning Speed.</span>
            <span className="block text-base sm:text-lg lg:text-xl mt-2">閃電般經典的靈魂</span>
          </p>

          {/* Classic Mac OS 9 Button */}
          <div className="inline-block">
            <ExploreButton />
          </div>
        </div>
      </div>

      {/* Layer 3: Portfolio Grid - Highest level with normal scrolling */}
      <div className="relative z-20">
        {/* Spacer to push down content */}
        <div className="h-screen" />

        {/* Portfolio Grid */}
        <PortfolioGrid items={portfolioItems} />
      </div>
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
