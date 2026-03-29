'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import PortfolioGrid from '@/components/PortfolioGrid';
import { useClickSound } from '@/hooks/useClickSound';
import { createBrowserClient } from '@supabase/ssr';

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
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const { playClickSound, isInteracted, isPlaying } = useClickSound();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 檢查登入狀態
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
          
          // 初始檢查
          const { data: { session } } = await supabase.auth.getSession()
          console.log('Initial session check:', session?.user?.email)
          setSession(session)
          
          // 監聽認證狀態變化
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email)
            setSession(session)
          })
          
          return () => subscription.unsubscribe()
        }
      } catch (error) {
        console.error('檢查登入狀態失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    try {
      // 檢查環境變數
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      // 詳細的除錯資訊
      console.log('環境變數檢查:', {
        supabaseUrl: supabaseUrl,
        supabaseAnonKey: supabaseAnonKey ? '存在' : '不存在',
        envKeys: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
      })
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase 環境變數缺失:', {
          NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey
        })
        alert('系統配置錯誤，請聯繫管理員')
        return
      }
      
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('登入失敗:', error);
        alert('登入失敗，請稍後再試')
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      alert('登入發生錯誤，請稍後再試')
    }
  };

  const handleLogout = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('登出失敗:', error)
          alert('登出失敗，請稍後再試')
        } else {
          setSession(null)
        }
      }
    } catch (error) {
      console.error('登出錯誤:', error)
      alert('登出發生錯誤，請稍後再試')
    }
  };

  const handleAdminRedirect = () => {
    window.location.href = '/admin'
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Mac OS 9 Login Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        {!loading && (
          <div className="flex gap-2">
            {session && session?.user?.email?.toLowerCase() === 'jaggersu@gmail.com' ? (
              <>
                <button
                  onClick={handleAdminRedirect}
                  className="px-4 py-2 text-black font-mono text-sm"
                  style={{
                    backgroundColor: '#DDDDDD',
                    border: '1px solid #000000',
                    boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                    borderRadius: '0px',
                    fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                    fontSmooth: 'never',
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'grayscale',
                    imageRendering: 'pixelated',
                    cursor: 'pointer'
                  }}
                  onMouseDown={playClickSound}
                >
                  進入控制檯
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-black font-mono text-sm"
                  style={{
                    backgroundColor: '#DDDDDD',
                    border: '1px solid #000000',
                    boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                    borderRadius: '0px',
                    fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                    fontSmooth: 'never',
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'grayscale',
                    imageRendering: 'pixelated',
                    cursor: 'pointer'
                  }}
                  onMouseDown={playClickSound}
                >
                  登出
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-black font-mono text-sm"
                style={{
                  backgroundColor: '#DDDDDD',
                  border: '1px solid #000000',
                  boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                  borderRadius: '0px',
                  fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                  fontSmooth: 'never',
                  WebkitFontSmoothing: 'none',
                  MozOsxFontSmoothing: 'grayscale',
                  imageRendering: 'pixelated',
                  cursor: 'pointer'
                }}
                onMouseDown={playClickSound}
              >
                登入
              </button>
            )}
          </div>
        )}
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
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
             style={{
               transform: `translateY(${scrollY * 0.8}px)`, // Hero text moves down faster
               opacity: Math.max(0, 1 - scrollY / 600) // Text fades out faster
             }}>
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight inline-block"
            style={{
              color: '#2C2C2C',
              textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
            }}
          >
            Studio 99+
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed break-words"
             style={{ color: '#4A4A4A' }}>
            <span className="block">Timeless Soul, Lightning Speed.</span>
            <span className="block text-base sm:text-lg lg:text-xl mt-2">閃電般經典的靈魂</span>
          </p>
          
          {/* Classic Mac OS 9 Button */}
          <div className="inline-block">
            <button 
              className="px-8 py-4 bg-[#CECECE] text-gray-900 rounded-lg font-medium text-base
                       border-2 border-[#B0B0B0]
                       shadow-[inset_1px_1px_0px_0px_rgba(255,255,255,0.8),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.2)]
                       active:shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.3)]
                       transition-all duration-150
                       hover:bg-[#D0D0D0] hover:border-[#909090]
                       hover:shadow-[inset_1px_1px_0px_0px_rgba(255,255,255,0.9),inset_-1px_-1px_0px_0px_rgba(0,0,0,0.1)]
                       active:translate-x-[1px] active:translate-y-[1px]"
              style={{
                color: '#2C2C2C',
                textShadow: '0px 1px 0px rgba(255, 255, 255, 0.8)'
              }}
              onClick={playClickSound}
            >
              探索作品
            </button>
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
