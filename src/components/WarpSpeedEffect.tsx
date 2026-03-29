'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  color: string;
}

export default function WarpSpeedEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
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

    // Initialize stars
    const starCount = isMobile ? 150 : 300; // More stars for desktop
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * 1000,
        prevX: 0,
        prevY: 0,
        color: Math.random() > 0.5 ? '#E5E5E5' : '#B0D0FF' // White-gray and light blue
      });
    }
    starsRef.current = stars;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left - canvas.width / 2,
        y: e.clientY - rect.top - canvas.height / 2
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left - canvas.width / 2,
          y: e.touches[0].clientY - rect.top - canvas.height / 2
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Mouse influence on perspective center
      const perspectiveX = mouseRef.current.x * 0.1;
      const perspectiveY = mouseRef.current.y * 0.1;

      // Sort stars by z-index for proper rendering
      starsRef.current.sort((a, b) => b.z - a.z);

      starsRef.current.forEach((star) => {
        // Store previous position for trail effect
        star.prevX = (star.x / star.z) * 100 + centerX + perspectiveX;
        star.prevY = (star.y / star.z) * 100 + centerY + perspectiveY;

        // Move star towards viewer
        star.z -= isMobile ? 8 : 12; // Slower on mobile
        
        // Reset star if it goes behind viewer
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
          star.z = 1000;
          star.prevX = star.x;
          star.prevY = star.y;
        }

        // Calculate screen position
        const x = (star.x / star.z) * 100 + centerX + perspectiveX;
        const y = (star.y / star.z) * 100 + centerY + perspectiveY;

        // Calculate size based on distance
        const size = (1 - star.z / 1000) * 3;
        const opacity = 1 - star.z / 1000;

        // Draw star trail (warp effect)
        if (!isMobile && star.z < 800) {
          const trailLength = (1 - star.z / 1000) * 50;
          const gradient = ctx.createLinearGradient(star.prevX, star.prevY, x, y);
          
          gradient.addColorStop(0, `${star.color}00`);
          gradient.addColorStop(1, star.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));

          ctx.strokeStyle = gradient;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(star.prevX, star.prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        // Draw star
        ctx.fillStyle = star.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
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
        opacity: isMobile ? 0.3 : 0.5,
        mixBlendMode: 'screen'
      }}
    />
  );
}
