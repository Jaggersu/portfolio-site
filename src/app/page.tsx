import PortfolioGrid from "@/components/PortfolioGrid";
import AuthButtons from "@/components/AuthButtons";
import "./globals.css";

// 這裡我們不再用伺服器去查 Session，全部交給右上角的按鈕自己去查，這樣就不會當機。
export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* 右上角登入按鈕區域 */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButtons />
      </div>
      
      {/* 英雄區塊 (Hero Section) */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{
          backgroundColor: '#CECECE',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.08) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 3px
          )`,
          backgroundSize: '4px 4px',
        }}
      >
        <div className="text-center">
          <div className="mb-8">
            <h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-black mb-2"
              style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}
            >
              Studio 99+
            </h1>
            <div 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4"
              style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}
            >
              Timeless Soul, Lightning Speed.
            </div>
            <div 
              className="text-lg sm:text-xl lg:text-2xl font-mono text-black"
              style={{ fontFamily: '"Chicago", "Charcoal", "Geneva", "Helvetica", Arial, sans-serif' }}
            >
              閃電般經典的靈魂
            </div>
          </div>
        </div>
      </div>

      {/* 作品集區塊 (Portfolio Section) */}
      <div className="relative z-20 pt-[100vh]"> 
        {/* pt-[100vh] 確保作品集剛好在 Hero Section 往下滾動一整頁的位置，不再重疊 */}
        <div className="min-h-screen bg-[#CECECE]" 
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
          <div className="container mx-auto px-4 py-16">
            <PortfolioGrid items={[
              {
                id: 1,
                title: "Mac OS 9 Portfolio",
                category: "Web Design",
                image: "/portfolio/mac-os9-portfolio.png",
                description: "經典的 Mac OS 9 風格作品集網站"
              },
              {
                id: 2,
                title: "Retro UI Components",
                category: "UI/UX",
                image: "/portfolio/retro-components.png",
                description: "復古風格的 UI 組件庫"
              },
              {
                id: 3,
                title: "Pixel Art Gallery",
                category: "Digital Art",
                image: "/portfolio/pixel-art.png",
                description: "像素藝術作品展示"
              }
            ]} />
          </div>
        </div>
      </div>
    </div>
  )
}