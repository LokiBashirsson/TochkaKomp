'use client';

import { useEffect, useRef } from 'react';

/**
 * The signature element.
 *
 * Copper traces enter from the edges of the frame and route inward — in the
 * right angles and 45° dog-legs a real PCB uses — until they all terminate on a
 * single point. Pulses of current travel along them toward that point.
 *
 * That point is the brand: «точка» is Russian for a dot, and the store's whole
 * proposition is being the place where loose parts become one working machine.
 * The decoration is the argument.
 *
 * Cost control: one canvas, one rAF, geometry generated once per resize. The
 * loop stops when the element scrolls out of view or the tab is hidden, and
 * never starts at all under `prefers-reduced-motion` — a single static frame is
 * drawn instead, so the composition still reads.
 */

interface Trace {
  points: { x: number; y: number }[];
  lengths: number[];
  total: number;
  /** 0..1 position of the travelling pulse. */
  offset: number;
  speed: number;
  width: number;
}

const TRACE_COUNT = 22;
const PULSE_LENGTH = 130;

function buildTraces(width: number, height: number, focusX: number, focusY: number): Trace[] {
  const traces: Trace[] = [];

  for (let index = 0; index < TRACE_COUNT; index += 1) {
    const angle = (index / TRACE_COUNT) * Math.PI * 2 + Math.random() * 0.22;
    const reach = Math.max(width, height) * (0.62 + Math.random() * 0.5);

    const startX = focusX + Math.cos(angle) * reach;
    const startY = focusY + Math.sin(angle) * reach;

    // Terminate on a ring around the focus rather than the exact centre, so the
    // convergence reads as a pad on a board, not a starburst.
    const padRadius = 26 + Math.random() * 46;
    const endX = focusX + Math.cos(angle) * padRadius;
    const endY = focusY + Math.sin(angle) * padRadius;

    const dx = endX - startX;
    const dy = endY - startY;

    // Route: run straight, break at 45°, run straight again. This is the shape
    // that makes it legible as a trace instead of a generic line.
    const diagonal = Math.min(Math.abs(dx), Math.abs(dy)) * (0.45 + Math.random() * 0.3);
    const signX = Math.sign(dx);
    const signY = Math.sign(dy);
    const axisFirst = Math.abs(dx) > Math.abs(dy);

    const bend1 = axisFirst
      ? { x: startX + (dx - signX * diagonal), y: startY }
      : { x: startX, y: startY + (dy - signY * diagonal) };

    const bend2 = axisFirst
      ? { x: bend1.x + signX * diagonal, y: startY + dy }
      : { x: startX + dx, y: bend1.y + signY * diagonal };

    const points = [{ x: startX, y: startY }, bend1, bend2, { x: endX, y: endY }];

    const lengths: number[] = [];
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1]!;
      const b = points[i]!;
      const segment = Math.hypot(b.x - a.x, b.y - a.y);
      lengths.push(segment);
      total += segment;
    }

    traces.push({
      points,
      lengths,
      total,
      offset: Math.random(),
      speed: 0.055 + Math.random() * 0.075,
      width: Math.random() > 0.72 ? 1.6 : 1,
    });
  }

  return traces;
}

/** Point at `distance` along a trace, walking its segments. */
function pointAt(trace: Trace, distance: number): { x: number; y: number } {
  let remaining = distance;
  for (let i = 0; i < trace.lengths.length; i += 1) {
    const segment = trace.lengths[i]!;
    if (remaining <= segment) {
      const a = trace.points[i]!;
      const b = trace.points[i + 1]!;
      const t = segment === 0 ? 0 : remaining / segment;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    remaining -= segment;
  }
  return trace.points[trace.points.length - 1]!;
}

export function TraceField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let traces: Trace[] = [];
    let width = 0;
    let height = 0;
    let focusX = 0;
    let focusY = 0;
    let frame = 0;
    let lastTime = 0;
    let visible = true;

    const readColor = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#e1703a';

    let copper = readColor('--tc-copper');
    let caspian = readColor('--tc-caspian');

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The focus sits where the headline's copper dot lands in the layout.
      focusX = width * (width < 720 ? 0.5 : 0.68);
      focusY = height * (width < 720 ? 0.42 : 0.5);

      traces = buildTraces(width, height, focusX, focusY);
      copper = readColor('--tc-copper');
      caspian = readColor('--tc-caspian');
    }

    function drawStatic() {
      context!.clearRect(0, 0, width, height);
      context!.lineCap = 'round';
      context!.lineJoin = 'round';

      for (const trace of traces) {
        context!.beginPath();
        context!.moveTo(trace.points[0]!.x, trace.points[0]!.y);
        for (let i = 1; i < trace.points.length; i += 1) {
          context!.lineTo(trace.points[i]!.x, trace.points[i]!.y);
        }
        context!.strokeStyle = copper;
        context!.globalAlpha = 0.16;
        context!.lineWidth = trace.width;
        context!.stroke();
      }

      // The pad: a filled dot with a soft halo, where every trace lands.
      context!.globalAlpha = 1;
      const halo = context!.createRadialGradient(focusX, focusY, 0, focusX, focusY, 90);
      halo.addColorStop(0, copper);
      halo.addColorStop(1, 'transparent');
      context!.globalAlpha = 0.28;
      context!.fillStyle = halo;
      context!.beginPath();
      context!.arc(focusX, focusY, 90, 0, Math.PI * 2);
      context!.fill();

      context!.globalAlpha = 1;
      context!.fillStyle = copper;
      context!.beginPath();
      context!.arc(focusX, focusY, 4.5, 0, Math.PI * 2);
      context!.fill();
    }

    function drawPulses(delta: number) {
      context!.lineCap = 'round';

      for (const trace of traces) {
        trace.offset = (trace.offset + trace.speed * delta) % 1;
        const head = trace.total * (1 - trace.offset);
        const tail = Math.max(0, head - PULSE_LENGTH);
        if (head - tail < 4) continue;

        const from = pointAt(trace, tail);
        const to = pointAt(trace, head);

        const gradient = context!.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.7, trace.width > 1 ? caspian : copper);
        gradient.addColorStop(1, copper);

        // Clip the pulse to the trace path so it bends with the routing.
        context!.save();
        context!.beginPath();
        context!.moveTo(trace.points[0]!.x, trace.points[0]!.y);
        for (let i = 1; i < trace.points.length; i += 1) {
          context!.lineTo(trace.points[i]!.x, trace.points[i]!.y);
        }
        context!.lineWidth = trace.width + 2.2;
        context!.strokeStyle = gradient;
        context!.globalAlpha = 0.85;
        context!.setLineDash([PULSE_LENGTH, trace.total]);
        context!.lineDashOffset = trace.total * trace.offset;
        context!.stroke();
        context!.restore();
        context!.setLineDash([]);
      }
    }

    function loop(time: number) {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      drawStatic();
      drawPulses(delta);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (reduced || frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    resize();
    drawStatic();
    if (!reduced) start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      drawStatic();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // The canvas is decoration; screen readers and print get nothing.
      role="presentation"
    />
  );
}
