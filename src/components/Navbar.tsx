'use client'

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

let supabase: ReturnType<typeof createClient> | null = null

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = 'https://xjlfnnjlyiveeyjundmu.supabase.co'
    const supabaseAnonKey = 'sb_publishable_ze0kZVWXNmcpfbjIUjBhIg_uN8fXsdS'
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      if (!supabase) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Mac OS 9 Window Frame */}
      <div className="relative bg-[#CECECE] border-b-2 border-[#808080]">
        {/* Pinstripes Background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.08) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.08) 3px
            )`,
            backgroundSize: '4px 4px'
          }}
        />
        {/* Window Controls */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FF0000] border border-[#808080]"></div>
          <div className="w-3 h-3 bg-[#00FF00] border border-[#808080]"></div>
          <div className="w-3 h-3 bg-[#0000FF] border border-[#808080]"></div>
        </div>
        {/* Window Title */}
        <div className="relative z-10 flex-1 text-center text-sm text-gray-700 font-medium" 
             style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.1)' }}>
          Studio 99+ Navigation
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 pt-8">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-xl font-light text-gray-900 cursor-pointer"
              style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.1)' }}
              onClick={() => router.push('/')}
            >
              Studio 99+
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              <div className="w-8 h-8 border-b-2 border-gray-300 rounded-full animate-spin"></div>
            ) : user ? (
              <>
                {(user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'designer') && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="px-4 py-2 bg-[#CECECE] text-gray-900 rounded font-medium text-sm
                             border-2 border-[#B0B0B0]
                             shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(255,255,255,0.5)]
                             active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                             transition-all duration-100
                             hover:bg-[#D0D0D0] hover:border-[#909090]"
                    style={{
                      boxShadow: '2px 2px 0px 0px rgba(255,255,255,0.8), inset 1px 1px 0px 0px rgba(255,255,255,0.5)'
                    }}
                  >
                    進入後台
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#CECECE] text-gray-900 rounded font-medium text-sm
                           border-2 border-[#B0B0B0]
                           shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(255,255,255,0.5)]
                           active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                           transition-all duration-100
                           hover:bg-[#D0D0D0] hover:border-[#909090]"
                  style={{
                    boxShadow: '2px 2px 0px 0px rgba(255,255,255,0.8), inset 1px 1px 0px 0px rgba(255,255,255,0.5)'
                  }}
                >
                  登出
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-[#CECECE] text-gray-900 rounded font-medium text-sm
                         border-2 border-[#B0B0B0]
                         shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(255,255,255,0.5)]
                         active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                         transition-all duration-100
                         hover:bg-[#D0D0D0] hover:border-[#909090]"
                style={{
                  boxShadow: '2px 2px 0px 0px rgba(255,255,255,0.8), inset 1px 1px 0px 0px rgba(255,255,255,0.5)'
                }}
              >
                登入
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#CECECE] text-gray-900 rounded font-medium text-sm
                       border-2 border-[#B0B0B0]
                       shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(255,255,255,0.5)]
                       active:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                       transition-all duration-100
                       hover:bg-[#D0D0D0] hover:border-[#909090]"
              style={{
                boxShadow: '2px 2px 0px 0px rgba(255,255,255,0.8), inset 1px 1px 0px 0px rgba(255,255,255,0.5)'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-[#B0B0B0] bg-[#CECECE]">
            <div className="flex flex-col space-y-3">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-b-2 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <>
                  {(user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'designer') && (
                    <button
                      onClick={() => {
                        router.push('/admin');
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-white text-gray-900 rounded font-medium text-sm
                               border-2 border-[#B0B0B0]
                               shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(0,0,0,0.05)]
                               active:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                               transition-all duration-100
                               hover:bg-[#F8F8F8] hover:border-[#909090]"
                    >
                      進入後台
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-white text-gray-900 rounded font-medium text-sm
                             border-2 border-[#B0B0B0]
                             shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(0,0,0,0.05)]
                             active:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                             transition-all duration-100
                             hover:bg-[#F8F8F8] hover:border-[#909090]"
                  >
                    登出
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-white text-gray-900 rounded font-medium text-sm
                           border-2 border-[#B0B0B0]
                           shadow-[1px_1px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_0px_0px_rgba(0,0,0,0.05)]
                           active:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.8),inset_1px_1px_2px_0px_rgba(0,0,0,0.1)]
                           transition-all duration-100
                           hover:bg-[#F8F8F8] hover:border-[#909090]"
                >
                  登入
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
