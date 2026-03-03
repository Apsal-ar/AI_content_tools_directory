"use client";

import React, { useRef, useCallback } from "react";

const PARTICLE_COLORS = ["#00FFFF", "#0066FF", "#FFFFFF"];
const PARTICLE_COUNT_MIN = 20;
const PARTICLE_COUNT_MAX = 30;
const DURATION_MS = 800;
const SIZE_MIN = 2;
const SIZE_MAX = 6;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  createdAt: number;
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomColor(): string {
  return PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
}

function createParticles(centerX: number, centerY: number): Particle[] {
  const count =
    PARTICLE_COUNT_MIN +
    Math.floor(Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN + 1));
  const particles: Particle[] = [];
  const now = performance.now();

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomInRange(80, 220);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    particles.push({
      x: centerX,
      y: centerY,
      vx,
      vy,
      size: randomInRange(SIZE_MIN, SIZE_MAX),
      color: randomColor(),
      opacity: 1,
      createdAt: now,
    });
  }

  return particles;
}

interface LogoParticleBurstProps {
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export function LogoParticleBurst({
  children,
  className = "",
  width = 80,
  height = 80,
}: LogoParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;

    const tick = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      let allDone = true;
      for (const p of particlesRef.current) {
        const age = now - p.createdAt;
        if (age >= DURATION_MS) continue;

        allDone = false;
        const t = age / 1000;
        const x = centerX + p.vx * t;
        const y = centerY + p.vy * t;
        const opacity = 1 - age / DURATION_MS;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!allDone) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    particlesRef.current = createParticles(centerX, centerY);
    tick();
  }, [width, height]);

  const handleMouseEnter = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    runAnimation();
  }, [runAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, width, height);
    }
    particlesRef.current = [];
  }, [width, height]);

  return (
    <div
      className={`relative inline-flex cursor-pointer select-none items-center justify-center ${className}`}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo stays visible and static underneath */}
      <div className="relative z-0 flex items-center justify-center">
        {children}
      </div>
      {/* Canvas overlay for particles - pointer-events none so hover stays on container */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="pointer-events-none absolute inset-0 z-10"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
