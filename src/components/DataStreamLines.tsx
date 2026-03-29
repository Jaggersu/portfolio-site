'use client';

import { useEffect, useRef, useState } from 'react';

interface StreamLine {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  thickness: number;
  opacity: number;
  color: string;
  warpFactor: number;
}

export default function DataStreamLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const streamLinesRef = useRef<StreamLine[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stream lines
    const lineCount = isMobile ? 8 : 15; // Reduced for mobile
    const streamLines: StreamLine[] = [];

    for (let i = 0; i < lineCount; i++) {
      streamLines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        thickness: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: `rgba(0, 150, 255, ${Math.random() * 0.3 + 0.2})`, // Jelly blue
        warpFactor: 0
      });
    }
    streamLinesRef.current = streamLines;

    // Mouse/Touch tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.prevX = mouseRef.current.x;
        mouseRef.current.prevY = mouseRef.current.y;
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate mouse velocity for warp effect
      const mouseVelocityX = mouseRef.current.x - mouseRef.current.prevX;
      const mouseVelocityY = mouseRef.current.y - mouseRef.current.prevY;
      const mouseSpeed = Math.sqrt(mouseVelocityX ** 2 + mouseVelocityY ** 2);

      // Update and draw stream lines
      streamLinesRef.current.forEach((line) => {
        // Calculate distance to mouse
        const dx = mouseRef.current.x - line.x;
        const dy = mouseRef.current.y - line.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Warp effect based on mouse proximity and speed
        if (distance < 200 && mouseSpeed > 0) {
          const influence = (1 - distance / 200) * mouseSpeed * 0.1;
          line.warpFactor = Math.min(line.warpFactor + influence, 2);
        } else {
          line.warpFactor *= 0.95; // Gradually reduce warp
        }

        // Update position with warp
        const warpAngle = line.angle + (line.warpFactor * 0.2);
        const warpSpeed = line.speed * (1 + line.warpFactor * 0.5);
        
        line.x += Math.cos(warpAngle) * warpSpeed;
        line.y += Math.sin(warpAngle) * warpSpeed;
        line.angle += (Math.random() - 0.5) * 0.02; // Slight angle variation

        // Wrap around edges
        if (line.x < -line.length) line.x = canvas.width + line.length;
        if (line.x > canvas.width + line.length) line.x = -line.length;
        if (line.y < -line.length) line.y = canvas.height + line.length;
        if (line.y > canvas.height + line.length) line.y = -line.length;

        // Draw stream line with warp effect
        const endX = line.x + Math.cos(line.angle + line.warpFactor * 0.3) * line.length;
        const endY = line.y + Math.sin(line.angle + line.warpFactor * 0.3) * line.length;

        // Create gradient for jelly-like effect
        const gradient = ctx.createLinearGradient(line.x, line.y, endX, endY);
        
        if (isMobile) {
          // Simpler for mobile
          gradient.addColorStop(0, `rgba(0, 150, 255, ${line.opacity})`);
          gradient.addColorStop(1, `rgba(0, 150, 255, 0)`);
        } else {
          // Full jelly effect
          gradient.addColorStop(0, `rgba(0, 180, 255, ${line.opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 200, 255, ${line.opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(0, 120, 255, 0)`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.thickness * (1 + line.warpFactor * 0.3);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        
        // Add warp curve
        if (line.warpFactor > 0.1 && !isMobile) {
          const controlX = (line.x + endX) / 2 + Math.sin(line.angle + Math.PI / 2) * line.warpFactor * 20;
          const controlY = (line.y + endY) / 2 + Math.cos(line.angle + Math.PI / 2) * line.warpFactor * 20;
          ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        } else {
          ctx.lineTo(endX, endY);
        }
        
        ctx.stroke();

        // Draw glow effect for high warp
        if (line.warpFactor > 0.5 && !isMobile) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(0, 200, 255, 0.5)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', checkMobile);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        opacity: isMobile ? 0.4 : 0.7,
        mixBlendMode: 'screen'
      }}
    />
  );
}
