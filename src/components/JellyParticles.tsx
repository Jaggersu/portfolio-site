'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
  amplitude: number;
}

export default function JellyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Mac OS 9 Classic Colors
  const macColors = [
    '#0080FF', // 藍莓藍 (Blueberry Blue)
    '#00FF00', // 萊姆綠 (Lime Green)
    '#FF8000', // 橘子橙 (Orange)
    '#FF0080', // 草莓紅 (Strawberry Red)
    '#8000FF'  // 葡萄紫 (Grape Purple)
  ];

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

    // Initialize particles
    const particleCount = isMobile ? 30 : 60; // Optimized counts
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseX = Math.random() * canvas.width;
      const baseY = Math.random() * canvas.height;
      
      particles.push({
        x: baseX,
        y: baseY,
        baseX: baseX,
        baseY: baseY,
        size: Math.random() * 4 + 2, // 2-6px
        color: macColors[Math.floor(Math.random() * macColors.length)],
        vx: (Math.random() - 0.5) * 0.5, // Slow horizontal movement
        vy: (Math.random() - 0.5) * 0.5, // Slow vertical movement
        phase: Math.random() * Math.PI * 2, // Random phase for floating
        amplitude: Math.random() * 20 + 10 // Floating amplitude
      });
    }
    particlesRef.current = particles;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001; // Time for floating animation

      particlesRef.current.forEach((particle) => {
        // Floating animation
        particle.phase += 0.01;
        const floatX = Math.sin(particle.phase) * particle.amplitude * 0.3;
        const floatY = Math.cos(particle.phase * 0.7) * particle.amplitude * 0.2;

        // Update base position with slow movement
        particle.baseX += particle.vx;
        particle.baseY += particle.vy;

        // Wrap around screen edges
        if (particle.baseX < -50) particle.baseX = canvas.width + 50;
        if (particle.baseX > canvas.width + 50) particle.baseX = -50;
        if (particle.baseY < -50) particle.baseY = canvas.height + 50;
        if (particle.baseY > canvas.height + 50) particle.baseY = -50;

        // Calculate mouse interaction for 3D depth effect
        const dx = mouseRef.current.x - particle.baseX;
        const dy = mouseRef.current.y - particle.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = isMobile ? 80 : 120; // Interaction radius

        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;
        let opacity = 0.6;

        if (distance < maxDistance) {
          const influence = 1 - (distance / maxDistance);
          const repulsionForce = influence * 30; // Push away from mouse
          
          // Calculate repulsion direction
          const angle = Math.atan2(dy, dx);
          offsetX = Math.cos(angle) * repulsionForce;
          offsetY = Math.sin(angle) * repulsionForce;
          
          // Create depth effect - particles closer to mouse appear larger and more opaque
          scale = 1 + influence * 0.5;
          opacity = 0.6 + influence * 0.4;
        }

        // Apply floating and mouse interaction
        particle.x = particle.baseX + floatX + offsetX;
        particle.y = particle.baseY + floatY + offsetY;

        // Draw particle with jelly-like effect
        const currentSize = particle.size * scale;
        
        // Create gradient for jelly effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        );
        
        gradient.addColorStop(0, particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, particle.color + Math.floor(opacity * 0.5 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, particle.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow for particles near mouse
        if (distance < maxDistance) {
          ctx.shadowBlur = 10 * (1 - distance / maxDistance);
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
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
        opacity: isMobile ? 0.4 : 0.6,
        mixBlendMode: 'screen'
      }}
    />
  );
}
