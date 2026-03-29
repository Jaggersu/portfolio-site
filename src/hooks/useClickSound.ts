'use client';

import { useEffect, useRef, useState } from 'react';

export function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isInteracted, setIsInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 只在 Client Side 執行
    if (typeof window !== 'undefined') {
      try {
        audioRef.current = new Audio('/sounds/click.mp3');
        
        // 預載音效檔案
        audioRef.current.load();
        
        // 設定音效屬性
        if (audioRef.current) {
          audioRef.current.volume = 0.3; // 音量 30%
          audioRef.current.preload = 'auto';
          audioRef.current.loop = false; // 不循環播放
          
          // 監聽播放結束事件
          audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
          });
        }

        // 監聽使用者第一次互動，解決 Autoplay policy
        const handleFirstInteraction = () => {
          setIsInteracted(true);
          // 播放一次無聲音效來"喚醒"音頻上下文
          if (audioRef.current) {
            audioRef.current.volume = 0;
            audioRef.current.play().then(() => {
              audioRef.current!.volume = 0.3;
            }).catch(() => {
              audioRef.current!.volume = 0.3;
            });
          }
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };

        // 監聽多種互動事件
        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });

      } catch (error) {
        console.warn('音效檔案載入失敗:', error);
      }
    }

    // 清理函數
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current = null;
      }
    };
  }, []);

  const playClickSound = () => {
    if (audioRef.current && !isPlaying) {
      try {
        setIsPlaying(true);
        
        // 重置音效到開頭位置，確保可以快速重複觸發
        audioRef.current.currentTime = 0;
        
        // 播放音效
        const playPromise = audioRef.current.play();
        
        // 處理自動播放政策
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('音效播放失敗:', error);
            setIsPlaying(false);
          });
        }
      } catch (error) {
        console.warn('音效播放錯誤:', error);
        setIsPlaying(false);
      }
    }
  };

  return { playClickSound, isInteracted, isPlaying };
}
