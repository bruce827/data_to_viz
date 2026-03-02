'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type DensityPoint = {
  x: number;
  y: number;
};

/**
 * 手动实现简单的 KDE (Kernel Density Estimation)
 * 确保不依赖 G2 内部可能缺失的 transform。
 */
function kernelDensityEstimator(kernel: (v: number) => number, x: number[]) {
  return (sample: number[]): DensityPoint[] =>
    x.map((xVal) => ({
      x: xVal,
      y: sample.reduce((acc, v) => acc + kernel(xVal - v), 0) / sample.length,
    }));
}

function epanechnikov(bandwidth: number) {
  return (v: number): number => {
    const normalized = v / bandwidth;
    return Math.abs(normalized) <= 1 ? (0.75 * (1 - normalized * normalized)) / bandwidth : 0;
  };
}

export function DensityG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timer = window.setTimeout(() => {
      const chart = new Chart({
        container,
        autoFit: true,
        height: 300,
        paddingLeft: 40,
        paddingRight: 20,
        paddingBottom: 40,
      });

      // 1. 生成模拟数据 (考试成绩 40-100)
      const sampleData = Array.from({ length: 200 }, () => 70 + (Math.random() + Math.random() + Math.random() - 1.5) * 25);

      // 2. 手动计算 KDE 曲线点
      const xTicks = Array.from({ length: 50 }, (_, i) => 30 + (i * (110 - 30)) / 49);
      const kde = kernelDensityEstimator(epanechnikov(7), xTicks);
      const densityData = kde(sampleData);

      // 3. 渲染
      chart
        .area()
        .data(densityData)
        .encode('x', 'x')
        .encode('y', 'y')
        .encode('shape', 'area')
        .style('fill', '#2563eb')
        .style('fillOpacity', 0.4)
        .style('stroke', '#1d4ed8')
        .style('lineWidth', 2)
        .axis('x', { title: '变量分布 (典型数据)', titleFontSize: 12 })
        .axis('y', { title: '密度', titleFontSize: 12 })
        .tooltip({
          title: '数据分布',
          items: [{ channel: 'y', name: '概率密度', valueFormatter: (v: number) => v.toFixed(4) }],
        });

      chart.render();
      chartRef.current = chart;
    }, 150);

    return () => {
      window.clearTimeout(timer);
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
