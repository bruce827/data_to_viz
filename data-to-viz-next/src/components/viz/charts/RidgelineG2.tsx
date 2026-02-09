'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import ridgelineData from './demoData/RidgelineG2.json';

// KDE 核心算法 (复用)
function kernelDensityEstimator(kernel: any, x: any) {
  return function(sample: any) {
    return x.map((xVal: any) => ({
      x: xVal,
      y: sample.reduce((acc: any, v: any) => acc + kernel(xVal - v), 0) / sample.length
    }));
  };
}
function epanechnikov(bandwidth: any) {
  return function(v: any) {
    v /= bandwidth;
    return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
  };
}

export function RidgelineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 60,
      paddingBottom: 40
    });

    // 1. 处理数据：按组计算 KDE 并平移 Y 轴
    const groups = ["2023", "2022", "2021", "2020"]; // 倒序排列以产生从上往下的重叠感
    const plotData: any[] = [];
    const ticks = Array.from({ length: 50 }, (_, i) => 40 + i * (110 - 40) / 49);
    const kde = kernelDensityEstimator(epanechnikov(5), ticks);

    groups.forEach((group, idx) => {
      const scores = ridgelineData.filter(d => d.group === group).map(d => d.score);
      const density = kde(scores);
      
      // 平移量：每个组向上抬升一定高度 (idx)
      const offset = idx;
      const maxDensity = Math.max(...density.map((d: any) => d.y));
      const scaleFactor = 1.5; // 控制重叠程度

      density.forEach((d: any) => {
        plotData.push({
          group,
          score: d.x,
          // 核心：y=[offset, offset + density]
          densityRange: [offset, offset + (d.y / maxDensity) * scaleFactor]
        });
      });
    });

    // 2. 渲染
    chart.options({
      type: 'area',
      data: plotData,
      encode: {
        x: 'score',
        y: 'densityRange',
        color: 'group',
      },
      scale: {
        color: { palette: 'blues' },
        y: { domain: [0, groups.length + 0.5] }
      },
      style: {
        fillOpacity: 0.8,
        stroke: '#fff',
        lineWidth: 1
      },
      axis: {
        x: { title: '分数分布' },
        y: { 
            title: '年份',
            labelFormatter: (v: any) => groups[Math.floor(v)] || ''
        }
      },
      tooltip: {
        title: (d: any) => d.group,
        items: [{ field: 'score', name: '分数' }]
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
