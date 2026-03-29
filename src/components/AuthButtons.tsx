'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButtons() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // 登入：跳轉到我們新蓋的專業登入頁
  const handleLogin = () => {
    router.push('/login');
  };

  // 進入控制檯：暴力跳轉到 /admin
  const handleAdmin = () => {
    window.location.href = '/admin';
  };

  // 登出：徹底清除並強制刷回首頁
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 強制全網頁重整，這是解決 Cookie 殘留最有效的方法
    window.location.href = '/';
  };

  if (loading) return <div className="px-4 py-1 text-sm font-mono">Checking...</div>;

  return (
    <div className="flex gap-2 items-center">
      {session && session.user?.email === 'jaggersu@gmail.com' ? (
        <>
          <button 
            onClick={handleAdmin}
            className="px-4 py-1 bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white text-sm shadow-sm"
          >
            進入控制檯
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-1 bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white text-sm shadow-sm"
          >
            登出
          </button>
        </>
      ) : (
        <button 
          onClick={handleLogin}
          className="px-4 py-1 bg-[#cccccc] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-white text-sm shadow-sm"
        >
          登入
        </button>
      )}
    </div>
  );
}
