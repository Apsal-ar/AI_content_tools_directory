"use client";

import React, { useRef, useEffect, useState } from "react";

const PETAL_PATH =
  "M 100 4 C 112 38 116 52 100 56 C 84 52 88 38 100 4 Z";
const DOT_RINGS = [
  { r: 52, size: 5, offset: 0 },
  { r: 38, size: 4, offset: 11.25 },
  { r: 26, size: 3, offset: 0 },
  { r: 14, size: 2, offset: 11.25 },
];
const DOTS_PER_RING = 16;
const CENTER = 100;
const ANGLE_STEP = 360 / DOTS_PER_RING;

interface MandalaLogoProps {
  size?: number;
  className?: string;
}

export default function MandalaLogo({
  size = 200,
  className = "",
}: MandalaLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isRippleOut, setIsRippleOut] = useState(false);
  const [isBurst, setIsBurst] = useState(false);
  const [isSpeedUp, setIsSpeedUp] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      setIsRippleOut(false);
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsRippleOut(true);
      setIsHovered(true);
      leaveTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        setIsRippleOut(false);
        leaveTimeoutRef.current = null;
      }, 2500);
    };

    const handleClick = () => {
      setIsBurst(true);
      setIsSpeedUp(true);
      setTimeout(() => setIsBurst(false), 600);
      setTimeout(() => setIsSpeedUp(false), 1000);
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", handleClick);
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("click", handleClick);
    };
  }, []);

  const rippleClass = isHovered
    ? isRippleOut
      ? "mandala-ripple-out"
      : "mandala-ripple-in"
    : "";
  const burstClass = isBurst ? "mandala-burst" : "";
  const speedClass = isSpeedUp ? "mandala-speed-up" : "";

  return (
    <div
      ref={containerRef}
      className={`mandala-logo inline-block cursor-pointer select-none ${rippleClass} ${burstClass} ${speedClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes mandala-rotate-cw {
          to { transform: rotate(360deg); }
        }
        @keyframes mandala-rotate-ccw {
          to { transform: rotate(-360deg); }
        }
        .mandala-petals {
          animation: mandala-rotate-cw 30s linear infinite;
          transform-origin: 50% 50%;
        }
        .mandala-speed-up .mandala-petals {
          animation-duration: 15s;
        }
        .mandala-dots {
          animation: mandala-rotate-ccw 30s linear infinite;
          transform-origin: 50% 50%;
        }
        .mandala-speed-up .mandala-dots {
          animation-duration: 15s;
        }
        @keyframes mandala-glow-in {
          0% { opacity: 1; filter: drop-shadow(0 0 2px #00FFFF); }
          10% { opacity: 1; filter: drop-shadow(0 0 12px #00FFFF) drop-shadow(0 0 4px #FFFFFF); }
          90% { opacity: 1; filter: drop-shadow(0 0 12px #00FFFF) drop-shadow(0 0 4px #FFFFFF); }
          100% { opacity: 1; filter: drop-shadow(0 0 2px #00FFFF); }
        }
        .mandala-ripple-in .mandala-ring-1 { animation: mandala-glow-in 0.5s ease-out; }
        .mandala-ripple-in .mandala-ring-2 { animation: mandala-glow-in 0.5s 0.5s ease-out; }
        .mandala-ripple-in .mandala-ring-3 { animation: mandala-glow-in 0.5s 1s ease-out; }
        .mandala-ripple-in .mandala-ring-4 { animation: mandala-glow-in 0.5s 1.5s ease-out; }
        .mandala-ripple-in .mandala-petals-wrap { animation: mandala-glow-in 0.5s 2s ease-out; }
        .mandala-ripple-out .mandala-petals-wrap { animation: mandala-glow-in 0.5s ease-out; }
        .mandala-ripple-out .mandala-ring-4 { animation: mandala-glow-in 0.5s 0.5s ease-out; }
        .mandala-ripple-out .mandala-ring-3 { animation: mandala-glow-in 0.5s 1s ease-out; }
        .mandala-ripple-out .mandala-ring-2 { animation: mandala-glow-in 0.5s 1.5s ease-out; }
        .mandala-ripple-out .mandala-ring-1 { animation: mandala-glow-in 0.5s 2s ease-out; }
        @keyframes mandala-burst-flash {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 2px #00FFFF); }
          15% { filter: brightness(3) drop-shadow(0 0 16px #FFFFFF); }
          100% { filter: brightness(1) drop-shadow(0 0 2px #00FFFF); }
        }
        .mandala-burst .mandala-dot,
        .mandala-burst .mandala-petal-path {
          animation: mandala-burst-flash 0.6s ease-out;
        }
      `}</style>

      <svg
        viewBox="0 0 200 200"
        className="block w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Background circle (black) */}
        <circle cx={CENTER} cy={CENTER} r="98" fill="#000000" />

        {/* Inner dots - 4 concentric rings */}
        <g className={`mandala-dots ${speedClass}`}>
          {DOT_RINGS.map((ring, ringIndex) => (
            <g
              key={ringIndex}
              className={`mandala-ring mandala-ring-${ringIndex + 1}`}
            >
              {Array.from({ length: DOTS_PER_RING }).map((_, i) => {
                const angle =
                  ((i * ANGLE_STEP + ring.offset) * Math.PI) / 180;
                const x = CENTER + ring.r * Math.sin(angle);
                const y = CENTER - ring.r * Math.cos(angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={ring.size}
                    fill="#00FFFF"
                    className="mandala-dot"
                    style={{
                      filter: "drop-shadow(0 0 3px #00FFFF)",
                    }}
                  />
                );
              })}
            </g>
          ))}
        </g>

        {/* Outer petals - 16 pointed petals */}
        <g className={`mandala-petals ${speedClass}`} style={{ transformOrigin: "100px 100px" }}>
          <g className="mandala-petals-wrap" style={{ transformOrigin: "100px 100px" }}>
          {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={i}
                d={PETAL_PATH}
                fill="#0a1628"
                className="mandala-petal-path"
                transform={`rotate(${i * 22.5} ${CENTER} ${CENTER})`}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(10, 22, 40, 0.8))",
                }}
              />
          ))}
          </g>
        </g>

        {/* Center black void */}
        <circle cx={CENTER} cy={CENTER} r="6" fill="#000000" />
      </svg>
    </div>
  );
}
