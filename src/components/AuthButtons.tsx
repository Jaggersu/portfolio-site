'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化 Supabase Browser Client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email ?? null);
      setLoading(false);
    };

    checkSession();

    // 監聽登入狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleAdmin = () => {
    window.location.href = '/admin';
  };

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return null; // 載入時不顯示，避免畫面閃爍

  const isVIP = userEmail === 'jaggersu@gmail.com' || userEmail === 'sujagger.104@gmail.com';

  return (
    <div className="flex gap-2 items-center">
      {isVIP ? (
        <>
          <button 
            onClick={handleAdmin}
            className="px-4 py-1 text-black font-mono text-sm bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white shadow-sm"
          >
            進入控制檯
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-1 text-black font-mono text-sm bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white shadow-sm"
          >
            登出
          </button>
        </>
      ) : (
        <button 
          onClick={handleLogin}
          className="px-4 py-1 text-black font-mono text-sm bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white shadow-sm"
        >
          登入
        </button>
      )}
    </div>
  );
}