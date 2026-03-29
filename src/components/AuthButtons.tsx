'use client';

import { useRouter } from 'next/navigation';

interface AuthButtonsProps {
  userEmail: string | undefined
}

export default function AuthButtons({ userEmail }: AuthButtonsProps) {
  const router = useRouter();

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
    // 使用 browser client 進行登出
    const { createBrowserClient } = await import('@supabase/ssr');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.auth.signOut();
    // 強制全網頁重整，這是解決 Cookie 殘留最有效的方法
    window.location.href = '/';
  };

  return (
    <div className="flex gap-2 items-center">
      {userEmail === 'jaggersu@gmail.com' || userEmail === 'sujagger.104@gmail.com' ? (
        <>
          <button 
            onClick={handleAdmin}
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
        >
          登入
        </button>
      )}
    </div>
  );
}
