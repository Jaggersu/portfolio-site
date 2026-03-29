'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 初始化 Supabase Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
    };

    checkSession();

    // 監聽登入狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
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
        <div className="text-black font-mono">Checking...</div>
      </div>
    );
  }

  if (!session || !['jaggersu@gmail.com', 'sujagger.104@gmail.com'].includes(session.user?.email)) {
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
        <div className="text-center">
          <div className="mb-4 text-black font-mono">請先登入</div>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-1 bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white text-sm shadow-sm"
          >
            登入
          </button>
        </div>
      </div>
    );
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
            Studio 99+ 控制檯
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => router.push('/')}
            className="w-4 h-4 bg-[#C0C0C0] border border-black flex items-center justify-center"
            style={{
              boxShadow: 'inset 1px 1px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 0px rgba(0, 0, 0, 0.5)'
            }}
          >
            <span className="text-xs">×</span>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="bg-white p-6 text-center"
             style={{
               borderTop: 'none',
               borderBottom: '2px solid #808080',
               borderLeft: '2px solid #808080',
               borderRight: '2px solid #808080',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
             }}>
          <h1 className="text-2xl font-mono text-black mb-4" 
              style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}>
            歡迎進入 Studio 99+ 控制檯
          </h1>
          <p className="text-sm font-mono text-gray-600 mb-4">
            {session.user?.email}
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-1 bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white text-sm shadow-sm"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
