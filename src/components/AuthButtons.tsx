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

  // 經典 Platinum 按鈕樣式
  const btnStyle = {
    backgroundColor: '#CECECE',
    border: '1px solid #000',
    boxShadow: 'inset 1.5px 1.5px 0px #fff, inset -1.5px -1.5px 0px #808080',
    color: 'black',
    fontFamily: '"Chicago", sans-serif',
    fontWeight: 'bold',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '0px'
  };

  return (
    <div className="flex gap-2 items-center">
      {isVIP ? (
        <>
          <button onClick={handleAdmin} style={btnStyle}>進入控制檯</button>
          <button onClick={handleLogout} style={btnStyle}>登出</button>
        </>
      ) : (
        <button onClick={handleLogin} style={btnStyle}>登入</button>
      )}
    </div>
  );
}