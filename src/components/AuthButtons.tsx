'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useClickSound } from '@/hooks/useClickSound'

interface AuthButtonsProps {
  session: any
}

export default function AuthButtons({ session }: AuthButtonsProps) {
  const router = useRouter()
  const { playClickSound } = useClickSound()
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    console.log('=== 登入按鈕被點擊 ===')
    console.log('跳轉到登入頁面...')
    console.log('Router 狀態:', router)
    try {
      router.push('/login')
      console.log('router.push 已執行')
    } catch (error) {
      console.error('router.push 錯誤:', error)
      // 備用方案：直接使用 window.location
      window.location.href = '/login'
    }
  };

  const handleAdminRedirect = () => {
    console.log('跳轉中...')
    router.push('/admin')
  };

  const handleLogout = async () => {
    setLoading(true)
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
          window.location.href = '/'
        }
      }
    } catch (error) {
      console.error('登出錯誤:', error)
      alert('登出發生錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  };

  return (
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
            disabled={loading}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
            onMouseDown={playClickSound}
          >
            {loading ? '登出中...' : '登出'}
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
          onMouseDown={(e) => {
            console.log('=== onMouseDown 觸發 ===')
            playClickSound()
          }}
        >
          登入
        </button>
      )}
    </div>
  )
}
