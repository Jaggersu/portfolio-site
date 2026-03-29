import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AuthButtons from "@/components/AuthButtons";
import PortfolioGrid from "@/components/PortfolioGrid";
import "./globals.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        {/* Hero Text */}
        <div className="text-center">
          <div className="mb-8">
            <h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-black mb-2"
              style={{
                fontFamily: '"Chicago", "Charcoal", "Geneva", sans-serif',
                fontWeight: 900,
                textShadow: '1px 1px 0px white',
                letterSpacing: '0.02em',
                lineHeight: '1.1'
              }}
            >
              Studio 99+
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4"
                 style={{
                   fontFamily: '"Chicago", "Charcoal", "Geneva", sans-serif',
                   fontWeight: 900,
                   textShadow: '1px 1px 0px white',
                   letterSpacing: '0.02em'
                 }}>
              Timeless Soul, Lightning Speed.
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono text-black"
                 style={{
                   fontFamily: '"Chicago", "Charcoal", "Geneva", sans-serif',
                   fontWeight: 900,
                   textShadow: '1px 1px 0px white',
                   letterSpacing: '0.02em'
                 }}>
              經典的靈魂，閃電般的速度
            </div>
          </div>
        </div>
      </div>

      {/* 作品集區塊 (Portfolio Section) */}
      <div className="relative z-20 mt-[100vh] pt-20"> 
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