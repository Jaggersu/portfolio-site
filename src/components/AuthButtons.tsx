'use client';

import { createBrowserClient } from '@supabase/ssr';

export default function AuthButtons({ userEmail }: { userEmail: string | null }) {
  // 檢查是否為牛哥的信箱
  const isVIP = userEmail === 'jaggersu@gmail.com' || userEmail === 'sujagger.104@gmail.com';

  const handleLogin = () => {
    window.location.href = '/login';
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
    window.location.href = '/'; // 登出後強制重整首頁
  };

  // 經典 Mac OS 9 按鈕樣式
  const btnStyle = "px-4 py-1 text-black font-mono text-sm bg-[#CECECE] border border-black shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_gray] active:shadow-[inset_1px_1px_0_gray,inset_-1px_-1px_0_white]";

  return (
    <div className="flex gap-2 items-center">
      {isVIP ? (
        <>
          <button onClick={handleAdmin} className={btnStyle}>進入控制檯</button>
          <button onClick={handleLogout} className={btnStyle}>登出</button>
        </>
      ) : (
        <button onClick={handleLogin} className={btnStyle}>登入</button>
      )}
    </div>
  );
}