import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AuthButtons from "@/components/AuthButtons";
import PortfolioGrid from "@/components/PortfolioGrid";
import "./globals.css";

export default async function HomePage() {
  const cookieStore = await cookies();
  
  // 伺服器端直接讀取 Supabase 通行證（無視 HttpOnly 限制）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = session?.user?.email || null;

  return (
    <div className="relative min-h-screen">
      {/* 右上角登入按鈕區域：把伺服器找到的 Email 直接傳給按鈕 */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButtons userEmail={userEmail} />
      </div>
      
      {/* 英雄區塊 (Hero Section) */}
      <div
        className="fixed inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          backgroundColor: '#CECECE',
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.05) 3px)`,
          backgroundSize: '4px 4px',
        }}
      >
        <div className="text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#333] mb-4 drop-shadow-md"
              style={{ fontFamily: '"Chicago", "Charcoal", sans-serif' }}>
            Studio 99+
          </h1>
          <div className="text-2xl sm:text-3xl lg:text-4xl text-[#444] mb-3 drop-shadow-sm"
               style={{ fontFamily: '"Chicago", "Charcoal", sans-serif' }}>
            Timeless Soul, Lightning Speed.
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-mono text-[#555] mb-8 drop-shadow-sm">
            閃電般經典的靈魂
          </div>
          
          {/* 探索作品按鈕 */}
          <button className="px-6 py-2 text-black font-mono bg-[#CECECE] border border-black shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_gray] active:shadow-[inset_1px_1px_0_gray,inset_-1px_-1px_0_white]">
            探索作品
          </button>
        </div>
      </div>

      {/* 作品集區塊 (Portfolio Section) */}
      <div className="relative z-20 pt-[100vh]"> 
        <div className="min-h-screen bg-[#CECECE]" 
             style={{
               backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.05) 3px)`,
               backgroundSize: '4px 4px'
             }}>
          <div className="container mx-auto px-4 py-16">
            <PortfolioGrid items={[
              { id: 1, title: "Mac OS 9 Portfolio", category: "Web Design", image: "/portfolio/mac-os9-portfolio.png", description: "經典的 Mac OS 9 風格" },
              { id: 2, title: "Retro UI Components", category: "UI/UX", image: "/portfolio/retro-components.png", description: "復古風格的 UI 組件庫" },
              { id: 3, title: "Pixel Art Gallery", category: "Digital Art", image: "/portfolio/pixel-art.png", description: "像素藝術作品展示" }
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}