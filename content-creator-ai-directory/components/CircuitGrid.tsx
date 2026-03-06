"use client";

import { useRef, useEffect } from "react";

interface CircuitGridProps {
  /** Ellipse horizontal radius as fraction of canvas width (default 0.32) */
  ellipseRx?: number;
  /** Ellipse vertical radius as fraction of canvas height (default 0.45) */
  ellipseRy?: number;
  /** Fade zone width in px near ellipse boundary (default 90) */
  fadeZone?: number;
  /** Base grid line opacity (default 0.10) */
  lineOpacity?: number;
  /** Dot fill opacity multiplier (default 0.5) */
  dotOpacity?: number;
  /** Dot glow shadowBlur (default 6) */
  dotBlur?: number;
  /** Dot glow shadowColor opacity multiplier (default 0.6) */
  dotGlowOpacity?: number;
  /** Dot frequency: draw dot when (col+row) % n === 0 (default 3) */
  dotFrequency?: number;
  /** Vertical fade: top clear zone end as fraction of height (default 0.05) */
  vFadeTop?: number;
  /** Vertical fade: bottom clear zone start as fraction of height (default 0.75) */
  vFadeBottom?: number;
}

export function CircuitGrid({
  ellipseRx      = 0.32,
  ellipseRy      = 0.45,
  fadeZone       = 90,
  lineOpacity    = 0.10,
  dotOpacity     = 0.5,
  dotBlur        = 6,
  dotGlowOpacity = 0.6,
  dotFrequency   = 3,
  vFadeTop       = 0.05,
  vFadeBottom    = 0.75,
}: CircuitGridProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const CELL = 44;
    const cx = w / 2;
    const cy = h / 2;
    const rx = w * ellipseRx;
    const ry = h * ellipseRy;

    const FADE = fadeZone;
    const BASE = lineOpacity;

    // ─── Ellipse boundary helpers ───────────────────────────────────────────
    // Returns left/right boundary x at a given y (or null when outside ellipse vertically)
    const getBoundaries = (y: number): { left: number; right: number } | null => {
      const dy = (y - cy) / ry;
      if (Math.abs(dy) >= 1) return null; // outside ellipse vertically
      const curveOffset = rx * Math.sqrt(1 - dy * dy);
      return { left: cx - curveOffset, right: cx + curveOffset };
    };

    // Alpha for a point at (x, y) based on distance to nearest ellipse boundary
    const edgeAlpha = (x: number, y: number): number => {
      const b = getBoundaries(y);
      if (!b) return BASE; // row is outside ellipse vertically — full opacity
      if (x >= b.left && x <= b.right) return 0; // inside ellipse
      const dist = x < b.left ? b.left - x : x - b.right;
      return BASE * Math.min(1, dist / FADE);
    };

    // ─── Vertical fade alpha ────────────────────────────────────────────────
    const vAlpha = (y: number): number => {
      if (y <= vFadeTop * h) return y / (vFadeTop * h);
      if (y >= vFadeBottom * h) return 1 - (y - vFadeBottom * h) / (h * (1 - vFadeBottom));
      return 1;
    };

    // ─── Draw horizontal lines with smooth gradient fade at ellipse boundary ─
    ctx.lineWidth = 1;

    for (let y = 0; y <= h; y += CELL) {
      const b = getBoundaries(y);

      if (!b) {
        // Full line at full opacity (row outside ellipse vertically)
        ctx.strokeStyle = `rgba(0,255,200,${BASE})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        continue;
      }

      // Draw full line using a gradient that fades near the ellipse boundaries
      const fadeStart = Math.max(0, b.left - FADE);
      const fadeEnd   = Math.min(w, b.right + FADE);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0,                 `rgba(0,255,200,${BASE})`);
      if (fadeStart / w > 0)
        grad.addColorStop(fadeStart / w,   `rgba(0,255,200,${BASE})`);
      grad.addColorStop(b.left / w,        "rgba(0,255,200,0)");
      grad.addColorStop(b.right / w,       "rgba(0,255,200,0)");
      if (fadeEnd / w < 1)
        grad.addColorStop(fadeEnd / w,     `rgba(0,255,200,${BASE})`);
      grad.addColorStop(1,                 `rgba(0,255,200,${BASE})`);

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // ─── Draw vertical lines: per-CELL segment with smooth fade alpha ────────
    for (let x = 0; x <= w; x += CELL) {
      // Draw in cell-height segments so alpha can vary with y
      for (let y = 0; y <= h; y += CELL) {
        const midY  = y + CELL / 2;
        const alpha = edgeAlpha(x, midY);
        if (alpha <= 0) continue;
        ctx.strokeStyle = `rgba(0,255,200,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, Math.min(y + CELL, h));
        ctx.stroke();
      }
    }

    // ─── Vertical fade via destination-out ─────────────────────────────────
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const vGrad = ctx.createLinearGradient(0, 0, 0, h);
    vGrad.addColorStop(0,           "rgba(0,0,0,1)");
    vGrad.addColorStop(vFadeTop,    "rgba(0,0,0,0)");
    vGrad.addColorStop(vFadeBottom, "rgba(0,0,0,0)");
    vGrad.addColorStop(1,           "rgba(0,0,0,1)");
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // ─── Glowing dots ───────────────────────────────────────────────────────
    ctx.save();
    for (let x = 0; x <= w; x += CELL) {
      for (let y = 0; y <= h; y += CELL) {
        const col = Math.round(x / CELL);
        const row = Math.round(y / CELL);
        if ((col + row) % dotFrequency !== 0) continue;

        const lineA = edgeAlpha(x, y) / BASE;
        if (lineA <= 0) continue;

        const va = vAlpha(y);
        if (va <= 0) continue;

        const combined = lineA * va;
        ctx.shadowBlur  = dotBlur;
        ctx.shadowColor = `rgba(0,255,200,${dotGlowOpacity * combined})`;
        ctx.fillStyle   = `rgba(0,255,200,${dotOpacity * combined})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  const applyOpacity = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const vw = window.innerWidth;
    if (vw < 480) {
      canvas.style.display = "none";
    } else {
      canvas.style.display = "block";
      let opacity: number;
      if (vw >= 1024) {
        opacity = 1.0;
      } else if (vw >= 768) {
        // 1.0 → 0.4 as width goes 1024 → 768
        opacity = 0.4 + ((vw - 768) / (1024 - 768)) * 0.6;
      } else {
        // 0.4 → 0.1 as width goes 768 → 480
        opacity = 0.1 + ((vw - 480) / (768 - 480)) * 0.3;
      }
      canvas.style.opacity = String(opacity);
    }
  };

  useEffect(() => {
    draw();
    applyOpacity();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      draw();
      applyOpacity();
    });
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />
    </div>
  );
}
