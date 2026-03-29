'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useClickSound } from '@/hooks/useClickSound'
import './globals.css'

export default function LoginPage() {
  const router = useRouter()
  const { playClickSound } = useClickSound()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase 環境變數缺失')
        alert('系統配置錯誤，請聯繫管理員')
        return
      }
      
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google 登入失敗:', error)
        alert('登入失敗，請稍後再試')
      }
    } catch (error) {
      console.error('登入錯誤:', error)
      alert('登入發生錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleLogin = () => {
    playClickSound()
    alert('Apple 登入功能開發中')
  }

  const handleWeb3Login = () => {
    playClickSound()
    alert('虛擬錢包功能開發中')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase 環境變數缺失')
        alert('系統配置錯誤，請聯繫管理員')
        return
      }
      
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Email 登入失敗:', error)
        alert('登入失敗，請檢查帳號密碼')
      } else {
        router.push('/admin')
      }
    } catch (error) {
      console.error('登入錯誤:', error)
      alert('登入發生錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#CECECE]" 
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
      {/* Mac OS 9 Window */}
      <div className="relative" style={{ width: '400px' }}>
        {/* Title Bar */}
        <div className="bg-[#C0C0C0] px-2 py-1 flex items-center justify-between"
             style={{
               borderTop: '1px solid #FFFFFF',
               borderBottom: '1px solid #808080',
               borderLeft: '1px solid #FFFFFF',
               borderRight: '1px solid #808080',
               boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)'
             }}>
          {/* Three Horizontal Lines */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-black"></div>
            <div className="w-4 h-0.5 bg-black"></div>
            <div className="w-4 h-0.5 bg-black"></div>
          </div>
          
          {/* Title */}
          <div className="text-xs font-mono text-black" 
               style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}>
            Studio 99+ 登入
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => router.push('/')}
            className="w-4 h-4 bg-[#C0C0C0] border border-black flex items-center justify-center"
            style={{
              boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)'
            }}
            onMouseDown={playClickSound}
          >
            <span className="text-xs">×</span>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="bg-white p-6"
             style={{
               borderTop: 'none',
               borderBottom: '2px solid #808080',
               borderLeft: '2px solid #808080',
               borderRight: '2px solid #808080',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
             }}>
          
          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-mono text-black mb-1"
                     style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#E0E0E0] border-2 border-[#808080] font-mono"
                style={{
                  boxShadow: 'inset 1px 1px 0px rgba(0, 0, 0, 0.3), inset -1px -1px 0px rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                  fontSmooth: 'never',
                  WebkitFontSmoothing: 'none',
                  MozOsxFontSmoothing: 'grayscale',
                  imageRendering: 'pixelated',
                  outline: 'none'
                }}
                required
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-xs font-mono text-black mb-1"
                     style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#E0E0E0] border-2 border-[#808080] font-mono"
                style={{
                  boxShadow: 'inset 1px 1px 0px rgba(0, 0, 0, 0.3), inset -1px -1px 0px rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                  fontSmooth: 'never',
                  WebkitFontSmoothing: 'none',
                  MozOsxFontSmoothing: 'grayscale',
                  imageRendering: 'pixelated',
                  outline: 'none'
                }}
                required
              />
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-black font-mono text-sm font-bold"
              style={{
                backgroundColor: '#DDDDDD',
                border: '2px solid #808080',
                boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
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
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black"></div>
            </div>
            <div className="relative flex justify-center text-xs font-mono text-black bg-white px-2"
                 style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}>
              或使用以下方式驗證
            </div>
          </div>
          
          {/* Third Party Login */}
          <div className="flex gap-2 justify-center">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex-1 py-2 text-black font-mono text-xs flex flex-col items-center justify-center gap-1"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #808080',
                boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                fontSmooth: 'never',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'grayscale',
                imageRendering: 'pixelated',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                minWidth: '100px'
              }}
              onMouseDown={playClickSound}
            >
              <span className="text-base">🌐</span>
              <span>Google</span>
            </button>
            
            {/* Apple Login */}
            <button
              onClick={handleAppleLogin}
              disabled={loading}
              className="flex-1 py-2 text-black font-mono text-xs flex flex-col items-center justify-center gap-1"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #808080',
                boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                fontSmooth: 'never',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'grayscale',
                imageRendering: 'pixelated',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                minWidth: '100px'
              }}
              onMouseDown={playClickSound}
            >
              <span className="text-base">🍎</span>
              <span>Apple</span>
            </button>
            
            {/* Web3 Wallet Login */}
            <button
              onClick={handleWeb3Login}
              disabled={loading}
              className="flex-1 py-2 text-black font-mono text-xs flex flex-col items-center justify-center gap-1"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #808080',
                boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)',
                fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif',
                fontSmooth: 'never',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'grayscale',
                imageRendering: 'pixelated',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                minWidth: '100px'
              }}
              onMouseDown={playClickSound}
            >
              <span className="text-base">💳</span>
              <span>Web3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
