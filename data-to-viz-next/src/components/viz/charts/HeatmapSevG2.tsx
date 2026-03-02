'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type HeatCell = {
  x: number;
  y: number;
  v: number;
};

type PointerMoveEvent = {
  x?: number;
  y?: number;
};

// 手动实现简单节流，避免额外依赖。
function throttle<TArgs extends unknown[]>(func: (...args: TArgs) => void, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: TArgs) => {
    if (timeoutId) return;
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

export function HeatmapSevG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 300;

    const chart = new Chart({
      container,
      width,
      height,
      padding: 0,
    });

    chart.style({
      viewFill: '#f8fafc',
    });

    chart.data([]);
    chart.axis(false);

    chart
      .heatmap()
      .encode('x', 'x')
      .encode('y', 'y')
      .encode('color', 'v')
      .scale('x', { domain: [0, width] })
      .scale('y', { domain: [0, height], range: [0, 1] })
      .style('opacity', 0.8)
      .style('radius', 20)
      .tooltip(false)
      .animate(false);

    chart.render();

    const transform = (dataMap: Record<string, Record<string, number>>): HeatCell[] => {
      const cells: HeatCell[] = [];
      Object.keys(dataMap).forEach((x) => {
        Object.keys(dataMap[x]).forEach((y) => {
          cells.push({ x: Number(x), y: Number(y), v: dataMap[x][y] });
        });
      });
      return cells;
    };

    const handleMove = throttle((event: PointerMoveEvent) => {
      const { x, y } = event;
      if (x === undefined || y === undefined) return;

      const gridSize = 8;
      const kx = Math.floor(x - (x % gridSize));
      const ky = Math.floor(y - (y % gridSize));

      if (!dataRef.current[kx]) dataRef.current[kx] = {};
      if (!dataRef.current[kx][ky]) dataRef.current[kx][ky] = 0;
      dataRef.current[kx][ky] += 1;

      chart.changeData(transform(dataRef.current));
    }, 50);

    chart.on('plot:pointermove', handleMove);

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="relative group overflow-hidden rounded-lg border border-slate-200">
      <div ref={containerRef} className="cursor-crosshair" />
      <div className="absolute top-2 left-2 pointer-events-none bg-white/80 px-2 py-1 rounded text-[10px] text-slate-500 shadow-sm">
        移动鼠标在此区域划过以生成热力
      </div>
    </div>
  );
}
