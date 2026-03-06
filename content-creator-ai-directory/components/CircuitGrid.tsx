"use client";

import { useRef, useEffect } from "react";

export function CircuitGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return;

    // Set physical pixel size, respecting device pixel ratio for sharpness
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

    // ─── Helper: alpha at (x, y) from fading rules ─────────────────────────
    const fadeAlpha = (x: number, y: number): number => {
      // Horizontal fade
      const leftFade  = 0.38 * w; // zero-alpha point coming from left
      const rightFade = 0.62 * w; // zero-alpha point coming from right
      let hAlpha: number;
      if (x <= leftFade) {
        hAlpha = 1 - x / leftFade;          // 1 at edge → 0 at 38%
      } else if (x >= rightFade) {
        hAlpha = (x - rightFade) / (w - rightFade); // 0 at 62% → 1 at edge
      } else {
        hAlpha = 0;                          // fully transparent in center
      }

      // Vertical fade
      const topFadeEnd    = 0.05 * h;
      const bottomFadeStart = 0.75 * h;
      let vAlpha: number;
      if (y <= topFadeEnd) {
        vAlpha = y / topFadeEnd;             // slight fade at very top
      } else if (y >= bottomFadeStart) {
        vAlpha = 1 - (y - bottomFadeStart) / (h - bottomFadeStart); // fade out bottom 25%
      } else {
        vAlpha = 1;
      }

      return hAlpha * vAlpha;
    };

    // ─── Draw grid lines column-by-column / row-by-row at per-pixel alpha ──
    // For performance, draw full lines then erase with a gradient composite.

    // Draw all grid lines at full color first
    ctx.save();
    ctx.strokeStyle = "rgba(0,255,200,0.10)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= w; x += CELL) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y <= h; y += CELL) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    // Erase center band using destination-out gradient (horizontal)
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const hGrad = ctx.createLinearGradient(0, 0, w, 0);
    hGrad.addColorStop(0,    "rgba(0,0,0,0)");   // left edge: keep
    hGrad.addColorStop(0.20, "rgba(0,0,0,0)");   // still fully kept
    hGrad.addColorStop(0.38, "rgba(0,0,0,1)");   // start erasing
    hGrad.addColorStop(0.62, "rgba(0,0,0,1)");   // fully erased (center)
    hGrad.addColorStop(0.80, "rgba(0,0,0,0)");   // restore right side
    hGrad.addColorStop(1,    "rgba(0,0,0,0)");   // right edge: keep
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, w, h);

    // Erase with vertical fade (top & bottom)
    const vGrad = ctx.createLinearGradient(0, 0, 0, h);
    vGrad.addColorStop(0,    "rgba(0,0,0,1)");   // erase very top
    vGrad.addColorStop(0.05, "rgba(0,0,0,0)");   // keep from 5%
    vGrad.addColorStop(0.75, "rgba(0,0,0,0)");   // start erasing bottom
    vGrad.addColorStop(1,    "rgba(0,0,0,1)");   // fully erased at bottom
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // ─── Draw glowing dots at every 3rd intersection, sides only ───────────
    const leftBoundary  = 0.30 * w;
    const rightBoundary = 0.70 * w;

    ctx.save();
    for (let x = 0; x <= w; x += CELL) {
      for (let y = 0; y <= h; y += CELL) {
        // Only every 3rd intersection column-wise (offset by column index)
        const col = Math.round(x / CELL);
        const row = Math.round(y / CELL);
        if ((col + row) % 3 !== 0) continue;

        // Only on the sides
        if (x > leftBoundary && x < rightBoundary) continue;

        const alpha = fadeAlpha(x, y);
        if (alpha <= 0) continue;

        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(0,255,200,${0.6 * alpha})`;
        ctx.fillStyle   = `rgba(0,255,200,${0.5 * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  useEffect(() => {
    draw();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 hidden md:block"
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
