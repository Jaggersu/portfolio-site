import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ControlStrip from "@/components/ControlStrip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio 99+ - Portfolio",
  description: "Timeless Soul, Lightning Speed. Design portfolio showcasing creative works",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body 
        className="min-h-full flex flex-col bg-[#CECECE] relative"
        suppressHydrationWarning={true}
      >
        {/* Layer 1: Fixed Pinstripes Background - z-index: 1 */}
        <div 
          className="fixed inset-0 pointer-events-none z-1"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.08) 0px,
              transparent 1px,
              transparent 2px,
              rgba(0, 0, 0, 0.08) 3px
            )`,
            backgroundSize: '4px 4px',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-full">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
