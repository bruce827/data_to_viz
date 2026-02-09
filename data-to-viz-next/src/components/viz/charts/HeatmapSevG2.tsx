'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

// 手动实现简单的节流函数，避免引入 lodash
function throttle(func: Function, wait: number) {
  let timeout: any = null;
  return function(this: any, ...args: any[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, wait);
    }
  };
}

export function HeatmapSevG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = 300;

    const chart = new Chart({
      container: containerRef.current,
      width: width,
      height: height,
      padding: 0,
    });

    // 背景色配置
    chart.style({
      viewFill: '#f8fafc', // 改为浅色背景以符合项目风格
    });

    chart.data([]);
    chart.axis(false);

    // 配置热力图标记
    chart
      .heatmap()
      .encode('x', 'x')
      .encode('y', 'y')
      .encode('color', 'v')
      .scale('x', { domain: [0, width] })
      .scale('y', { domain: [0, height], range: [0, 1] })
      .style('opacity', 0.8)
      .style('radius', 20) // 增加热力半径
      .tooltip(false)
      .animate(false);

    chart.render();

    // 数据转换函数
    const transform = (dataMap: Record<string, Record<string, number>>) => {
      const arr: any[] = [];
      Object.keys(dataMap).forEach((x) => {
        Object.keys(dataMap[x]).forEach((y) => {
          arr.push({ x: Number(x), y: Number(y), v: dataMap[x][y] });
        });
      });
      return arr;
    };

    // 监听鼠标移动并更新数据
    const handleMove = throttle((e: any) => {
      const { x, y } = e;
      if (x === undefined || y === undefined) return;

      // 坐标对齐格栅
      const gridSize = 8;
      const kx = Math.floor(x - (x % gridSize));
      const ky = Math.floor(y - (y % gridSize));

      if (!dataRef.current[kx]) dataRef.current[kx] = {};
      if (!dataRef.current[kx][ky]) dataRef.current[kx][ky] = 0;

      dataRef.current[kx][ky] += 1;

      const d = transform(dataRef.current);
      chart.changeData(d);
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