'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

/**
 * 手动实现简单的 KDE (Kernel Density Estimation)
 * 确保不依赖 G2 内部可能缺失的 transform
 */
function kernelDensityEstimator(kernel: (v: number) => number, x: number[]) {
  return function(sample: number[]) {
    return x.map(xVal => ({
      x: xVal,
      y: sample.reduce((acc, v) => acc + kernel(xVal - v), 0) / sample.length
    }));
  };
}

function epanechnikov(bandwidth: number) {
  return function(v: number) {
    v /= bandwidth;
    return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
  };
}

export function DensityG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        height: 300,
        paddingLeft: 40,
        paddingRight: 20,
        paddingBottom: 40,
      });

      // 1. 生成模拟数据 (考试成绩 40-100)
      const sampleData = Array.from({ length: 200 }, () => {
        return 70 + (Math.random() + Math.random() + Math.random() - 1.5) * 25;
      });

      // 2. 手动计算 KDE 曲线点
      const xTicks = Array.from({ length: 50 }, (_, i) => 30 + i * (110 - 30) / 49);
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
           items: [{ channel: 'y', name: '概率密度', valueFormatter: (v: any) => v.toFixed(4) }]
        });

      chart.render();
      (containerRef.current as any).chart = chart;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (containerRef.current && (containerRef.current as any).chart) {
        (containerRef.current as any).chart.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}